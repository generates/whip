import prisma from '@generates/whip-prisma'

export default function blogPlugin (app, opts) {
  if (!app.prisma) prisma(app, opts.prisma)
}

blogPlugin.getSession
