const path = require('node:path')
const apstractPath = require(
  path.join(__dirname, '..', 'utils', 'apstractPath.js')
)
const logger = require(apstractPath('utils', 'logger.js'))

const errorHandler = (error, request, response, next) => {
  const name = error.name
  const message = error.message
  logger.error(`Error-> ${name}: ${message}`)
  next()
}

module.exports = errorHandler
