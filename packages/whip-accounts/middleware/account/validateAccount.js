export default async function validateAccount (req, res, next) {
  const logger = req.logger.ns('whip.accounts.account')
  const { accountValidator } = req.app.opts.accounts
  logger.debug('account.validateAccount', { body: req.body })

  const validation = await accountValidator.validate(req.body)
  if (validation.isValid) {
    req.state.validation = validation
    next()
  } else {
    // TODO:
    // throw new ValidationError(validation)
    throw new Error(validation)
  }
}
