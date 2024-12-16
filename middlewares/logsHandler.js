const path = require('node:path')
const apstractPath = require(
  path.join(__dirname, '..', 'utils', 'apstractPath.js')
)
const logger = require(apstractPath('utils', 'logger.js'))
const logsHandler = (request, response, next) => {
  const method = request.method
  const url = request.url
  const body = request.body

  logger.info(`${method}: ${url} |`, body)
  next()
}

module.exports = logsHandler
