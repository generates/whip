import { S3Client } from '@aws-sdk/client-s3'

export default function storagePlugin (app, opts) {
  app.storage = new S3Client(opts)
  app.use(function storageMiddleware (req, res, next) {
    req.storage = app.storage
    next()
  })
}
