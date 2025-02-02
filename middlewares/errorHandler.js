import logger from "../utils/logger.js"

const errorHandler = (error, request, response, next) => {
  const name = error.name
  const message = error.message
  logger.error(`Error-> ${name}: ${message}`)
  // console.log(`Error-> ${name}: ${message}`) // for just testing mode

  switch(name)
  {
    case 'DublicatedData': 
      response.status(409).json({state: false, name, message}).end()
      break
    case 'ValidationError':
      response.status(400).json({state: false, name, message}).end()
      break
    case 'MulterError':
      response.status(400).json({state: false, name, message}).end()
      break
    case 'CastError':
      response.status(400).json({state: false, name, message}).end()
      break
    case 'NOTFOUND':
      response.status(404).json({state: false, name, message}).end()
      break
    case 'WRONGCREDENTIALS':
      response.status(401).json({state: false, name, message}).end()
      break
    case 'UNAUTHORIZED':
      response.status(401).json({state: false, name, message}).end()
      break
    case 'UNAUTHENTICATED':
      response.status(403).json({state: false, name, message}).end()
      break
    default:
      response.status(500).json({state: false, name, message}).end()
      break
  }
  next()
}

export default errorHandler