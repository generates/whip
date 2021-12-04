import nodemailer from 'nodemailer'
// import Mailgen from 'mailgen'

export default function redisPlugin (app, opts) {
  app.nodemailer = nodemailer.createTransport(opts.transport)
  // app.mailgen = new Mailgen(opts.mailgen)
  app.use(function redisMiddleware (req, res, next) {
    req.nodemailer = app.nodemailer
    // req.mailgen = app.mailgen
    next()
  })
}
