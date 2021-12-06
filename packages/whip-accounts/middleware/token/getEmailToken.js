export default async function getEmailToken (req, res, next) {
  const logger = req.logger.ns('whip.accounts.email')

  req.state.account = await req.prisma.token
    .findOne({
      where: { email: req.state.validation.data.email },
      orderBy: { createdAt: 'desc' }
    })

  logger.debug('getEmailToken • Account', req.state.account)

  next()
}
