import { test, after, describe, beforeEach, before } from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../../app.js'
import User from '../../../models/User.js'
import Book from '../../../models/Book.js'
import proccessVars from '../../../utils/confige.js'
import assert from 'assert'
import connectToDB from '../../../dbConnection.js'
import booksRouteHelperFunctions from './helper.js'

const api = supertest(app)

before( async () =>
{
  await connectToDB()
})

beforeEach(async ()=> 
{
  await Book.deleteMany({})
  await booksRouteHelperFunctions.deleteAllUsersExceptAdmin()
  // console.log(`Hi I'm before each`)
})

describe('Get /api/books/:id tests', () => 
{
  const admin = {
    name: proccessVars.ADMIN_USER.NAME,
    password: proccessVars.ADMIN_USER.PASSWORD,
    email: proccessVars.ADMIN_USER.EMAIL
  }

  const book = {
    title: 'Clean Code',
    price: 200,
  }

  test('Get specific book successfuly', async()=>
  {
    const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const token = response.body.accessToken
    const createBookResponse = await api
      .post('/api/books')
      .set({authorization: `Bearer ${token}`})
      .send(book)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const bookId = createBookResponse.body.data.id
    const getspecificBookResponse = await api
      .get(`/api/books/${bookId}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const specificBook = getspecificBookResponse.body.data
  
    assert.strictEqual(specificBook.id, bookId)
    assert.strictEqual(specificBook.title, book.title)
    assert.strictEqual(specificBook.price, book.price)
  })

  test('Get book with badly formed id', async() => {
    const badId = '12345'
    await api
      .get(`/api/books/${badId}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('Get book with well-formed id but not existing', async() => {
    const nonExistingId = new mongoose.Types.ObjectId()
    await api
      .get(`/api/books/${nonExistingId}`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
  })
})

after(async() =>
{
  await User.deleteMany({})
  await Book.deleteMany({})
  await mongoose.connection.close()
})