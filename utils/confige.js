require('dotenv').config()

const proccessVars = {
  DEV_MONGO_DB_URI: process.env.DEV_MONGO_DB_URI,
}

module.exports = proccessVars
