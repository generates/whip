import { create } from '@generates/whip'
import email from '../../index.js'

const app = create()

app.add({
  plugin: email,
  opts: {
    transport: {
      ignoreTLS: true,
      host: 'localhost',
      port: 25
    }
  }
})

app.get('/', async function name (req, res) {
  const email = req.query.email?.split(' ')?.slice(0, 32)
  if (email) {
    const html = req.stencil.render({
      heading: 'Welcome, Jane! 🎉',
      message: 'We’ve heard you like emails!'
    })
    req.nodemailer.sendMail(
      { to: email, subject: 'Welcome', html },
      (err, info) => {
        if (err) req.logger.error(err)
        req.logger.debug(info)
      }
    )
    res.send('Email sent!')
  } else {
    res.statusCode = 400
    res.send('No email provided')
  }
})

export default app
