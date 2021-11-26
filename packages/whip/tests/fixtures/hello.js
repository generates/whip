import { create } from '../../index.js'

const app = create()

app.get('/', function hello (req, res) {
  res.send('Hello')
})

export default app
