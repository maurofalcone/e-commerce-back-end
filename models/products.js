const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Date,
    default: Date.now
  }
})

const Product = mongoose.model("products", ProductSchema)

module.exports = Product
