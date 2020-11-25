const express = require('express')
const passport = require('passport')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/products', requireToken, (req, res, next) => {
  Purchase.find({ owner: req.user._id })
    .then(purchases => {
      res.json({ purchases })
    })
    .catch(next)
})

// SHOW PURCHASE
router.get('/purchases/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the
  // :id in the route
  Purchase.findById(req.params.id)
    .then(handle404)
    // if you can find by id, respond (200)
    // and send the client some json
    .then(purchase => res.status(200).json({ purchase: purchase }))
    // if error, pass to handler
    .catch(next)
})
// DELETE PURCHASE
router.delete('/purchases/:id', requireToken, (req, res, next) => {
  Purchase.findById(req.params.id)
    .then(handle404)
    .then(purchase => {
      // throw error if they dont own purchase
      requireOwnership(req, purchase)
      purchase.deleteOne()
    })
    // send back (204) with no need for JSON
    .then(() => res.sendStatus(204))
    // send to error handler on errors
    .catch(next)
})
