import { ValidationError } from '@generates/whip'
import verifyEmailValidator from '../../validators/verifyEmailValidator.js'

export default async function validateVerifyEmail (req, res, next) {
  const logger = req.logger.ns('whip.accounts.email')
  logger.debug('email.validateVerifyEmail', { body: req.body })

  const validation = await verifyEmailValidator.validate(req.body)
  if (validation.isValid) {
    req.state.validation = validation
    next()
  } else {
    throw new ValidationError(validation)
  }
}
