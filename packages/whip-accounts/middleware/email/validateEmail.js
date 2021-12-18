import { ValidationError } from '@generates/whip'

export default async function validateEmail (req, res, next) {
  const logger = req.logger.ns('whip.accounts.email')
  logger.debug('validateEmail', { body: req.body })

  const { emailValidator } = req.opts.accounts
  const validation = await emailValidator.validate(req.body)
  if (validation.isValid) {
    req.state.validation = validation
    next()
  } else {
    throw new ValidationError(validation)
  }
}
