export default async function resetSession (req, res, next) {
  const logger = req.logger.ns('whip.accounts.session')

  // Regenerate the session if this is a logout endpoint (no account on
  // ctx.state) or if this is a login endpoint but there is already a user
  // session.
  if (!req.state.account || req.session.account) {
    if (!req.session.account) logger.info('resetSession')
    if (req.session.account) logger.info('resetSession • Existing session')
    await req.regenerateSession()
    req.state.body = { csrfToken: req.generateCsrfToken() }
  }
  return next()
}
