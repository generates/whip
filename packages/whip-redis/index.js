import Redis from 'ioredis'

export default function redisPlugin (app, opts) {
  app.redis = new Redis(opts)
  app.use(function redisMiddleware (req, res, next) {
    req.redis = app.redis
    next()
  })
}
