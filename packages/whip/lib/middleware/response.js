function end (res, body, headers = {}) {
  res.writeHead(res.statusCode || 200, headers)
  res.end(body)
}

export default function responseMiddleware (req, res, next) {
  res.send = function send (body) {
    res.log(body)
    end(res, body)
  }

  res.json = function json (body) {
    res.log(body)
    end(res, JSON.stringify(body), { 'Content-Type': 'application/json' })
  }

  next()
}
