import { excluding } from '@generates/extractor'

export default function reduceAccount (req, res, next) {
  const wholeAccount = req.state.account || req.session?.account
  if (wholeAccount) {
    const account = excluding(wholeAccount, ...req.opts.accounts.hiddenFields)
    req.state.body = req.state.body ? { ...req.state.body, account } : account
  }
  next()
}
