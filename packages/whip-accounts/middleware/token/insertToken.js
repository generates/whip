import { merge } from '@generates/merger'
import { addDays } from 'date-fns'
import { nanoid } from 'nanoid'

const defaults = { type: 'email' }

async function handleInsertToken (req, res, next, options) {
  const account = req.state.account

  // Add response data to ctx.state.
  const isEmail = options.type === 'email'
  if (!req.state.body.message) {
    const t = isEmail ? 'Email Verification' : 'Forgot Password'
    req.state.body.message = options.message ||
      `${t} request submitted successfully`
  }

  const data = req.state.validation.data
  const logger = req.logger.ns('nrg.accounts.token')
  if (isEmail && !req.state.emailChanged && account && account.emailVerified) {
    // Log a warning that someone is trying to create a email verification token
    // for an account that already has it's email verified and is not tryting to
    // change their email.
    logger.warn(
      'token.handleInsertToken •',
      'Email token request that has already been verified',
      data
    )
  } else if (isEmail && !account) {
    // Log a warning that someone is trying to create a email verification token
    // for an account that doesn't exist.
    logger.warn(
      'token.handleInsertToken •',
      'Email token request that does not match an enabled account',
      { data, accountId: account?.id }
    )
  } else if (options.type === 'password' && !account) {
    // Log a warning that someone is trying to reset a password for an account
    // that doesn't exist.
    logger.warn(
      'token.handleInsertToken •',
      'Password token request that does not match an enabled account',
      { data, accountId: account?.id }
    )
  } else {
    const debug = {
      options,
      data,
      accountId: account.id,
      hashedToken: req.state.hashedToken
    }
    logger.debug('token.handleInsertToken • Inserting hashed token', debug)

    // Insert the token into the database. Don't wait for the insert to complete
    // so that information is not leaked through request timing.
    req.prisma.token
      .create({
        data: {
          id: nanoid(),
          value: req.state.hashedToken,
          type: options.type,
          email: data.email,
          accountId: account.id,
          expiresAt: addDays(new Date(), 1).toISOString()
        }
      })
      .catch(err => logger.error(`Error inserting ${options.type} token`, err))

    // Mark the token as having been inserted so that downstream middleware can
    // know whether if it's valid or not.
    req.state.tokenInserted = true
    req.state.name = account.firstName || account.name || account.username
  }

  next()
}

/**
 * Insert the hashed version of the generated token into the database.
 */
export default function insertToken (req, res, next) {
  let options = defaults
  if (!next) {
    options = merge({}, options, req)
    return (req, res, next) => handleInsertToken(req, res, next, options)
  }
  return handleInsertToken(req, res, next, options)
}
