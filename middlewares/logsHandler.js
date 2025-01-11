import logger from "../utils/logger.js"

const logsHandler = (request, response, next) => {
  const method = request.method
  const url = request.url
  const body = request.body

  logger.info(`${method}: ${url} |`, body)
  next()
}

export default logsHandler