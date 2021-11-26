#!/usr/bin/env node

import path from 'path'

const { default: app } = await import(path.resolve(process.argv.slice(2).pop()))
app.start()
