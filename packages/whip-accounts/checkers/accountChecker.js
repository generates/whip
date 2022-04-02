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
  email: optional(trimmed(lowercased(email()))),
  username: optional(trimmed(lowercased(string()))),
  firstName: optional(trimmed(string())),
  lastName: optional(trimmed(string())),
  password: optional(password())
})
