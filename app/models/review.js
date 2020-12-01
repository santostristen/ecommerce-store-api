const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  head: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = reviewSchema
