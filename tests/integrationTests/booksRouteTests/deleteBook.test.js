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

describe('DELETE /api/books/:id tests', () => 
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

  test('Delete specific book successfully', async () => {
    const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.accessToken
    const createBookResponse = await api
      .post('/api/books')
      .set({ authorization: `Bearer ${token}` })
      .send(book)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const bookId = createBookResponse.body.data.id
    await api
      .delete(`/api/books/${bookId}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(200)

    await api
      .get(`/api/books/${bookId}`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
  })

  test('Delete book with badly formed id', async () => {
    const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.accessToken
    const badId = '12345'
    await api
      .delete(`/api/books/${badId}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('Delete book with well-formed id but not existing', async () => {
    const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.accessToken
    const nonExistingId = new mongoose.Types.ObjectId()
    await api
      .delete(`/api/books/${nonExistingId}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /application\/json/)
  })

  test('Delete book without authorization', async () => {
    const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.accessToken
    const createBookResponse = await api
      .post('/api/books')
      .set({ authorization: `Bearer ${token}` })
      .send(book)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const bookId = createBookResponse.body.data.id
    await api
      .delete(`/api/books/${bookId}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('Delete book with wrong token', async () => {
    const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.accessToken
    const createBookResponse = await api
      .post('/api/books')
      .set({ authorization: `Bearer ${token}` })
      .send(book)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const bookId = createBookResponse.body.data.id
    await api
      .delete(`/api/books/${bookId}`)
      .set({ authorization: 'Bearer wrongtoken' })
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('Delete book unauthenticated', async () => {
    const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.accessToken
    const createBookResponse = await api
      .post('/api/books')
      .set({ authorization: `Bearer ${token}` })
      .send(book)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const bookId = createBookResponse.body.data.id

    const nonAdmin = {
      name: 'nonAdminUser',
      password: 'nonAd@2minPassword',
      email: 'nonadmin@example.com'
    }

    await api
      .post('/auth/register')
      .send(nonAdmin)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const nonAdminLoginResponse = await api
      .post('/auth/login')
      .send(nonAdmin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const nonAdminToken = nonAdminLoginResponse.body.accessToken

    await api
      .delete(`/api/books/${bookId}`)
      .set({ authorization: `Bearer ${nonAdminToken}` })
      .expect(403)
      .expect('Content-Type', /application\/json/)
  })
})

after(async() =>
{
  await User.deleteMany({})
  await Book.deleteMany({})
  await mongoose.connection.close()
})