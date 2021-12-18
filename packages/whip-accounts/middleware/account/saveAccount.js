export default async function saveAccount (req, res, next) {
  const id = req.state.account?.id
  if (id) {
    delete req.state.account.tokens
    await req.prisma.account.update({ where: { id }, data: req.state.account })
  }
  next()
}
