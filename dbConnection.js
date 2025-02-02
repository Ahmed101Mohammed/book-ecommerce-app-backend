import mongoose from "mongoose"
import proccessVars from './utils/confige.js'
import logger from "./utils/logger.js"
import setupAdmin from "./utils/setupAdmin.js"
const connectToDB = async () => {
  try {
    await mongoose.connect(proccessVars.MONGO_DB_URI)
    logger.info('Successfully connection to the db')
    await setupAdmin()
  } catch (error) {
    const name = error.name
    const message = error.message
    logger.error(`Error-> ${name}: ${message}`)
    switch (message) {
      case 'querySrv ECONNREFUSED _mongodb._tcp.cluster0.57p8w.mongodb.net':
        logger.info(
          'Suggested solution: May you need to sure that you connected with the internet'
        )
        break
      default:
        logger.info('There are no solutions suggested for this problem.')
    }
  }
}

export default connectToDB