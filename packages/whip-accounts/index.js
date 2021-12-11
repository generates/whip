import { merge } from '@generates/merger'
import bcrypt from 'bcrypt'
import { addToResponse } from '@generates/whip'
import prisma from '@generates/whip-prisma'
import email from '@generates/whip-email'
import sessions from '@generates/whip-sessions'
import signUpValidator from './validators/signUpValidator.js'
import signInValidator from './validators/signInValidator.js'
import verifyEmailValidator from './validators/verifyEmailValidator.js'
import resetPasswordValidator from './validators/resetPasswordValidator.js'
import createToken from './middleware/token/createToken.js'
import insertToken from './middleware/token/insertToken.js'
import createEmailVerificationEmail from './middleware/email/createEmailVerificationEmail.js'
import sendEmail from './middleware/email/sendEmail.js'
import validateAccount from './middleware/account/validateAccount.js'
import hashPassword from './middleware/password/hashPassword.js'
import createAccount from './middleware/account/createAccount.js'
import validateVerifyEmail from './middleware/email/validateVerifyEmail.js'
import getToken from './middleware/token/getToken.js'
import verifyToken from './middleware/token/verifyToken.js'
import saveAccount from './middleware/account/saveAccount.js'
import getAccount from './middleware/account/getAccount.js'
import createSession from './middleware/session/createSession.js'
import reduceAccount from './middleware/account/reduceAccount.js'
import comparePasswords from './middleware/password/comparePasswords.js'
import validateCreateSession from './middleware/session/validateCreateSession.js'
import resetSession from './middleware/session/resetSession.js'
import validateEmail from './middleware/email/validateEmail.js'
import createResetPasswordEmail from './middleware/email/createResetPasswordEmail.js'
import validateResetPassword from './middleware/password/validateResetPassword.js'

const defaults = {
  name: 'Account',
  signUpValidator,
  signInValidator,
  verifyEmailValidator,
  resetPasswordValidator,
  hash: {
    bytes: 48,
    rounds: 12
  },
  email: {
    verifyEmail: {
      heading: 'Verify your email',
      message: 'To get started, please click the button below:',
      action: { label: 'Verify' }
    },
    resetPassword: {
      heading: 'Reset your password',
      message: 'To get started, please click the button below:',
      action: { label: 'Reset' }
    }
  },
  hiddenFields: ['password'],
  dummyPassword: 'ijFu54r6PyNdrN'
}

export default function accountsPlugin (app, opts = {}) {
  app.opts.accounts = merge({}, defaults, opts)

  //
  app.opts.accounts.hashedDummyPassword = bcrypt.hashSync(
    app.opts.accounts.dummyPassword,
    bcrypt.genSaltSync(app.opts.accounts.hash.rounds)
  )

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
  getToken,
  verifyToken,
  saveAccount,
  createSession,
  reduceAccount,
  addToResponse
]

accountsPlugin.signIn = [
  validateCreateSession,
  getAccount,
  comparePasswords,
  createSession,
  reduceAccount,
  addToResponse
]

accountsPlugin.signOut = [
  resetSession,
  addToResponse
]

accountsPlugin.forgotPassword = [
  validateEmail,
  createToken,
  getAccount,
  insertToken({ type: 'password' }),
  createResetPasswordEmail,
  sendEmail,
  addToResponse
]

accountsPlugin.resetPassword = [
  validateResetPassword,
  getToken,
  verifyToken,
  hashPassword,
  saveAccount,
  createSession,
  reduceAccount,
  addToResponse
]

accountsPlugin.saveAccount = [
  validateAccount,
  getAccount,
  comparePasswords,
  hashPassword,
  saveAccount,
  reduceAccount,
  addToResponse
]
