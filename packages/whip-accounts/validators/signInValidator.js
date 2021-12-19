import {
  SchemaValidator,
  isString,
  isEmail,
  isStrongPassword,
  canBeEmpty,
  trim,
  lowercase
} from '@generates/whip-data'

export default new SchemaValidator({
  email: { isEmail, trim, lowercase, canBeEmpty },
  username: { isString, trim, lowercase, canBeEmpty },
  password: { isStrongPassword }
})
