import { create } from '@generates/whip'
import accounts from '../../index.js'

const app = create()

app.add({ plugin: accounts })

app.post('/sign-up', ...accounts.signUp)

app.get('/', async function accounts (req, res) {
  const accounts = await req.prisma.account.findMany()
  res.json(accounts.map(account => {
    delete account.password
    return account
  }))
})

export default app
