import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import logsHandler from './middlewares/logsHandler.js'
import errorHandler from './middlewares/errorHandler.js'
import authRouter from './routes/auth.js'
import booksRouter from './routes/books.js'
import cookieParser from 'cookie-parser'

const app = express()
// Middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(logsHandler)
app.use(express.static('dist'))
app.use('/uploads', express.static('uploads'))
// Routers
app.use('/auth', authRouter)
app.use('/api/books', booksRouter)
// Midlewares for wrongs
app.use(errorHandler)

export default app