#!/usr/bin/env node

import path from 'path'

import(path.resolve(process.argv.slice(2).pop())).then(({ default: app }) => (
  app.start()
))
