const mongoose = require('mongoose')
const reviewSchema = require('./review')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  imgAlt: {
    type: String,
    required: false
  },
  reviews: [reviewSchema]
})

module.exports = mongoose.model('Product', productSchema)
