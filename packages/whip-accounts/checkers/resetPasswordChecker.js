import {
  type,
  optional,
  trimmed,
  lowercased,
  email,
  string,
  password
} from '@generates/whip-check'

export default type({
  email: trimmed(lowercased(email())),
  token: trimmed(string()),
  password: password(),
  passwordMatch: optional(password())
})
