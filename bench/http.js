#!/usr/bin/env node

import http from 'http'

const server = http.createServer(function (req, res) {
  req.one = true
  req.two = true

  if (req.url === '/') {
    return res.end('Hello')
  }

  if (req.url.startsWith('/user/')) {
    res.end(`User: ${req.url.slice(6)}`)
  }
})

server.listen(3002)
