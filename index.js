const path = require('node:path')
const apstractPath = require(path.join(__dirname, 'utils', 'apstractPath.js'))
const logger = require(apstractPath('utils', 'logger.js'))
const connectToDB = require(apstractPath('dbConnection'))
const app = require(apstractPath('app.js'))

const PORT = 3300
app.listen(PORT, async () => {
  logger.info(`Server runing at port ${PORT}`)
  logger.info(
    `You can run your app now with this link: http://localhost:${PORT}`
  )
  await connectToDB()
})
