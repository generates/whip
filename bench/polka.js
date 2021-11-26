#!/usr/bin/env node

import polka from 'polka'

polka()
  .use(function one (req, res, next) {
    req.one = true
    next()
  })
  .use(function two (req, res, next) {
    req.two = true
    next()
  })
  .get('/', (req, res) => res.end('Hello'))
  .get('/user/:id', (req, res) => res.end(`User: ${req.params.id}`))
  .listen(3003)
