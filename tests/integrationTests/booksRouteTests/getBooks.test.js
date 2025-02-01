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

describe('Get /api/books/ tests', () => 
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

  test('Get books successfuly', async()=>
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

    const oneBook = await api
      .get('/api/books')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const books = oneBook.body.data
  
    assert.strictEqual(books.length, 1)
    assert.strictEqual(books[0].title, book.title)
    assert.strictEqual(books[0].price, book.price)
  })

  test('Create multiple books successfully and retrieve them', async () => {
    const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.accessToken

    const booksToCreate = [
      { title: 'Clean Code', price: 200 },
      { title: 'The Pragmatic Programmer', price: 250 },
      { title: 'You Don\'t Know JS', price: 150 }
    ]

    for (let book of booksToCreate) 
    {
      await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    }

    const responseBooks = await api
      .get('/api/books')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const books = responseBooks.body.data

    assert.strictEqual(books.length, booksToCreate.length)
    booksToCreate.forEach((book, index) => {
      assert.strictEqual(books[index].title, book.title)
      assert.strictEqual(books[index].price, book.price)
    })
  })

  test('Get specific number of books with pagination', async () => {
    const response = await api
      .post('/auth/login')
      .send(admin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.accessToken

    const booksToCreate = [
      { title: 'Clean Code', price: 200 },
      { title: 'The Pragmatic Programmer', price: 250 },
      { title: 'You Don\'t Know JS', price: 150 },
      { title: 'Refactoring', price: 300 },
      { title: 'Design Patterns', price: 350 }
    ]

    for (let book of booksToCreate) 
    {
      await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    }

    const page = 1
    const limit = 3

    const responseBooks = await api
      .get(`/api/books/?page=${page}&limit=${limit}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const books = responseBooks.body.data

    assert(books.length <= limit)
    booksToCreate.slice(3, 3+limit).forEach((book, index) => {
      assert.strictEqual(books[index].title, book.title)
      assert.strictEqual(books[index].price, book.price)
    })
  })
})

after(async() =>
{
  await User.deleteMany({})
  await Book.deleteMany({})
  await mongoose.connection.close()
})