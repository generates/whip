import bcrypt from 'bcrypt'

export default async function hashPassword (req, res, next) {
  // Hash the user's password using bcrypt.
  const data = req.state.validation?.data
  const password = data?.newPassword || data?.password
  if (password) {
    const logger = req.logger.ns('whip.accounts.password')
    logger.debug('password.hashPassword', { password })
    const salt = await bcrypt.genSalt(req.opts.accounts.hash.rounds)
    req.state.hashedPassword = await bcrypt.hash(password, salt)
  }
  next()
}
