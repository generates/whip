import { ValidationError } from '@generates/whip'

export default async function validate (opts) {
  if (!opts?.validator) {
    throw new Error('Missing validator option for validate middleware')
  }

  return function validateMiddleware (req, res, next) {
    const logger = req.logger.ns('whip.data')
    logger.debug(opts.validator, { body: req.body })

    const validator = req.opts.validators[opts.validator]
    const validation = await validator.validate(req.body)
    if (validation.isValid) {
      req.state.validation = validation
      next()
    } else {
      throw new ValidationError(validation)
    }
  }
}
