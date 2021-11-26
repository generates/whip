import { createLogger, chalk } from '@generates/logger'
import { merge } from '@generates/merger'
import createTimer from '@ianwalter/timer'

const defaults = {
  name: 'whip',
  level: 'info'
}

export default function loggerPlugin (app, opts) {
  //
  app.logger = createLogger(merge({}, defaults, opts))

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

      log += ` ${chalk.dim(`in ${timer.duration()}`)}`

      req.logger.log(log)
    }

    next()
  })
}
