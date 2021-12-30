import stripe from 'stripe'

export default function redisPlugin (app, opts) {
  app.redis = stripe(opts)
  app.use(function stripeMiddleware (req, res, next) {
    req.stripe = app.stripe
    next()
  })
}
