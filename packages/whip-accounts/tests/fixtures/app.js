import { create } from '@generates/whip'
import accounts from '../../index.js'

const app = create({ logger: { level: 'debug', pretty: true } })

app.add({
  plugin: accounts,
  opts: {
    email: {
      transport: {
        ignoreTLS: true,
        host: 'localhost',
        port: 25
      }
    },
    sessions: { secret: 'realshitnevertellalie' }
  }
})

app.post('/sign-up', ...accounts.signUp)

app.post('/verify-email', ...accounts.verifyEmail)

app.post('/sign-in', ...accounts.signIn)

app.post('/forgot-password', ...accounts.forgotPassword)

app.post('/resend-verify-email', ...accounts.resendVerifyEmail)

app.get('/', async function accounts (req, res) {
  const accounts = await req.prisma.account.findMany()
  res.send(accounts.map(account => {
    delete account.password
    return account
  }))
})

export default app
