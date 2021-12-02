import { roll, kleur } from '@generates/roll'
import { merge } from '@generates/merger'
import createTimer from '@ianwalter/timer'

const defaults = {
  namespace: 'whip'
}

export default function loggerPlugin (app, opts) {
  //
  app.logger = roll.create(merge({}, defaults, opts))

  //
  app.use(function loggerMiddleware (req, res, next) {
    //
    const timer = createTimer()

    //
    req.logger = app.logger

    //
    req.logger.log(`${req.method} ${req.path} Request`)

    //
    res.log = function logResponse (body) {
      let log = `${req.method} ${req.path} ${res.statusCode} Response`

      if (app.opts.isDev) {
        log += ` ${kleur.dim(`in ${timer.duration()}`)}`
      }

      req.logger.log(log)
    }

    next()
  })
}
