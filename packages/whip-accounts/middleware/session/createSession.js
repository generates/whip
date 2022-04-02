import { BadRequestError } from '@generates/whip'

export default async function createSession (req, res, next) {
  const logger = req.logger.ns('whip.accounts.session')
  logger.debug('session.createSession', { account: req.state.account })

  if (req.state.account?.enabled) {
    logger.info(
      'session.createSession • Created session for account:',
      req.state.account.id
    )

    // If the rememberMe functionality is enabled and the user has selected
    // rememberMe, set the session cookie maxAge to null so that it won't have
    // a set expiry.
    if (req.opts.accounts.rememberMe && req.state.input.rememberMe) {
      logger.info('session.createSession • Setting cookie maxAge to null')
      req.session.cookie.maxAge = null
    }

    // Add the account data to the current session.
    req.session.account = req.state.account

    // Set the status to 201 to indicate a new user session was created.
    req.state.statusCode = 201

    // Add a CSRF token to the body (if it wasn't already added by clearSession)
    // so that the login response is consistent whether you are already logged
    // in or not.
    // TODO:
    // if (!req.state.body?.csrfToken) {
    //   req.state.body = { csrfToken: ctx.generateCsrfToken() }
    // }
    req.state.body = {}

    // Continue to the next middleware.
    next()
  } else {
    if (req.state.account) {
      logger.warn(
        'session.createSession • Disabled account login attempt',
        { accountId: req.state.account.id }
      )
    }

    // Inform the user that their account credentials are incorrect.
    throw new BadRequestError('Incorrect email or password')
  }
}
