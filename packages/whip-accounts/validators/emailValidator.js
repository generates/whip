import {
  SchemaValidator,
  isEmail,
  trim,
  lowercase
} from '@generates/whip-data'

export default new SchemaValidator({
  email: { isEmail, trim, lowercase }
})
