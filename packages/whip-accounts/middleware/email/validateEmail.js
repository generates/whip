import { ValidationError } from '@generates/whip'

export default async function validateResetPassword (req, res, next) {
  const logger = req.logger.ns('whip.accounts.password')
  logger.debug('validateResetPassword', { body: req.body })

  const { resetPasswordValidator } = req.opts.accounts
  const validation = await resetPasswordValidator.validate(req.body)
  if (validation.isValid) {
    req.state.validation = validation
    next()
  } else {
    throw new ValidationError(validation)
  }
}
