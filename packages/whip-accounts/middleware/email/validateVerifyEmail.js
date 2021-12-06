import { ValidationError } from '@generates/whip'

export default async function validateAccount (req, res, next) {
  const logger = req.logger.ns('whip.accounts.email')
  // TODO:
  const { accountValidator } = req.opts.accounts
  logger.debug('account.validateVerifyEmail', { body: req.body })

  const validation = await accountValidator.validate(req.body)
  if (validation.isValid) {
    req.state.validation = validation
    next()
  } else {
    throw new ValidationError(validation)
  }
}
