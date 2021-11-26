function end (res, body) {
  if (!res.statusCode) res.statusCode = 200
  res.end(body)
}

export default function responseMiddleware (req, res, next) {
  res.send = function send (body) {
    res.log(body)
    end(res, body)
  }

  res.json = function json (body) {
    res.log(body)
    end(res, JSON.stringify(body))
  }

  next()
}
