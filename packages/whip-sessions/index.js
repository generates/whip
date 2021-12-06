import prisma from '@generates/whip-prisma'
import expressSession from 'express-session'
import { merge } from '@generates/merger'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import { nanoid } from 'nanoid'

const defaults = {
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  resave: true,
  saveUninitialized: true
}

export default function sessionsPlugin (app, opts) {
  app.opts.sessions = merge({}, defaults, opts)

  if (!app.opts.sessions.store) {
    if (!app.prisma) prisma(app, app.opts.sessions.prisma)
    app.opts.sessions.store = new PrismaSessionStore(
      app.prisma,
      {
        checkPeriod: 2 * 60 * 1000, // 2 minutes
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: nanoid
      }
    )
  }

  app.use(expressSession(app.opts.sessions))
}
