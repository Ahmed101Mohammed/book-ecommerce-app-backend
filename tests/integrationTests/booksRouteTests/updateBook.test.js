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

describe('PUT /api/books/:id tests', () => 
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

  test('Update book successfuly', async()=>
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
    const newBookVersion = {price: 999}
    const updateBookResponse = await api
      .put(`/api/books/${bookId}`)
      .set({authorization: `Bearer ${token}`})
      .send(newBookVersion)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBook = updateBookResponse.body.data
    assert.strictEqual(updatedBook.price, newBookVersion.price)
    assert.strictEqual(updatedBook.title, book.title)
  })

  describe('Failed to update book with invalid title', () => {
    test('Failed to update book with title less than 10 chars', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const token = response.body.accessToken;

      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const bookId = createBookResponse.body.data.id;
      const newBookVersion = { title: 'short' };
      await api
        .put(`/api/books/${bookId}`)
        .set({ authorization: `Bearer ${token}` })
        .send(newBookVersion)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });

    test('Failed to update book with title more than 100 chars', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const token = response.body.accessToken;

      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);        
      const bookId = createBookResponse.body.data.id;

      const newBookVersion = { title: 'a'.repeat(101) };
      await api
        .put(`/api/books/${bookId}`)
        .set({ authorization: `Bearer ${token}` })
        .send(newBookVersion)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });

  });

  describe('Failed to update book with invalid description', () => {
    test('Failed to update book with description less than 50 chars', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const token = response.body.accessToken;

      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const bookId = createBookResponse.body.data.id;

      const newBookVersion = { description: 'short' };
      await api
        .put(`/api/books/${bookId}`)
        .set({ authorization: `Bearer ${token}` })
        .send(newBookVersion)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });

    test('Failed to update book with description more than 1000 chars', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const token = response.body.accessToken;
      
      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const bookId = createBookResponse.body.data.id;
      
      const newBookVersion = { description: 'a'.repeat(1001) };
      await api
        .put(`/api/books/${bookId}`)
        .set({ authorization: `Bearer ${token}` })
        .send(newBookVersion)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('Failed to update book with invalid price', () => {
    test('Failed to update book with price less than 0', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const token = response.body.accessToken;

      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const bookId = createBookResponse.body.data.id;

      const newBookVersion = { price: -10 };
      await api
        .put(`/api/books/${bookId}`)
        .set({ authorization: `Bearer ${token}` })
        .send(newBookVersion)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });

    test('Failed to update book with price as a string', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const token = response.body.accessToken;

      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const bookId = createBookResponse.body.data.id;

      const newBookVersion = { price: 'invalid' };
      await api
        .put(`/api/books/${bookId}`)
        .set({ authorization: `Bearer ${token}` })
        .send(newBookVersion)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('Failed to update book with invalid quantity', () => {
    test('Failed to update book with quantity less than 0', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const token = response.body.accessToken;

      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const bookId = createBookResponse.body.data.id;

      const newBookVersion = { quantity: -1 };
      await api
        .put(`/api/books/${bookId}`)
        .set({ authorization: `Bearer ${token}` })
        .send(newBookVersion)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });

    test('Failed to update book with quantity as a string', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const token = response.body.accessToken;

      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const bookId = createBookResponse.body.data.id;

      const newBookVersion = { quantity: 'invalid' };
      await api
        .put(`/api/books/${bookId}`)
        .set({ authorization: `Bearer ${token}` })
        .send(newBookVersion)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('Failed to update book with unauthenticated or unauthorized user', () => {
    test('Failed to update book without authentication', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const token = response.body.accessToken;
      
      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const bookId = createBookResponse.body.data.id;

      const newBookVersion = { price: 999 };
      await api
        .put(`/api/books/${bookId}`)
        .send(newBookVersion)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    });

    test('Failed to update book with invalid token', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const token = response.body.accessToken;

      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${token}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const bookId = createBookResponse.body.data.id;

      const newBookVersion = { price: 999 };
      await api
        .put(`/api/books/${bookId}`)
        .set({ authorization: 'Bearer invalidtoken' })
        .send(newBookVersion)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    });

    test('Failed to update book with non-admin user', async () => {
      const response = await api
        .post('/auth/login')
        .send(admin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const adminToken = response.body.accessToken;

      const createBookResponse = await api
        .post('/api/books')
        .set({ authorization: `Bearer ${adminToken}` })
        .send(book)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const bookId = createBookResponse.body.data.id;

      const nonAdmin = {
        name: 'userS',
        password: 'userpA@33ssword',
        email: 'user@example.com'
      };

      await api
        .post('/auth/register')
        .send(nonAdmin)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const nonAdminResponse = await api
        .post('/auth/login')
        .send(nonAdmin)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const nonAdminToken = nonAdminResponse.body.accessToken;

      const newBookVersion = { price: 999 };
      await api.put(`/api/books/${bookId}`)
        .set({ authorization: `Bearer ${nonAdminToken}` })
        .send(newBookVersion)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    });
    
  });
  
})

after(async() =>
{
  await User.deleteMany({})
  await Book.deleteMany({})
  await mongoose.connection.close()
})
