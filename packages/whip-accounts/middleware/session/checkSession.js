import { UnauthorizedError } from '@generates/whip'

export default async function checkSession (req, res, next) {
  if (req.session.account) {
    next()
  } else {
    req.logger.ns('whip.accounts.session').debug('No account found in session')
    throw new UnauthorizedError({ unverified: req.session.unverifiedAccount })
  }
}
