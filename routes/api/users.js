const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
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
    throw new Error(errors)
  }
  else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user !== null) {
        throw new Error({ email: 'Email already exists' })
      }
      else {
          const newUser = new User({
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
// Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
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
              token: 'Bearer ' + token
            })
          }
        )
      } else {
        throw new Error({ passwordincorrect: 'Password incorrect' })
      }
    })
  })
})

module.exports = router
