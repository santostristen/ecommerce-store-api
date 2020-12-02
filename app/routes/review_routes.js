const express = require('express')
const passport = require('passport')

const Product = require('../models/product')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.post('/reviews/:productId', requireToken, (req, res, next) => {
  // extract the review from the incoming request's data (req.body)
  const reviewData = req.body.review
  // extract the product's id that we plan to add a review for
  reviewData.owner = req.user._id
  const productId = req.params.productId
  // Find the product document with the id of `productId`
  Product.findById(productId)
    // throw (cause) a new DocumentNotFoundError to occur, if we couldn't find
    // the product. Otherwise, pass the product along to the next `then`
    .then(handle404)
    .then(product => {
      // add a review to the product's reviews subdocument array
      product.reviews.push(reviewData)
      // save the product (parent) document
      return product.save()
    })
    // respond w/ the product we created and a status code of 201 created
    .then(product => res.status(201).json({ product }))
    // if an error occurs, run the next middleware, which is the error handling
    // middleware since it is registered last
    .catch(next)
})

router.delete('/reviews/:reviewId/:productId', requireToken, (req, res, next) => {
  // extract the reviewId and productId from our route parameters (req.params)
  const { reviewId, productId } = req.params

  Product.findById(productId)
    .then(handle404)
    .then(product => {
      // select the specific review from the reviews subdocument array then remove it
      const review = product.reviews.id(reviewId)

      requireOwnership(req, review)

      review.remove()

      // save the product with the now deleted review
      return product.save()
    })
    // respond with the status code 204 no content
    .then(() => res.sendStatus(204))
    // if an error occurs, run the next middleware, which is the error handling middleware since it is registered last
    .catch(next)
})

// update a single review
router.patch('/reviews/:reviewId/:productId', requireToken, removeBlanks, (req, res, next) => {
  // extracting the reviewId and productId from our route parameters (req.params)
  const { reviewId, productId } = req.params
  // extract review from the incoming data (req.body)
  const reviewData = req.body.review
  // find the product
  Product.findById(productId)
    .then(handle404)
    .then(product => {
      // find the specific review in the product's reviews subdocument array
      const review = product.reviews.id(reviewId)
      requireOwnership(req, review)
      // update the properties of the review document with the properties
      // from reviewData
      review.set(reviewData)
      // save the updates to our review
      return product.save()
    })
    // respond with the status code 204 no content
    .then(() => res.sendStatus(204))
    // if an error occurs, call the next middleware
    // the middleware after this route's middleware, is the error handling middleware
    .catch(next)
})
// get a single review
router.get('/reviews/:reviewId/:productId', requireToken, (req, res, next) => {
  // extracting the reviewId and productId from our route parameters (req.params)
  const { reviewId, productId } = req.params

  // find the product
  Product.findById(productId)
    .then(handle404)
    .then(product => {
      // find the specific review in the product's reviews subdocument array
      return product.reviews.id(reviewId)
    })
    // respond with the status code 204 no content
    .then(review => res.json({ review }))
    // if an error occurs, call the next middleware
    // the middleware after this route's middleware, is the error handling middleware
    .catch(next)
})

module.exports = router
