function handleSendEmail (req, res, next, options) {
  const { from, replyTo } = req.opts.email
  const email = {
    ...from ? { from } : {},
    ...replyTo ? { replyTo } : {},
    ...options
  }

  // If email is enabled, send the email using Nodemailer.
  if (req.state.email) {
    req.nodemailer.sendMail(
      { ...email, ...req.state.email },
      (err, info) => {
        const logger = req.logger.ns('whip.accounts.email')
        if (err) logger.error('email.handleSendEmail', err)
        logger.debug('email.handleSendEmail • Nodemailer response', info)
      }
    )
  }

  next()
}

export default function sendEmail (req, res, next) {
  if (!next) {
    const options = req
    return (req, res, next) => handleSendEmail(req, res, next, options)
  }
  return handleSendEmail(req, res, next)
}
