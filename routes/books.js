import express from 'express'
import getBooks from '../controllers/books/getBooks.js'
import createBook from '../controllers/books/createBook.js'
import upload from '../utils/multer.js'
import verifyJWT from '../middlewares/verifyJWT.js'
import authenticated from '../utils/authenticated.js'
import rolesConstants from '../utils/rolesConstants.js'
import getBookWithId from '../controllers/books/getBookWithId.js'
import updateBookWithId from '../controllers/books/updateBookWithId.js'
import deleteBookWithId from '../controllers/books/deleteBookWithId.js'
const booksRouter = express.Router()

booksRouter
  .route('/')
    .get(getBooks)
    .post(verifyJWT, authenticated(rolesConstants.ADMIN), upload.single('cover'), createBook)
  
booksRouter
  .route('/:id')
    .get(getBookWithId)
    .put(verifyJWT, authenticated(rolesConstants.ADMIN), upload.single('cover'), updateBookWithId)
    .delete(verifyJWT, authenticated(rolesConstants.ADMIN), deleteBookWithId)

export default booksRouter