const express = require("express")
const cors = require('cors')
const router = express.Router()
const isEmpty = require("is-empty")
const Product = require("../../models/products")
const validateProductInput = require("../../validations/products")
const multer = require('multer')
//set the image's storage
const storage = multer.diskStorage({
  //assets is the destination folder where ill save the images
  destination: function (req, file, cb) {
    cb(null, './assets/')
  },
  //store the image with the image name
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
//reject or accept a mimetype file
const fileFilter = function(req, file, cb) {
  if(file.mimetype === 'image/jpg' || 'image/png' || 'image/svg') {
    //accept file
    cb(null, true)
  }
  else{
    //reject file
    cb(new Error({message:'file type must be .jpg, .png or .svg'}), false)
  }
}


const upload = multer(
  {
    storage:storage,
    limits:
    {
      fileSize:(1024 * 1024 * 5) //limit is 5MB
    },
    fileFilter:fileFilter
  }
)

router.get('/', function(req, res) {
  Product.find({}).then(products => {
      if(products)
        res.status(200).json(products)
      else {
        throw new Error({message:'Product not found'})
      }
    })
  .catch(error => {
      throw new Error(error)
  })
})

router.get('/:id', function (req, res) {
  Product.findOne({id: req.params.id}).then( product => {
    if(product) {
      let products = []
      products.push(product)
      res.status(200).json(products);
    }
    else {
      throw new Error ({message:"this product does not exist"})
    }
  })
})

router.post('/', function (req, res) {
  // Form validation
  const { errors, isValid } = validateProductInput(req.body)
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }
  else {
  let newId = 0;
  Product.find().limit(1).sort({$natural:-1}).then( product => {
    if(isEmpty(product)) {
      newId = (newId + 1)
    }
    else {
      newId = (product[0].id + 1)
    }
  }).then(() => {
      Product.findOne({name:req.body.name}).then(product => {
      if(product === null) {
        const newProduct = new Product({
          id: newId,
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: req.body.image
        })
        newProduct.save().then(product => res.json(product)).catch(err => console.log(err))
      }
      else {
          throw new Error({message:'The product already exist'})
        }
      })
    })
    .catch(error => {
      throw new Error(error)
    })
  }
})

router.put('/:id', function (req, res) {
  console.log('finding one')
  Product.findOne({id: req.params.id}).then(product => {
    if(product) {
      product.name = req.body.name,
      product.price = req.body.price,
      product.description = req.body.description
      product.save()
      Product.find({}).then(products => {
        res.status(200).json(products)
      })
      .catch(error => {
          throw new Error(error)
      })
    }
    else {
      throw new Error({message:'An error has ocurred'})
    }
  })
  .catch(error => {
    throw new Error(error)
  })
})

router.delete('/:id', function (req, res) {
  Product.findOneAndDelete({id:req.params.id}).then( product => {
    if(product) {
      res.status(200).json(product)
    }
    else {
      throw new Error('The product can not be deleted')
    }
  })
  .catch(error => {
      throw new Error(error)
    }
  )
})


module.exports = router;
