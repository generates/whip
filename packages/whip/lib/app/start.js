export default function start (...args) {
  const app = this
  app.listen(...args, function listenCallback () {
    const address = app.server.address()
    app.logger.info(`Listening on port http://localhost:${address.port}`)
  })
}
