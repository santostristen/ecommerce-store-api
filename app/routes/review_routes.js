const express = require('express')
const passport = require('passport')

const Review = require('../models/review')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/reviews', requireToken, (req, res, next) => {
  Review.find({ owner: req.user._id })
    .then(reviews => {
      res.json({ reviews })
    })
    .catch(next)
})

router.patch('/reviews/:id', requireToken, removeBlanks, (req, res, next) => {
  // block attempts to change ownership
  delete req.body.review.owner

  Review.findById(req.params.id)
    .then(handle404)
    .then(review => {
      // throw an error if attempt to update when not the owner
      requireOwnership(req, review)

      // pass the result
      return review.updateOne(req.body.review)
    })
    // success -> status 204
    .then(() => res.sendStatus(204))
    // if error
    .catch(next)
})

router.post('/reviews', requireToken, (req, res, next) => {
  req.body.review.owner = req.user.id

  Review.create(req.body.review)
    .then(review => {
      res.status(201).json({ review: review.toObject() })
    })
    .catch(next)
})

// SHOW REVIEW
router.get('/reviews/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the
  // :id in the route
  Review.findById(req.params.id)
    .then(handle404)
    // if you can find by id, respond (200)
    // and send the client some json
    .then(review => res.status(200).json({ review: review }))
    // if error, pass to handler
    .catch(next)
})

// DELETE REVIEW
router.delete('/reviews/:id', requireToken, (req, res, next) => {
  Review.findById(req.params.id)
    .then(handle404)
    .then(review => {
      // throw error if they dont own review
      requireOwnership(req, review)
      review.deleteOne()
    })
    // send back (204) with no need for JSON
    .then(() => res.sendStatus(204))
    // send to error handler on errors
    .catch(next)
})

module.exports = router
