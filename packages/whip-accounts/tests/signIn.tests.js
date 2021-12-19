import { test } from '@ianwalter/bff'
import app from './fixtures/app.js'
import { accounts, password } from './fixtures/accounts.js'

const generalUser = accounts.find(a => a.firstName === 'General')
const disabledUser = accounts.find(a => a.firstName === 'Disabled')
const unverifiedUser = accounts.find(a => a.firstName === 'Unverified')

test('Login • No email', async t => {
  const res = await app.test('/sign-in').post({ password })
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toMatchSnapshot()
})

test('Login • No password', async t => {
  const res = await app.test('/sign-in').post({ email: generalUser.email })
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toMatchSnapshot()
})

test('Login • Invalid credentials', async t => {
  const payload = { ...generalUser, password: 'thisIsNotTheRightPw' }
  const res = await app.test('/sign-in').post(payload)
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toEqual({ message: 'Incorrect email or password' })
})

test('Login • Valid credentials', async t => {
  const res = await app.test('/sign-in').post({ ...generalUser, password })
  t.expect(res.statusCode).toBe(201)
  t.expect(res.body).toMatchSnapshot({ csrfToken: t.expect.any(String) })
})

test('Login • Disabled user', async t => {
  const res = await app.test('/sign-in').post({ ...disabledUser, password })
  t.expect(res.statusCode).toBe(400)
  t.expect(res.body).toEqual({ message: 'Incorrect email or password' })
})

test('Login • Already logged in', async t => {
  const credentials = { ...generalUser, password }
  const one = await app.test('/sign-in').post(credentials)
  const two = await app.test('/sign-in', one).post(credentials)
  t.expect(two.statusCode).toBe(201)
  t.expect(two.body).toMatchSnapshot({ csrfToken: t.expect.any(String) })
  t.expect(one.headers['set-cookie']).not.toEqual(two.headers['set-cookie'])
})

test('Login • Unverified user can login', async t => {
  const credentials = { ...unverifiedUser, password }
  const res = await app.test('/sign-in').post(credentials)
  t.expect(res.statusCode).toBe(201)
  t.expect(res.body).toMatchSnapshot({ csrfToken: t.expect.any(String) })
})

test('Login • Remember me', async t => {
  const body = { ...generalUser, password, rememberMe: true }
  let res = await app.test('/sign-in').post(body)
  t.expect(res.statusCode).toBe(201)

  // Sleep for 5 seconds so that the session would expire if rememberMe was
  // false.
  await t.asleep(5000)

  res = await app.test('/account', res).get()
  t.expect(res.statusCode).toBe(200)
})
