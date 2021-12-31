import stripe from 'stripe'

export default function stripePlugin (app, opts) {
  app.stripe = stripe(opts)
  app.use(function stripeMiddleware (req, res, next) {
    req.stripe = app.stripe
    next()
  })
}
