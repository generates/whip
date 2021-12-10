export default function responseMiddleware (req, res, next) {
  res.status = function status (statusCode) {
    req.state.statusCode = statusCode
    return res
  }

  res.set = function set (header, value) {
    req.state.headers[header] = value
    return res
  }

  res.send = function send (body) {
    const statusCode = req.state.statusCode || 200
    body = body || req.state.body
    if (typeof body === 'string') {
      res.writeHead(statusCode, req.state.headers)
      res.end(body)
    } else {
      res
        .set('Content-Type', 'application/json')
        .writeHead(statusCode, req.state.headers)
      res.end(JSON.stringify(body))
    }
  }

  next()
}
