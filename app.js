import 'express-async-errors'
import express from 'express'
import logsHandler from './middlewares/logsHandler.js'
import errorHandler from './middlewares/errorHandler.js'
import authRouter from './routes/auth.js'
import connectToDB from './dbConnection.js'
import cookieParser from 'cookie-parser'

connectToDB()
const app = express()
// Middlewares
app.use(cookieParser())
app.use(express.json())
app.use(logsHandler)
app.use(express.static('dist'))

// Routers
app.use('/auth', authRouter)

// Midlewares for wrongs
app.use(errorHandler)

export default app