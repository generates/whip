import {
  SchemaValidator,
  isString,
  isEmail,
  isStrongPassword,
  shouldMatchPassword,
  trim,
  lowercase,
  canBeEmpty
} from '@generates/whip-data'

export default new SchemaValidator({
  email: { isEmail, trim, lowercase },
  token: { isString, trim },
  password: { isStrongPassword },
  passwordConfirmation: { canBeEmpty, shouldMatchPassword }
})
