import { UnauthorizedError } from '@generates/whip'

export default async function checkSession (req, res, next) {
  if (req.session.account) next()
  req.logger.ns('whip.accounts.session').debug('TODO')
  throw new UnauthorizedError({ unverified: req.session.unverifiedAccount })
}
