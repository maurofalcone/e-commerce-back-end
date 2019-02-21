const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const isEmpty= require('is-empty')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
// Load input validation
const validateRegisterInput = require('../../validations/register')
const validateLoginInput = require('../../validations/login')
// Load User model
const User = require('../../models/User')

router.post('/register', (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body)
// Check validation
  if (!isValid) {
    res.status(400).json(errors)
  }
  else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        res.status(400).json({ email: 'Email already exists' })
      }
      else {
        let newId = 0;
        User.find().limit(1).sort({$natural:-1}).then( user => {
          if(isEmpty(user)) {
            newId = (newId + 1)
          }
          else {
            newId = (user[0].id + 1)
          }
            const newUser = new User({
              id: newId,
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            })
    // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err
              newUser.password = hash
              newUser.save().then(user => res.json(user)).catch(err => console.log(err))
            })
          })
        })
        .catch(error => {
          res.status(400).json({message:"an error has occurred"})
        })
      }
    })
  }
})

router.post('/login', (req, res) => {
  // Form validation
const { errors, isValid } = validateLoginInput(req.body)
// Check validation
  if (!isValid) {
    throw new Error(errors)
  }
  const email = req.body.email
  const password = req.body.password
// Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      throw new Error({ emailnotfound: 'Email not found' })
    }
    else {
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            user: user
          }
  // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: token
              })
            }
          )
        }
        else {
          throw new Error({ error: 'Password incorrect' })
        }
      })
    }
  })
})

router.post('/checkJWT', (req, res) => {
  const token = req.body.token
  if(token) {
    const data = jwt.decode(token)
    return res.status(200).json({data})
  }
   else {
     throw new Error({error:'Failed to login'})
   }
 })

module.exports = router
