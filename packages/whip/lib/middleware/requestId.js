import { nanoid } from 'nanoid'

export default function requestIdMiddleware (req, res, next) {
  // Extract the request ID from the X-Request-ID header or generate one using
  // nanoid.
  let requestId = req.headers['X-Request-ID']
  if (!requestId) requestId = nanoid()

  // Add the request ID to the request object.
  req.id = requestId

  // TODO:
  // Also set the request ID to the X-Request-ID response header so that the
  // client can easily reference it even if it did not pass one with the
  // request.
  // res.set('X-Request-ID', requestId)

  next()
}
