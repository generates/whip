import { create } from '../../index.js'

const app = create()

app.get('/', function error (req, res) {
  throw new Error('Oh noes!')
})

export default app
