import { test, after, describe, beforeEach, before } from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../../app.js'
import User from '../../../models/User.js'
import BlockedAccessToken from '../../../models/BlockedAccessTokens.js'
import connectToDB from '../../../dbConnection.js'

const api = supertest(app)
before( async () =>
{
  await connectToDB()
})
beforeEach(async ()=> 
{
  await User.deleteMany({})
  await BlockedAccessToken.deleteMany({})
  // console.log(`Hi I'm before each`)
})

describe('/auth/logout/ tests', () => 
{
  const user = {
    name: "Ahmed Mohamed",
    password: "Aa8@dienflsddi392@",
    email: 'a@gmail.com'
  }

  test('Logout successfuly after login', async()=>
  {
    await api
      .post('/auth/register')
      .send(user)
      .expect(201)
    
    const response = await api
      .post('/auth/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const token = response.body.accessToken
    await api
      .post('/auth/logout')
      .set({authorization: `Bearer ${token}`})
      .expect(204)
  })

  test('Failed to logout twice directly', async() =>
  {
    await api
      .post('/auth/register')
      .send(user)
      .expect(201)
    
    const response = await api
      .post('/auth/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const token = response.body.accessToken
    await api
      .post('/auth/logout')
      .set({authorization: `Bearer ${token}`})
      .expect(204)

    await api
      .post('/auth/logout')
      .set({authorization: `Bearer ${token}`})
      .expect(401)
  })

  test('Failed to logout without login', async() =>
  {
    await api
      .post('/auth/logout')
      .expect(401)
  })
})

after(async() =>
{
  await User.deleteMany({})
  await BlockedAccessToken.deleteMany({})
  await mongoose.connection.close()
})
