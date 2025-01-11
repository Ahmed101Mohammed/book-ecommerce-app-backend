import { test, after, describe, beforeEach } from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../../app.js'
import User from '../../../models/User.js'
import authHelperFunctions from './helper.js'
import assert from 'node:assert'
const api = supertest(app)

beforeEach(async ()=> 
{
  await User.deleteMany({})
})

describe('/auth/register tests', ()=> 
{
  let user = {
    name: '7atem',
    email: '7atem@gmail.com',
    password: '7atem2M$99309'
  }

  test('Register with the valied name, password, and email sucessfuly', async()=>
  {
    await api
      .post('/auth/register')
      .send(user)
      .expect(201)

    const users = await authHelperFunctions.getAllUsers()
    assert.strictEqual(users.length, 1)
  })

  describe('Registering with invalid inputs', ()=>
  {
    test('Register with no name, password, or email for the user', async() => 
    {
      await api
        .post('/auth/register')
        .send({
          name: user.name,
          password: user.password
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      await api
        .post('/auth/register')
        .send({
          email: user.email,
          password: user.password
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)


      await api
        .post('/auth/register')
        .send({
          name: user.name,
          email: user.email
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('Register with invalid name', async()=> 
    {
      const newUser = {...user, name: 'ali'}
      await api
        .post('/auth/register')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const newUser1 = {...user, name: 'Ali Alaa Elsayed Qetitah Al3gwany'}
      await api
        .post('/auth/register')
        .send(newUser1)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    })

    test('Register with invalid email', async()=> 
    {
      const newUser = {...user, email: 'ali'}
      await api
        .post('/auth/register')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const newUser1 = {...user, name: 'Ali Alaa Elsayed Qetitah Al3gwany@gmail.com'}
      await api
        .post('/auth/register')
        .send(newUser1)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('Register with dublicated email', async()=>
    {
      const user = {
        name: "70sam",
        email: 'do@mo.no',
        password: '983@G212kj'
      }

      await api
        .post('/auth/register')
        .send(user)
        .expect(201)

      await api
        .post('/auth/register')
        .send(user)
        .expect(409)
        .expect('Content-Type', /application\/json/)
    })

    test('Register with invalid password', async()=> 
    {
      const newUser = {...user, password: 'ali'}
      await api
        .post('/auth/register')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const newUser1 = {...user, password: 'Ali Alaa Elsayed Qetitah Al3gwany@gmail.com'}
      await api
        .post('/auth/register')
        .send(newUser1)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const newUser2 = {...user, password: 'asldhfoe-?'}
      await api
        .post('/auth/register')
        .send(newUser2)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })
})
after(async() =>
{
  await User.deleteMany({})
  await mongoose.connection.close()
})