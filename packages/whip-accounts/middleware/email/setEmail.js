export default async function setEmail (req, res, next) {
  const logger = req.logger.ns('whip.accounts.email')
  const data = { email: req.state.input.email, emailVerified: true }
  logger.info('setEmail', { email: data.email })

  // Update the email and emailVerified values in the database and session. It's
  // safe to update the email here because if the request contained a different
  // email, the tokens wouldn't have matched, and the request wouldn't have
  // gotten here.
  const { email, emailVerified } = req.state.account
  if (email !== data.email || !emailVerified) {
    Object.assign(req.state.account, data)
    logger.info('setEmail • Email set')
  } else {
    logger.warn('setEmail • Email not set', { email, emailVerified })
  }

  // TODO:
  // Delete the property indicating the session belongs to a user who has not
  // completed the email verification process now that the user has.
  // delete req.session.unverifiedAccount

  next()
}
