import { merge } from '@generates/merger'
import createUrl from '@ianwalter/url'

const defaults = { path: '/verify-email' }

function handleEmailVerificationEmail (req, res, next, options) {
  const url = createUrl(req.opts.baseUrl, options.path)
  const input = req.state.validation.data
  url.search = { email: input.email, token: req.state.token }
  const { emailVerification } = req.opts.email.templates
  const data = { name: req.state.name, action: { button: { link: url.href } } }
  const body = merge({}, emailVerification, data)
  const html = req.mailgen.generate({ body })
  const subject = options.subject || `${req.opts.name} Email Verification`

  // If the token was inserted, add the email information to ctx.state so that
  // the sendEmail middleware will send the email.
  if (req.state.tokenInserted) {
    req.state.email = { to: input.email, subject, html }
  }

  return next()
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
