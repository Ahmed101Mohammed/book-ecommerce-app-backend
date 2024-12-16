require('express-async-errors')
const express = require('express')
const path = require('node:path')
const apstractPath = require(path.join(__dirname, 'utils', 'apstractPath.js'))
const logsHandler = require(apstractPath('middlewares', 'logsHandler.js'))
const errorHandler = require(apstractPath('middlewares', 'errorHandler.js'))
const app = express()
// Middlewares
app.use(express.json())
app.use(logsHandler)

// Midlewares for wrongs
app.use(errorHandler)
module.exports = app
