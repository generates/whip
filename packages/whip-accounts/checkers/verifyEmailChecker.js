import {
  type,
  trimmed,
  lowercased,
  email,
  string,
} from '@generates/whip-check'

export default type({
  email: trimmed(lowercased(email())),
  token: trimmed(string())
})
