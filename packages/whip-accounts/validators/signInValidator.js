import {
  SchemaValidator,
  isString,
  isEmail,
  isStrongPassword,
  trim,
  lowercase
} from '@generates/whip-data'

const ifUsingUsername = {
  validate (input, state, ctx) {
    return { isValid: ctx.input.username }
  }
}
const ifUsingEmail = {
  validate (input, state, ctx) {
    return { isValid: ctx.input.email }
  }
}

export default new SchemaValidator({
  email: { isEmail, trim, lowercase, canBeEmpty: ifUsingUsername },
  username: { isString, trim, lowercase, canBeEmpty: ifUsingEmail },
  password: { isStrongPassword }
})
