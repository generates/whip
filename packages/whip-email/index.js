import nodemailer from 'nodemailer'
import Stencil from '@radval/stencil'

const defaults = {}

export default function redisPlugin (app, opts) {
  app.opts.email = Object.assign({}, defaults, opts)
  app.nodemailer = nodemailer.createTransport(app.opts.email.transport)
  app.stencil = new Stencil('transactional')
  app.use(function redisMiddleware (req, res, next) {
    req.nodemailer = app.nodemailer
    req.stencil = app.stencil
    next()
  })
}
