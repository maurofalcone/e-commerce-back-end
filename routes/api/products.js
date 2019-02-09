const express = require("express")
const router = express.Router()
const isEmpty = require("is-empty")
const Product = require("../../models/products")

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
      res.status(200).json(product);
    }
    else {
      throw new Error ({message:"this product does not exist"})
    }
  })
})

router.post('/', function (req, res) {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body)
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
  Product.findOneAndUpdate({id:req.params.id},{$set:{name:req.body.name}},{$set:{price:req.body.price}},{$set:{image:req.body.image}},{$set:{description:req.body.description}}).then(product => {
    if(product) {
      res.status(200).json({product})
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
      res.status(200).json({message:'The product has been deleted'})
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
