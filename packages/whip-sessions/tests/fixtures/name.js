import { create } from '@generates/whip'
import sessions from '../../index.js'

const app = create()

app.add({ plugin: sessions, opts: { secret: 'BlueBandParade' } })

app.get('/', async function name (req, res) {
  let name = req.query.name?.split(' ')?.at(0)?.slice(0, 8)
  if (name) {
    req.session.name = name
  } else {
    name = req.session.name || 'Buddy'
  }
  res.send(`Hey ${name}`)
})

export default app
