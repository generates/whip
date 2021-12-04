import { merge } from '@generates/merger'
import { addToResponse } from '@generates/whip'
import prisma from '@generates/whip-prisma'
import accountValidator from './validators/accountValidator.js'
import validateAccount from './middleware/account/validateAccount.js'
import hashPassword from './middleware/password/hashPassword.js'
import createAccount from './middleware/account/createAccount.js'

const defaults = {
  accountValidator,
  hash: {
    bytes: 48,
    rounds: 12
  }
}

export default function accountsPlugin (app, opts = {}) {
  app.opts.accounts = merge({}, defaults, opts)
  if (!app.prisma) prisma(app, opts.prisma)
}

accountsPlugin.signUp = [
  validateAccount,
  hashPassword,
  createAccount,
  addToResponse
]

accountsPlugin.signIn = []

accountsPlugin.signOut = []

accountsPlugin.forgotPassword = []

accountsPlugin.resetPassword = []

accountsPlugin.update = []
