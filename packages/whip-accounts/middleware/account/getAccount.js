export default async function getAccount (req, res, next) {
  const email = req.session.account?.email || req.state.validation?.data?.email
  if (email) {
    // TODO:
    // Also query the account roles if a relation is defined on the Account
    // model.
    // if (Account.relationMappings.roles) query.withGraphJoined('roles')
    req.state.account = await req.prisma.account.findFirst({ where: { email } })
  }
  const debug = { email, account: req.state.account }
  req.logger.ns('whip.accounts').debug('account.getAccount', debug)
  next()
}
