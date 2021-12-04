import bcrypt from 'bcrypt'

export default async function comparePasswords (req, res, next) {
  const logger = req.logger.ns('whip.accounts.password')
  const payload = req.state.validation?.data
  if (payload?.password) {
    // Determine the password to compare against.
    const password = req.state.account
      ? req.state.account.password
      : req.opts.accounts.dummyPassword

    // Compare the supplied password with the password hash saved in the
    // database to determine if they match.
    const passwordsMatch = await bcrypt.compare(payload.password, password)

    // Log the password and whether the passwords match for debugging purposes.
    const debug = { payload, password, passwordsMatch }
    logger.debug('password.comparePasswords', debug)

    if (!passwordsMatch && payload.email) {
      // The error message must be the same message as the one in
      // session/authenticate.
      // TODO:
      // throw new BadRequestError('Incorrect email or password')
      throw new Error('Incorrect email or password')
    } else if (!passwordsMatch) {
      // TODO:
      // throw new BadRequestError('Incorrect password')
      throw new Error('Incorrect password')
    }
  } else {
    logger.debug('password.comparePasswords skipped since password is empty')
  }
  next()
}
