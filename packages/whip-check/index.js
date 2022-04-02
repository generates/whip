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

  define,
  coerce,
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

  define,
  coerce,
  refine,

  StructError
}

// FIXME: options?
export const defaultEmailOptions = { minDomainAtoms: 2 }
export const email = define('email', function email (input) {
  return isEmail.validate(input, defaultEmailOptions)
})

// FIXME: inputs?
export const password = define('password', function password (input) {
  return zxcvbn(input)
})

// FIXME: country?
export const phone = define('phone', function phone (input) {
  return parsePhoneNumber(input)
})

export function check (checker) {
  if (!checker) throw new Error('Missing checker for check middleware')

  return async function checkMiddleware (req, res, next) {
    const logger = req.logger.ns('whip.check')
    logger.debug('Input', req.body)

    const [err, input] = checker.validate(req.body)
    if (err) throw err
    req.state.input = input
    next()
  }
}
