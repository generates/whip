export default async function getAccount (req, res, next) {
  const input = req.state.input
  const username = req.session.account?.username || input?.username
  const email = req.session.account?.email || input?.email
  if (username || email) {
    const where = {
      OR: [
        { username: username || email },
        { email: email || username }
      ],
      enabled: true
    }

    // TODO:
    // Also query the account roles if a relation is defined on the Account
    // model.
    // if (Account.relationMappings.roles) query.withGraphJoined('roles')
    req.state.account = await req.prisma.account.findFirst({ where })
  }
  const debug = { email, account: req.state.account }
  req.logger.ns('whip.accounts').debug('account.getAccount', debug)
  next()
}
