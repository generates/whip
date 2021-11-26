import { test } from '@ianwalter/bff'
import helloApp from './fixtures/hello.js'

test('Response • Send text', async t => {
  const res = await helloApp.test('/').get()
  t.expect(res.statusCode).toBe(200)
  t.expect(res.body).toBe('Hello')
})

test.skip('Response • Send JSON', async t => {
  const res = await helloApp.test('/').get()
  t.expect(res.statusCode).toBe(200)
  t.expect(res.body).toBe('Hello')
})
