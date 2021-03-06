import { test } from '@ianwalter/bff'
import { extractToken, getTestEmail } from '@generates/whip-email'
import app from './fixtures/app.js'
import { accounts } from './fixtures/accounts.js'

const firstName = 'Bilbo'
const lastName = 'Baggins'
const email = 'bilbo@example.com'
const password = '13eip3mlsdf0123mklqslk'
const verifiedUser = accounts.find(a => a.firstName === 'Existing Verified')
const unverifiedUser = accounts.find(a => a.firstName === 'Existing Unverified')

test('Registration • Email required', async t => {
  const payload = { firstName, lastName, password }
  const res = await app.test('/sign-up').post(payload)
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toEqual({
    message: 'Validation Error',
    feedback: { email: ['A valid email is required.'] }
  })
})

test('Registration • Password required', async t => {
  const payload = { firstName, lastName, email }
  const res = await app.test('/sign-up').post(payload)
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toEqual({
    message: 'Validation Error',
    feedback: { password: ['A valid password is required.'] }
  })
})

test('Registration • Weak password', async t => {
  const payload = { firstName, lastName, email, password: 'abc123' }
  const res = await app.test('/sign-up').post(payload)
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toEqual({
    message: 'Validation Error',
    feedback: {
      password: [
        'This is a top-100 common password',
        'Add another word or two. Uncommon words are better.'
      ]
    }
  })
})

test('Registration • Invalid email', async t => {
  const payload = { firstName, lastName, email: 'bilbo@example,com', password }
  const res = await app.test('/sign-up').post(payload)
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toEqual({
    message: 'Validation Error',
    feedback: { email: ['A valid email is required.'] }
  })
})

test('Registration • Success', async t => {
  // Register the new account.
  const payload = { firstName, lastName, email, password }
  let res = await app.test('/sign-up').post(payload)
  t.expect(res.statusCode).toBe(201)
  t.expect(res.body).toEqual({ message: 'Sign up successful!' })

  // Extract the Email Verification token.
  await t.asleep(1000)
  const { token } = await extractToken(e => e.headers.to === email)

  // Verify the email address.
  res = await app.test('/verify-email').post({ ...payload, token })
  t.expect(res.statusCode).toBe(201)
  t.expect(res.body.account.firstName).toBe(payload.firstName)
  t.expect(res.body.account.lastName).toBe(payload.lastName)

  // Verify that the email was verified.
  const where = { id: res.body.account.id }
  const record = await app.prisma.account.findUnique({ where })
  t.expect(record.emailVerified).toBe(true)
})

test('Registration • Existing verified email', async t => {
  // Register using the verified user's email.
  const payload = { ...verifiedUser, firstName, lastName, password }
  const res = await app.test('/sign-up').post(payload)
  t.expect(res.statusCode).toBe(201)
  t.expect(res.body).toEqual({ message: 'Sign up successful!' })

  // Verify no email was sent to the user.
  await t.asleep(1000)
  const email = await getTestEmail(e => e.headers.to === verifiedUser.email)
  t.expect(email).toBe(undefined)
})

test('Registration • Existing unverified email', async t => {
  // Register using the unverified user's email.
  const payload = { ...unverifiedUser, firstName, lastName, password }
  let res = await app.test('/sign-up').post(payload)
  t.expect(res.statusCode).toBe(201)
  t.expect(res.body).toEqual({ message: 'Sign up successful!' })

  // Extract the Email Verification token.
  await t.asleep(1000)
  const byEmail = email => email.headers.to === unverifiedUser.email
  const { token } = await extractToken(byEmail)

  // Verify the email address.
  res = await app.test('/verify-email').post({ ...payload, token })
  t.expect(res.statusCode).toBe(201)
  t.expect(res.body.account.firstName).toBe(payload.firstName)
  t.expect(res.body.account.lastName).toBe(payload.lastName)

  // Verify that the correct account data is stored in the database.
  const where = { email: unverifiedUser.email }
  const record = await app.prisma.account.findUnique({ where })
  t.expect(record.emailVerified).toBe(true)
  t.expect(record.firstName).toBe(payload.firstName)
  t.expect(record.lastName).toBe(payload.lastName)
})
