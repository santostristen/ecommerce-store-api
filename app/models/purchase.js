const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema({
  productTally: {
    type: Object,
    required: true
  },
  totalPrice: {
    type: Number,
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

module.exports = mongoose.model('Purchase', purchaseSchema)
