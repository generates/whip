import { test } from '@ianwalter/bff'
import { getTestEmail, extractToken } from '@generates/whip-email'
import app from './fixtures/app.js'
import { accounts } from './fixtures/accounts.js'
import { tokens } from './fixtures/tokens.js'

const willVerifyUser = accounts.find(a => a.firstName === 'Will Verify')
const previousEmailUser = accounts.find(a => a.firstName === 'Previous Email')
const expiredEmailUser = accounts.find(a => a.firstName === 'Expired Email')
const wrongEmailUser = accounts.find(a => a.firstName === 'Wrong Email')
const disabledUser = accounts.find(a => a.firstName === 'Disabled')

test.only('Verify Email • Success', async t => {
  // Generate a email verification token for the unverified user.
  await app.test('/resend-verify-email').post(willVerifyUser)

  // Verify the email verification email was received and extract the token.
  await t.asleep(1000)
  const byEmail = e => e.headers.to === willVerifyUser.email
  const { email, token } = await extractToken(byEmail)
  const url = '/verify-email?email=will_verify_test@example.com&token='
  t.expect(email.html).toContain(url)
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

  // Verify the email address.
  const payload = { ...willVerifyUser, token }
  let res = await app.test('/verify-email').post(payload)
  t.expect(res.statusCode).toBe(201)
  t.expect(res.body).toMatchSnapshot({ csrfToken: t.expect.any(String) })

  // Verify that emailVerified is set to true in the database.
  const where = { id: willVerifyUser.id }
  const record = await app.prisma.account.findUnique({ where })
  t.expect(record.emailVerified).toBe(true)

  // Verify that the session was created.
  res = await app.test('/account', res).get()
  t.expect(res.statusCode).toBe(200)
})

test('Verify Email • Invalid email', async t => {
  const payload = { ...tokens[3], email: 'test@example' }
  const res = await app.test('/verify-email').post(payload)
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toMatchSnapshot()
})

test('Verify Email • Previous token', async t => {
  // Generate a new token for the admin user.
  const payload = previousEmailUser
  let res = await app.test('/resend-verify-email').post(payload)

  // Verify that the previous token can no longer be used for verification.
  await t.asleep(1000)
  res = await app.test('/verify-email').post({ ...tokens[0], ...payload })
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toMatchSnapshot()

  // Verify that emailVerified is still set to false in the database.
  const where = { id: previousEmailUser.id }
  const record = await app.prisma.account.findUnique({ where })
  t.expect(record.emailVerified).toBe(false)
})

test('Verify Email • Expired token', async t => {
  const payload = { ...tokens[1], ...expiredEmailUser }
  const res = await app.test('/verify-email').post(payload)
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toMatchSnapshot()

  // Verify that emailVerified is still set to false in the database.
  const where = { id: expiredEmailUser.id }
  const record = await app.prisma.account.findUnique({ where })
  t.expect(record.emailVerified).toBe(false)
})

test('Verify Email • Wrong token', async t => {
  const payload = { ...tokens[3], email: wrongEmailUser.email }
  const res = await app.test('/verify-email').post(payload)
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toMatchSnapshot()

  // Verify that emailVerified is still set to false in the database.
  const where = { id: wrongEmailUser.id }
  const record = await app.prisma.account.findUnique({ where })
  t.expect(record.emailVerified).toBe(false)
})

test('Resend Verify Email • Invalid email', async t => {
  const payload = { email: 'test@example' }
  const res = await app.test('/resend-verify-email').post(payload)
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toMatchSnapshot()
})

test('Resend Verify Email • Unregistered email', async t => {
  const payload = { email: 'ezra@example.com' }
  const res = await app.test('/resend-verify-email').post(payload)
  t.expect(res.statusCode).toBe(200)
  t.expect(res.body).toMatchSnapshot()

  // Verify no email was sent to the email address.
  await t.asleep(1000)
  const email = await getTestEmail(e => e.headers.to === payload.email)
  t.expect(email).toBe(undefined)
})

test('Resend Verify Email • Disabled user', async t => {
  const payload = disabledUser
  const res = await app.test('/resend-verify-email').post(payload)
  t.expect(res.statusCode).toBe(200)
  t.expect(res.body).toMatchSnapshot()

  // Verify no email was sent to the user.
  await t.asleep(1000)
  const email = await getTestEmail(e => e.headers.to === disabledUser.email)
  t.expect(email).toBe(undefined)
})
