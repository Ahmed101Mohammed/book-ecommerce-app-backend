import { test, describe } from 'node:test'
import assert from 'node:assert'
import cryptoMethods from '../../utils/cryptoMethods.js'

describe('cryptoMethods module tests', ()=>
{
  describe('encryptData function tests', () =>
  {
    const origin = 'Ali Alaa'
    const encryptData = cryptoMethods.encryptData
    test('Encrypt the data successfully', ()=>
    {
      const result = encryptData(origin)
      assert.notStrictEqual(result.encryptedData, origin)
    })

    test('Encrypt the same data twice, and generate different result in each time', ()=>
    {
      const result1 = encryptData(origin)
      const result2 = encryptData(origin)
      assert.notStrictEqual(result1.encryptedData, result2.encryptedData)
    })
  })

  describe('decryptData function test', () =>
  {
    const origin = 'Ali Alaa'
    const encryptData = cryptoMethods.encryptData
    const decryptData = cryptoMethods.decryptData
    test('Decrypt data succesfully', ()=>
    {
      const encrypted = encryptData(origin)
      const decrypted = decryptData(encrypted.encryptedData, encrypted.iv)
      assert.strictEqual(origin, decrypted)
    })
  })

  describe('hashData function test', () =>
  {
    const origin = 'Ali Alaa'
    const hashData = cryptoMethods.hashData

    test('Hashing data successfully', () =>
    {
      const result = hashData(origin)
      assert.notStrictEqual(result, origin)
    })

    test('Hashing data twice, give me the same result for both', () =>
    {
      const result1 = hashData(origin)
      const result2 = hashData(origin)
      assert.strictEqual(result1, result2)
    })
  })
})

