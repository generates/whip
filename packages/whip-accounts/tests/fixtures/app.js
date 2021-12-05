import { create } from '@generates/whip'
import accounts from '../../index.js'

const app = create({ logger: { level: 'error', pretty: true } })

app.add({
  plugin: accounts,
  opts: {
    email: {
      transport: {
        ignoreTLS: true,
        host: 'localhost',
        port: 25
      }
    }
  }
})

app.post('/sign-up', ...accounts.signUp)

app.get('/', async function accounts (req, res) {
  const accounts = await req.prisma.account.findMany()
  res.json(accounts.map(account => {
    delete account.password
    return account
  }))
})

export default app
