import { test } from '@ianwalter/bff'
import { getTestEmail, extractToken } from '@generates/whip-email'
import app from './fixtures/app.js'
import { accounts } from './fixtures/accounts.js'

const generalUser = accounts.find(a => a.firstName === 'General')
const disabledUser = accounts.find(a => a.firstName === 'Disabled')

test('Forgot Password • Invalid emails', async t => {
  let res = await app.test('/forgot-password').post({ email: null })
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toMatchSnapshot()

  res = await app.test('/forgot-password').post({ email: '' })
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toMatchSnapshot()

  const email = 'babu_frik@example'
  res = await app.test('/forgot-password').post({ email })
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toMatchSnapshot()
})

test('Forgot Password • Unregistered email', async t => {
  const email = 'babu_frik@example.com'
  const res = await app.test('/forgot-password').post({ email })
  t.expect(res.statusCode).toBe(200)
  t.expect(res.body).toEqual({
    message: 'Forgot Password request submitted successfully'
  })
})

test('Forgot Password • Registered email', async t => {
  const res = await app.test('/forgot-password').post(generalUser)
  t.expect(res.statusCode).toBe(200)
  t.expect(res.body).toEqual({
    message: 'Forgot Password request submitted successfully'
  })

  await t.asleep(1000)

  // Extract and verify the Forgot Password email and token.
  const byEmail = email => email.headers.to === generalUser.email
  const { email } = await extractToken(byEmail)
  t.expect(email).toMatchSnapshot({
    id: t.expect.any(String),
    messageId: t.expect.any(String),
    source: t.expect.any(String),
    date: t.expect.any(String),
    time: t.expect.any(String),
    envelope: {
      remoteAddress: t.expect.any(String)
    },
    headers: t.expect.any(Object)
  })

  // Verify the Forgot Password token was inserted into the database.
  const where = { email: generalUser.email, type: 'password' }
  const record = await app.prisma.token.findFirst({ where })

  t.expect(record).toBeDefined()
})

test('Forgot Password • Disabled user', async t => {
  const res = await app.test('/forgot-password').post(disabledUser)
  t.expect(res.statusCode).toBe(200)
  t.expect(res.body).toEqual({
    message: 'Forgot Password request submitted successfully'
  })

  // Verify no email was sent to the user.
  await t.asleep(1000)
  const email = await getTestEmail(e => e.headers.to === disabledUser.email)
  t.expect(email).toBe(undefined)
})
