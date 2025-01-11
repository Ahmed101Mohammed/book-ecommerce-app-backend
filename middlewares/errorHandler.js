import logger from "../utils/logger.js"

const errorHandler = (error, request, response, next) => {
  const name = error.name
  const message = error.message
  logger.error(`Error-> ${name}: ${message}`)
  // console.log(`Error-> ${name}: ${message}`) // for just testing mode

  switch(name)
  {
    case 'DublicatedData': 
      response.status(409).json({name, message}).end()
      break
    case 'ValidationError':
      response.status(400).json({name, message}).end()
      break
    case 'NOTFOUND':
      response.status(404).json({name, message}).end()
      break
    case 'WRONGCREDENTIALS':
      response.status(401).json({name, message}).end()
      break
    case 'UNAUTHORIZED':
      response.status(401).json({name, message}).end()
      break
    default:
      response.status(500).json({name, message}).end()
      break
  }
  next()
}

export default errorHandler