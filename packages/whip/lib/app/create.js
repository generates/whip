import polka from 'polka'
import start from './start.js'
import add from './add.js'
import logger from '../plugins/logger.js'
import responseMiddleware from '../middleware/response.js'

export default function create (opts = {}) {
  const app = polka()

  // Add the given options to the app for convenience.
  app.opts = opts

  /* Methods */

  // Add a method to the app that can be used to add plugins and extend the app.
  app.add = add

  // Add a convenience method to log the server information when listening on a
  // port and serving requests.
  app.start = start

  /* Plugins */

  // Add a logger to the app and request object.
  app.add({ plugin: logger, opts: opts.logger })

  /* Middleware */

  // Add functions to the response object so that sending responses with common
  // formats are more convenient and the response can be logged.
  app.use(responseMiddleware)

  // Add default onNoMatch handler so that it uses res.send and the response is
  // logged.
  app.onNoMatch = function onNoMatch (req, res) {
    res.statusCode = 404
    res.send('Not Found')
  }

  app.onError = function onError (err, req, res) {
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
