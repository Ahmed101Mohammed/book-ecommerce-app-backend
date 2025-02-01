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

describe('POST /api/books/ tests', () => 
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

  test('Create new book successfuly', async()=>
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

    const newBook = createBookResponse.body.data
    assert.strictEqual(newBook.price, book.price)
    assert.strictEqual(newBook.title, book.title)
  })

  describe('Failed to create book with invalied title', async() =>
  {
    test('Filed to create book with dublicated title', async() =>
    {
      const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({authorization: `Bearer ${token}`})
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api
      .post('/api/books')
      .set({authorization: `Bearer ${token}`})
      .send(book)
      .expect(409) //DublicatedData
      .expect('Content-Type', /application\/json/)
    })

    // Title missed
    test('Filed to create book with no title', async() =>
    {
      const newBook = {price: 50}
      const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({authorization: `Bearer ${token}`})
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    // Title less than 10 chars
    test('Filed to create book with title length less than 10 chars', async() =>
    {
      const newBook = {...book, title: 'ahmed mo'}
      
      const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({authorization: `Bearer ${token}`})
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    // Title more than 10 chars
    test('Filed to create book with title length more than 100 chars', async() =>
    {
      const newBook = {
        ...book, 
        title: 'LapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLapLap'
      }
      
      const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({authorization: `Bearer ${token}`})
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('Failed to create book with invalied price', async() =>
  {
    test('Filed to create book with missed price', async() =>
    {
      const newBook = {title: 'Hydy in My day'}

      const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({authorization: `Bearer ${token}`})
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    // Price less than 0
    test('Filed to create book with no title', async() =>
    {
      const newBook = {...book, price: -90}
      const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({authorization: `Bearer ${token}`})
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    // Price not a number
    test('Filed to create book with price not a number', async() =>
    {
      const newBook = {...book, price: 'ahmed mo'}
      
      const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({authorization: `Bearer ${token}`})
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    // Price is a float number
    test('Success even the price is a float number (double)', async() =>
    {
      const newBook = {
        ...book, 
        price: 6.5
      }
      
      const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({authorization: `Bearer ${token}`})
        .send(newBook)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('Failed to create book with invalid description', async() => {
    test('Failed to create book with description less than 50 chars', async() => {
      const newBook = { ...book, description: 'short' }
      
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('Failed to create book with description more than 1000 chars', async() => {
      const newBook = { 
        ...book, 
        description: 'a'.repeat(1001) 
      }
      
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('Failed to create book with description as a number', async() => {
      const newBook = { ...book, description: 6 }
      
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('Failed to create book with invalid quantity', async() => {
    test('Failed to create book with quantity less than 0', async() => {
      const newBook = { ...book, quantity: -1 }
      
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('Failed to create book with quantity as a string', async() => {
      const newBook = { ...book, quantity: 'ten' }
      
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('Failed to create book with quantity as a float', async() => {
      const newBook = { ...book, quantity: 5.5 }
      
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const token = response.body.accessToken
      
      await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(newBook)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('Failed to create book with unauthenticated or unauthorized user', async() => {
    test('Failed to create book without authentication', async() => {
      await api
        .post('/api/books')
        .send(book)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })

    test('Failed to create book with invalid token', async() => {
      await api
        .post('/api/books')
        .set({ authorization: 'Bearer invalidtoken' })
        .send(book)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })

    test('Failed to create book with non-admin user', async() => {
      const nonAdmin = {
        name: 'userS',
        password: 'userpA@33ssword',
        email: 'user@example.com'
      }

      await api
        .post('/auth/register')
        .send(nonAdmin)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api
        .post('/auth/login')
        .send(nonAdmin)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = response.body.accessToken

      await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(403)
        .expect('Content-Type', /application\/json/)
    })
  })
})

after(async() =>
{
  await User.deleteMany({})
  await Book.deleteMany({})
  await mongoose.connection.close()
})
