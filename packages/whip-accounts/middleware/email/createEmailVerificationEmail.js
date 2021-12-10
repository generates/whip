import { merge } from '@generates/merger'
import createUrl from '@ianwalter/url'

const defaults = { path: '/verify-email' }

function handleEmailVerificationEmail (req, res, next, options) {
  const url = createUrl(req.opts.baseUrl, options.path)
  const input = req.state.validation.data
  url.search = { email: input.email, token: req.state.token }
  const { emailVerification } = req.opts.accounts.email
  const data = { action: { href: url.href } }
  const html = req.stencil.render(merge({}, emailVerification, data))
  const subject = options.subject ||
    `${req.opts.accounts.name} Email Verification`

  // If the token was inserted, add the email information to ctx.state so that
  // the sendEmail middleware will send the email.
  if (req.state.tokenInserted) {
    req.state.email = { to: input.email, subject, html }
  }

  next()
}

export default function createEmailVerificationEmail (req, res, next) {
  let options = defaults
  if (!next) {
    options = merge({}, options, req)
    return (req, res, next) => (
      handleEmailVerificationEmail(req, res, next, options)
    )
  }
  return handleEmailVerificationEmail(req, res, next, options)
}
