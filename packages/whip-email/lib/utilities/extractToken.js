import { merge } from '@generates/merger'
import cheerio from 'cheerio'
import getTestEmail from './getTestEmail.js'

export default async function extractToken (byEmail, selector = 'a[href]') {
  const email = merge({}, await getTestEmail(byEmail))
  const $ = cheerio.load(email.html)
  const url = new URL($(selector).attr('href'))
  const token = url.searchParams.get('token')

  // Replace the token string with an arbitrary string so that the email body
  // can more easily be used with a snapshot matcher.
  // email.html = email.html.replaceAll(token, '<~ TOKEN WAS HERE ~>')

  return { email, token }
}
