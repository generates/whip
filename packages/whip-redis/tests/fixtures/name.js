import { create } from '@generates/whip'
import redis from '../../index.js'

const app = create()

app.add({ plugin: redis })

app.get('/', async function name (req, res) {
  let name = req.query.name?.split(' ')?.at(0)?.slice(0, 8)
  if (name) {
    req.redis.set('name', name)
  } else {
    name = (await req.redis.get('name')) || 'Buddy'
  }
  res.send(`Hey ${name}`)
})

export default app
