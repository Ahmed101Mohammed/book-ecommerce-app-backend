import logger from './utils/logger.js'
// import connectToDB from './dbConnection.js'
import app from './app.js'

const PORT = 4300
app.listen(PORT, async () => {
  logger.info(`Server runing at port ${PORT}`)
  logger.info(
    `You can run your app now with this link: http://localhost:${PORT}`
  )
  // await connectToDB()
})
