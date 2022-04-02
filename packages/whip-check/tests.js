import { test } from '@ianwalter/bff'
import {
  is,
  object,
  string,
  number,
  email
} from './index.js'

test('object', t => {
  const User = object({
    id: number(),
    name: string()
  })
  t.expect(is({ id: 1, name: 'ian' }, User)).toBe(true)
})

test('email', t => {
  t.expect(is('aluna@example', email)).toBe(false)
  t.expect(is('aluna@example.com', email)).toBe(true)
})
