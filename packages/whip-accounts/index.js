import { merge } from '@generates/merger'
import { addToResponse } from '@generates/whip'
import prisma from '@generates/whip-prisma'
import email from '@generates/whip-email'
import sessions from '@generates/whip-sessions'
import accountValidator from './validators/accountValidator.js'
import createToken from './middleware/token/createToken.js'
import insertToken from './middleware/token/insertToken.js'
import createEmailVerificationEmail from './middleware/email/createEmailVerificationEmail.js'
import sendEmail from './middleware/email/sendEmail.js'
import validateAccount from './middleware/account/validateAccount.js'
import hashPassword from './middleware/password/hashPassword.js'
import createAccount from './middleware/account/createAccount.js'
import validateVerifyEmail from './middleware/email/validateVerifyEmail.js'
import getEmailToken from './middleware/token/getEmailToken.js'

const defaults = {
  name: 'Account',
  accountValidator,
  hash: {
    bytes: 48,
    rounds: 12
  },
  email: {
    emailVerification: {
      heading: 'Email Verification',
      message: 'To get started, please click the button below:',
      action: { label: 'Verify your account' }
    }
  }
}

export default function accountsPlugin (app, opts = {}) {
  app.opts.accounts = merge({}, defaults, opts)
  if (!app.prisma) prisma(app, opts.prisma)
  if (!app.nodemailer) email(app, opts.email)
  if (!app.opts.sessions) sessions(app, opts.sessions)
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

accountsPlugin.verifyEmail = [
  validateVerifyEmail,
  getEmailToken,
  // verifyToken,
  // verifyEmail,
  // getAccount,
  // createUserSession,
  // reduceAccountForClient,
  addToResponse
]

accountsPlugin.signIn = []

accountsPlugin.signOut = []

accountsPlugin.forgotPassword = []

accountsPlugin.resetPassword = []

accountsPlugin.update = []
