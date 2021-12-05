import { merge } from '@generates/merger'
import { addToResponse } from '@generates/whip'
import prisma from '@generates/whip-prisma'
import accountValidator from './validators/accountValidator.js'
import createToken from './middleware/token/createToken.js'
import insertToken from './middleware/token/insertToken.js'
import createEmailVerificationEmail from './middleware/email/createEmailVerificationEmail.js'
import sendEmail from './middleware/email/sendEmail.js'
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

accountsPlugin.startEmailVerification = [
  createToken,
  insertToken({ type: 'email' }),
  createEmailVerificationEmail,
  sendEmail
]

accountsPlugin.signUp = [
  validateAccount,
  hashPassword,
  createAccount,
  ...accountsPlugin.startEmailVerification,
  addToResponse
]

accountsPlugin.signIn = []

accountsPlugin.signOut = []

accountsPlugin.forgotPassword = []

accountsPlugin.resetPassword = []

accountsPlugin.update = []
