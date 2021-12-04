import prisma from '@prisma/client'

export default function prismaPlugin (app, opts) {
  app.prisma = new prisma.PrismaClient(opts)
  app.use(function prismaMiddleware (req, res, next) {
    req.prisma = app.prisma
    next()
  })
}
