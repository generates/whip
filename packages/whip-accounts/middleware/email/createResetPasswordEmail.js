import { merge } from '@generates/merger'
import createUrl from '@ianwalter/url'

const defaults = { path: '/reset-password' }

function handleResetPasswordEmail (req, res, next, options) {
  const url = createUrl(req.opts.baseUrl, options.path)
  const input = req.state.validation.data
  url.search = { email: input.email, token: req.state.token }
  const { resetPassword } = req.opts.accounts.email
  const data = { action: { href: url.href } }
  const html = req.stencil.render(merge({}, resetPassword, data))
  const subject = options.subject || 'Reset your password'

  // If the token was inserted, add the email information to ctx.state so that
  // the sendEmail middleware will send the email.
  if (req.state.tokenInserted) {
    req.state.email = { to: input.email, subject, html }
  }

  next()
}

export default function createResetPasswordEmail (req, res, next) {
  let options = defaults
  if (!next) {
    options = merge({}, options, req)
    return (req, res, next) => (
      handleResetPasswordEmail(req, res, next, options)
    )
  }
  return handleResetPasswordEmail(req, res, next, options)
}
