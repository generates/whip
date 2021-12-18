import prisma from '@generates/whip-prisma'
import expressSession from 'express-session'
import { merge } from '@generates/merger'
import pgSession from 'connect-pg-simple'

const defaults = {
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  resave: true,
  saveUninitialized: true
}
const PgSession = pgSession(expressSession)

export default function sessionsPlugin (app, opts) {
  app.opts.sessions = merge({}, defaults, opts)

  if (!app.opts.sessions.store) {
    if (!app.prisma) prisma(app, app.opts.sessions.prisma)
    app.opts.sessions.store = new PgSession({ tableName: 'Session' })
  }

  app.use(expressSession(app.opts.sessions))
}
