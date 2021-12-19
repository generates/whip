import nodemailer from 'nodemailer'
import Stencil from '@radval/stencil'

export { default as getTestEmail } from './lib/utilities/getTestEmail.js'
export { default as extractToken } from './lib/utilities/extractToken.js'

const defaults = {
  transport: {
    host: 'localhost'
  }
}

export default function emailPlugin (app, opts) {
  app.opts.email = Object.assign({}, defaults, opts)
  app.nodemailer = nodemailer.createTransport(app.opts.email.transport)
  app.stencil = new Stencil('transactional')
  app.use(function redisMiddleware (req, res, next) {
    req.nodemailer = app.nodemailer
    req.stencil = app.stencil
    next()
  })
}
