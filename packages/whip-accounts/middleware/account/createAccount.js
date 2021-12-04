import { merge } from '@generates/merger'
import { excluding } from '@generates/extractor'

export default async function createAccount (req, res, next) {
  const logger = req.logger.ns('whip.accounts.account')
  const password = req.state.hashedPassword
  const data = merge({}, req.state.validation.data, { password })
  logger.debug('signUp.createAccount', data)

  try {
    // Create the account by saving the submitted data to the database.
    req.state.account = await req.prisma.account.create(data)
    const account = excluding(req.state.account, 'password')
    logger.info('signUp.createAccount • Account created', account)

    // Add a property to the session indicating that it belongs to a user who
    // has not completed the email verification process.
    // ctx.session.unverifiedAccount = true
  } catch (err) {
    if (err.message.includes('accounts_email_unique')) {
      const account = await req.prisma.account.findOne({ email: data.email })
      if (account?.emailVerified) {
        // Warn about the request trying to register an email address already
        // associated with an existing, verified account.
        logger.warn('signUp.createAccount', err)
      } else if (account) {
        // If the account isn't verified, overwrite it with the data from the
        // request so that others can't block a user from creating an account
        // with their email address.
        const where = { id: account.id }
        logger.warn('signUp.createAccount • Updating unverified account', where)

        req.state.account = await req.prisma.account.update({ where, data })
      }
    } else {
      throw err
    }
  }

  // Set the status to 201 to indicate a new user account was created (whether
  // this is true or not so that the app doesn't leak registration information).
  // The session won't be created until they complete the email verification
  // process.
  req.state.status = 201
  req.state.body = { message: 'Sign up successful!' }
  next()
}
