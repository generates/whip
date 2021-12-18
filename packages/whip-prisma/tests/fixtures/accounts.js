import { create } from '@generates/whip'
import prisma from '../../index.js'

const app = create()

app.add({ plugin: prisma })

app.get('/', async function accounts (req, res) {
  const accounts = await req.prisma.account.findMany()
  res.send(accounts.map(account => {
    delete account.password
    return account
  }))
})

export default app
