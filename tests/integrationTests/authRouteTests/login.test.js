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
  // console.log(`Hi I'm before each`)
})

describe('/auth/login tests', ()=> 
{
  let user = {
    email: '7atem@gmail.com',
    password: '7atem2M@99309',
    name: '7atem Beh'
  }

  test('login with the valied password and email sucessfuly', async()=>
  {
    await api
      .post('/auth/register')
      .send(user)
      .expect(201)

    const users = await  authHelperFunctions.getAllUsers()
    assert.strictEqual(users.length, 1)
    
    await api
      .post('/auth/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  describe('logining with invalid inputs', ()=>
  {
    test('login with no password, or email for the user', async() => 
    {
      await api
        .post('/auth/login')
        .send({
          password: user.password
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      await api
        .post('/auth/login')
        .send({
          email: user.email,
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('login with invalid email', async()=> 
    {
      const newUser = {...user, email: 'ali'}
      await api
        .post('/auth/login')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const newUser1 = {...user, email: 'AliAlaaElsayedQetitah Al3gwany@gmail.com'}
      await api
        .post('/auth/login')
        .send(newUser1)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('login with not registered email', async() =>
    {
      const user = {
        email: 'ahmed@eal.com',
        password: 'aA3@loien2o93jlm'
      }

      await api
        .post('/auth/login')
        .send(user)
        .expect(404)
        .expect('Content-Type', /application\/json/)
    })

    test('login with invalid password', async()=> 
    {
      const newUser = {...user, password: 'aS@9'}
      await api
        .post('/auth/login')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const newUser1 = {...user, password: 'AliAlaaElsayedQetitahAl3gwany@gmail.com'}
      await api
        .post('/auth/login')
        .send(newUser1)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const newUser2 = {...user, password: 'asldhfoe-?'}
      await api
        .post('/auth/login')
        .send(newUser2)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('login with wrong password', async() =>
    {
      const user = {
        name: 'Ali Mohamed',
        email: 'ali@m.com',
        password: 'asaa89Akd$'
      }

      await api
        .post('/auth/register')
        .send(user)
        .expect(201)

      await api
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'soieW23@ssa'
        })
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })
  })
})

after(async() =>
{
  await User.deleteMany({})
  await mongoose.connection.close()
})