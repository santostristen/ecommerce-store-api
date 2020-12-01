const express = require('express')
const passport = require('passport')

const Product = require('../models/product')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/products', requireToken, (req, res, next) => {
  Product.find()
    .then(products => {
      res.json({ products })
    })
    .catch(next)
})

router.patch('/products/:id', requireToken, removeBlanks, (req, res, next) => {
  // block attempts to change ownership
  delete req.body.product.owner

  Product.findById(req.params.id)
    .then(handle404)
    .then(product => {
      // throw an error if attempt to update when not the owner
      requireOwnership(req, product)

      // pass the result
      return product.updateOne(req.body.product)
    })
    // success -> status 204
    .then(() => res.sendStatus(204))
    // if error
    .catch(next)
})

router.post('/products', requireToken, (req, res, next) => {
  req.body.product.owner = req.user.id

  Product.create(req.body.product)
    .then(product => {
      res.status(201).json({ product: product.toObject() })
    })
    .catch(next)
})

// SHOW Product
router.get('/products/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the
  // :id in the route
  Product.findById(req.params.id)
    .then(handle404)
    // if you can find by id, respond (200)
    // and send the client some json
    .then(product => res.status(200).json({ product: product }))
    // if error, pass to handler
    .catch(next)
})

// DELETE Product
router.delete('/products/:id', requireToken, (req, res, next) => {
  Product.findById(req.params.id)
    .then(handle404)
    .then(product => {
      // throw error if they dont own purchase
      requireOwnership(req, product)
      product.deleteOne()
    })
    // send back (204) with no need for JSON
    .then(() => res.sendStatus(204))
    // send to error handler on errors
    .catch(next)
})

module.exports = router
