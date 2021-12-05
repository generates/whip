import bcrypt from 'bcrypt'
import uid from 'uid-safe'

async function handleCreateToken (req, res, next, options = {}) {
  req.state.token = await uid(options.bytes || req.opts.hash.bytes)
  const rounds = options.rounds || req.opts.hash.rounds
  req.state.hashedToken = await bcrypt.hash(req.state.token, rounds)

  const debug = { token: req.state.token, hashedToken: req.state.hashedToken }
  req.logger.ns('whip.accounts.token').debug('token.handleInsertToken', debug)

  next()
}

export default async function createToken (req, res, next) {
  if (!next) {
    const options = req
    return (req, res, next) => handleCreateToken(req, res, next, options)
  }
  return handleCreateToken(req, res, next)
}
