import polka from 'polka'
import { merge } from '@generates/merger'
import add from './add.js'
import start from './start.js'
import test from './test.js'
import logger from '../plugins/logger.js'
import responseMiddleware from '../middleware/response.js'
import requestIdMiddleware from '../middleware/requestId.js'

const defaults = {
  isDev: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  isProd: process.env.NODE_ENV === 'production',
  get hostname () {
    return process.env.APP_HOSTNAME || this.isDev ? 'localhost' : '0.0.0.0'
  },
  port: process.env.PORT
}

export default function create (opts = {}) {
  const app = polka()

  // Add the given options to the app for convenience.
  app.opts = merge({}, defaults, opts)

  /* Methods */

  // Add a method to the app that can be used to add plugins and extend the app.
  app.add = add

  // Add a convenience method to log the server information when listening on a
  // port and serving requests.
  app.start = start

  //
  app.test = test

  /* Plugins */

  // Add a logger to the app and request object.
  app.add({ plugin: logger, opts: app.opts.logger })

  /* Middleware */

  // Add functions to the response object so that sending responses with common
  // formats are more convenient and the response can be logged.
  app.use(responseMiddleware)

  //
  app.use(requestIdMiddleware)

  // Add default onNoMatch handler so that it uses res.send and the response is
  // logged.
  app.onNoMatch = function onNoMatch (req, res) {
    res.statusCode = 404
    res.send('Not Found')
  }

  app.onError = function onError (err, req, res) {
    req.logger.error(err)
    res.statusCode = err.status || 500
    const body = err.body || 'Internal Server Error'
    if (typeof body === 'string') {
      res.send(body)
    } else {
      res.json(body)
    }
  }

  return app
}
