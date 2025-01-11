import proccessVars from './confige.js'
import crypto from 'crypto'

const encryptAlgorithm = proccessVars.ENCRYPTED_ALGORITHM
const generalKey = proccessVars.ENCRYPTION_KEY

const encryptData = (data) =>
{
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(encryptAlgorithm, Buffer.from(generalKey, 'hex'), iv)
  const encryptedData = cipher.update(data, 'utf8', 'hex')
  const finalPart = cipher.final('hex')
  const completeEncryptedData = encryptedData + finalPart
  return {
    iv: iv.toString('hex'),
    encryptedData: completeEncryptedData
  }
}

const decryptData = (encryptedData, iv) =>
{
  const decipher = crypto.createDecipheriv(encryptAlgorithm, Buffer.from(generalKey, 'hex'), Buffer.from(iv, 'hex'))
  const decryptedData = decipher.update(encryptedData, 'hex', 'utf8')
  const finalPart = decipher.final('utf8')
  const fullDecryptedData = decryptedData + finalPart
  return fullDecryptedData
}

const hashData = (data) =>
{
  return crypto.createHash('sha256').update(data).digest('hex')
}

const cryptoMethods = {
  encryptData,
  decryptData,
  hashData
}

export default cryptoMethods