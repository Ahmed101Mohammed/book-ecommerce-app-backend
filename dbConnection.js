const mongoose = require('mongoose')
const path = require('node:path')
const apstractPath = require(path.join(__dirname, 'utils', 'apstractPath.js'))
const proccessVars = require(apstractPath('utils', 'confige.js'))
const logger = require(apstractPath('utils', 'logger.js'))
const connectToDB = async () => {
  try {
    await mongoose.connect(proccessVars.DEV_MONGO_DB_URI)
    logger.info('Successfully connection to the db')
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

module.exports = connectToDB
