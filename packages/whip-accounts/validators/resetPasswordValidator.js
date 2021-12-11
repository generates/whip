import {
  SchemaValidator,
  isString,
  isEmail,
  isStrongPassword,
  trim,
  lowercase,
  canBeEmpty
} from '@generates/whip-data'

const shouldMatchPassword = {
  validate (input, state, ctx) {
    return {
      isValid: input === ctx.input.password,
      message: 'The password confirmation must match the password value.'
    }
  }
}

export default new SchemaValidator({
  email: { isEmail, trim, lowercase },
  token: { isString, trim },
  password: { isStrongPassword },
  passwordConfirmation: { canBeEmpty, shouldMatchPassword }
})
