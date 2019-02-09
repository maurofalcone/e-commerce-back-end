const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProductSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
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
    required: false
  },
  price: {
    type: Number,
    require: true
  }
})

const Product = mongoose.model("products", ProductSchema)

module.exports = Product
