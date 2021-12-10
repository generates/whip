export default async function getEmailToken (req, res, next) {
  const logger = req.logger.ns('whip.accounts.email')

  req.state.account = await req.prisma.account
    .findFirst({
      where: { email: req.state.validation.data.email },
      orderBy: { createdAt: 'desc' },
      include: { tokens: true }
    })

  logger.debug('getEmailToken • Account', req.state.account)

  next()
}
