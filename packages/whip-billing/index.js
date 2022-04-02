import prisma from '@generates/whip-prisma'
import stripe from '@generates/whip-stripe'

export default function billingPlugin (app, opts) {
  if (!app.prisma) prisma(app, opts.prisma)
  if (!app.stripe) stripe(app, opts.stripe)
}
