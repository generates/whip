export default async function verifyEmail (req, next) {
  const logger = req.logger.ns('whip.accounts.email')
  const data = { email: req.state.validation.data.email, emailVerified: true }
  logger.info('verifyEmail', { email: data.email })

  // Update the email and emailVerified values in the database and session. It's
  // safe to update the email here because if the request contained a different
  // email, the tokens wouldn't have matched, and the request wouldn't have
  // gotten here.
  const { email, emailVerified } = req.state.account
  if (email !== data.email || !emailVerified) {
    await req.prisma.account.patch(data)
    logger.info('verifyEmail • Account updated')
  } else {
    logger.warn('verifyEmail • Account not updated', { email, emailVerified })
  }

  // Delete the property indicating the session belongs to a user who has not
  // completed the email verification process now that the user has.
  delete req.session.unverifiedAccount

  return next()
}
