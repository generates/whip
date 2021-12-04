function end (res, body, headers = {}) {
  res.writeHead(res.statusCode || 200, headers)
  res.end(body)
}

export default function responseMiddleware (req, res, next) {
  res.send = function send (body) {
    body = body || req.state.body
    res.statusCode = req.state.statusCode || res.statusCode || 200
    res.log(body)
    end(res, body)
  }

  res.json = function json (body) {
    body = body || req.state.body
    res.statusCode = req.state.statusCode || res.statusCode || 200
    res.log(body)
    end(res, JSON.stringify(body), { 'Content-Type': 'application/json' })
  }

  next()
}
