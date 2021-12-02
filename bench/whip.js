#!/usr/bin/env node

import { create } from '@generates/whip'

const app = create({ logger: { stdout: false } })

app.use(function one (req, res, next) {
  req.one = true
  next()
})

app.use(function two (req, res, next) {
  req.two = true
  next()
})

app.get('/', (req, res) => res.send('Hello'))

app.get('/user/:id', (req, res) => res.send(`User: ${req.params.id}`))

app.start(3001)
