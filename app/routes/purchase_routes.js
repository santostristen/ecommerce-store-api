const express = require('express')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// Tavish Index
router.get('/purchases', requireToken, (req, res, next) => {
  Purchase.find({ owner: req.user._id })
    .then(purchases => {
      res.json({ purchases })
    })
    .catch(next)
})

// UPDATE - PATCH TOKEN
router.patch('/purchases/:id', requireToken, removeBlanks, (req, res, next) => {
  // block attempts to change ownership
  delete req.body.purchase.owner

  Listing.findById(req.params.id)
    .then(handle404)
    .then(listing => {
      // throw an error if attempt to update when not the owner
      requireOwnership(req, purchase)

      // pass the result
      return listing.updateOne(req.body.purchase)
    })
    // success -> status 204
    .then(() => res.sendStatus(204))
    // if error
    .catch(next)
})
