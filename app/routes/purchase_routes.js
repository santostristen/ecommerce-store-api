const express = require('express')
const passport = require('passport')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/purchases', requireToken, (req, res, next) => {
  Purchase.find({ owner: req.user._id })
    .then(purchases => {
      res.json({ purchases })
    })
    .catch(next)
})

router.post('/purchases', requireToken, (req, res, next) => {
  req.body.purchase.owner = req.user.id

  Purchase.create(req.body.purchase)
    .then(purchase => {
      res.status(201).json({ purchase: purchase.toObject() })
    })
    .catch(next)
})
