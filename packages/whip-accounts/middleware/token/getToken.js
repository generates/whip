export default async function getToken (req, res, next) {
  const logger = req.logger.ns('whip.accounts.token')

  req.state.account = await req.prisma.account
    .findFirst({
      where: { email: req.state.input.email },
      orderBy: { createdAt: 'desc' },
      include: { tokens: true }
    })

  logger.debug('getToken • Account', req.state.account)

  next()
}
