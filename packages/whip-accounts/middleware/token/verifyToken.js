import bcrypt from 'bcrypt'
import { addDays, isPast } from 'date-fns'
import { BadRequestError } from '@generates/whip'

export default async function verifyToken (req, res, next) {
  let [token] = req.state.account?.tokens || []

  // If a matching token wasn't found, create a dummy token that can be used
  // to do a dummy compare to prevent against leaking information through
  // timing.
  const hasStoredToken = !!(token && token.value)
  if (!hasStoredToken) {
    token = {
      value: req.opts.accounts.hashedDummyPassword,
      expiresAt: addDays(new Date(), 1).toISOString()
    }
  }

  // Compare the supplied token value with the returned hashed token
  // value.
  const payload = req.state.validation.data
  const tokensMatch = await bcrypt.compare(payload.token, token.value)

  // Determine that the supplied token is valid if the token was found, the
  // token values match, and the token is not expired.
  const logger = req.logger.ns('nrg.accounts.token')
  const isTokenExpired = isPast(new Date(token.expiresAt))
  if (hasStoredToken && tokensMatch && !isTokenExpired) {
    // Delete the token now that it's been verified.
    req.prisma.token
      .delete({ where: { id: token.id } })
      .catch(err => logger.error(err))

    // Continue to the next middleware.
    next()
  } else {
    const info = { hasStoredToken, tokensMatch, isTokenExpired }
    logger.warn('token.verifyToken • Invalid token', info)
    logger.debug(
      'token.verifyToken • Tokens',
      { storedToken: token, ...payload }
    )

    // Return a 400 Bad Request if the token is invalid. The user cannot be told
    // if this is because the token is expired because that could leak that an
    // account exists in the system.
    throw new BadRequestError('Invalid token')
  }
}
