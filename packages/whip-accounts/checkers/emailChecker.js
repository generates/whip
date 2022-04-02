import {
  type,
  trimmed,
  lowercased,
  email
} from '@generates/whip-check'

export default type({
  email: trimmed(lowercased(email()))
})
