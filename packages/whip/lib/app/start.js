import http from 'http'
import getHostUrl from '../utilities/getHostUrl.js'

export default function start (port, hostname, callback) {
  const app = this

  // Create the server instance by specifying the app's callback as the handler.
  const server = http.createServer(callback || app.handler)

  // Prefer the port and hostname passed as arguments to those configured in
  // the app even if the port is 0 (which means use a random unused port) so
  // that they can be overridden when serving (e.g. in a test).
  const portToUse = port !== undefined ? port : (app.opts.port || 0)
  const hostnameToUse = hostname || app.opts.hostname
  
  return new Promise((resolve, reject) => {
    server.listen(portToUse, hostnameToUse, function listenCallback (err) {
      if (err) reject(err)

      // Set the server URL (the local URL which can be different from the
      // base URL) so that whatever is starting the server (e.g. tests) can
      // easily know what URL to use.
      server.url = getHostUrl(hostnameToUse, portToUse || server.address().port)

      app.logger.ns('whip.server').info('Server started:', server.url)

      // Add a destroy method to the server instance if not in a production
      // environment (e.g. development or test).
      // https://github.com/nodejs/node/issues/2642
      // Logic influenced by https://github.com/isaacs/server-destroy
      if (!app.opts.isProd) {
        const sockets = []

        // Keep track of all active connections.
        server.on('connection', function storeSocket (socket) {
          const index = sockets.push(socket) - 1
          socket.on('close', () => sockets.splice(index, 1))
        })

        // Add a destroy method to the server instance that closes the server
        // and destroys all active connections.
        server.destroy = function destroy () {
          return new Promise(resolve => server.close(() => {
            for (const socket of sockets) socket.destroy()
            setTimeout(resolve)
          }))
        }
      }

      resolve(server)
    })
  })
}
