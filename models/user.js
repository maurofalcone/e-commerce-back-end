const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: 0
  }
})

const User = mongoose.model("users", UserSchema)

module.exports = User
