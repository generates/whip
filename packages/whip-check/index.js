import {
  any,
  array,
  bigint,
  boolean,
  date,
  enums,
  func,
  instance,
  integer,
  intersection,
  literal,
  map,
  never,
  number,
  nullable,
  object,
  optional,
  record,
  regexp,
  set,
  string,
  tuple,
  type,
  union,
  unknown,

  assert,
  create,
  is,
  validate,

  empty,
  max,
  min,
  nonempty,
  pattern,
  size,

  defaulted,
  trimmed,

  assign,
  deprecated,
  dynamic,
  lazy,
  omit,
  partial,
  pick,

  coerce,
  define,
  refine,

  StructError
} from 'superstruct'
import isEmail from 'isemail'
import zxcvbn from 'zxcvbn'
import parsePhoneNumber from 'libphonenumber-js'

export {
  any,
  array,
  bigint,
  boolean,
  date,
  enums,
  func,
  instance,
  integer,
  intersection,
  literal,
  map,
  never,
  number,
  nullable,
  object,
  optional,
  record,
  regexp,
  set,
  string,
  tuple,
  type,
  union,
  unknown,

  assert,
  create,
  is,
  validate,

  empty,
  max,
  min,
  nonempty,
  pattern,
  size,

  defaulted,
  trimmed,

  assign,
  deprecated,
  dynamic,
  lazy,
  omit,
  partial,
  pick,

  coerce,
  define,
  refine,

  StructError
}

export const defaultEmailOptions = { minDomainAtoms: 2 }
export const email = opts => define('email', function email (input) {
  return isEmail.validate(input, { ...defaultEmailOptions, ...opts })
})

// FIXME: inputs?
export const defaultPasswordOptions = { minScore: 3 }
export const password = opts => define('password', function password (input) {
  const config = { ...defaultPasswordOptions, ...opts }
  const result = zxcvbn(input)
  return result.score >= config.minScore
})

export const defaultPhoneOptions = { country: 'US' }
export const phone = opts => define('phone', function phone (input) {
  return parsePhoneNumber(input, { ...defaultPhoneOptions, ...opts })
})

export function lowercased (struct) {
  return coerce(struct, string(), i => i?.toLowerCase())
}

export function check (checkerName) {
  if (!checkerName) throw new Error('Missing checker for check middleware')

  return async function checkMiddleware (req, res, next) {
    const logger = req.logger.ns('whip.check')
    const checker = req.opts.checkers[checkerName]
    logger.debug('Validate', { checkerName, body: req.body })

    const [err, input] = validate(req.body, checker, { coerce: true })
    if (err) throw err
    req.state.input = input
    next()
  }
}
