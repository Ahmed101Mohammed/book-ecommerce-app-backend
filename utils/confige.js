import dotenv from 'dotenv'
import logger from './logger.js'
dotenv.config()

// set the DB URI accourding to the Node environment variable.
const NODE_ENV = process.env.Node_ENV
let MONGO_DB_URI = process.env.DEV_MONGO_DB_URI
if(NODE_ENV === 'test')
{
  MONGO_DB_URI = process.env.TEST_MONGO_DB_URI
}
else if (NODE_ENV == 'production')
{
  logger.error('The production DB did not setup yet.')
}


// export
const proccessVars = {
  MONGO_DB_URI: MONGO_DB_URI,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  ENCRYPTED_ALGORITHM: process.env.ENCRYPTED_ALGORITHM,
  NODE_ENV,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  REFREASH_TOKEN: process.env.REFREASH_TOKEN,
  ADMIN_USER: {
    NAME: process.env.NAME,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD
  }
}

export default proccessVars