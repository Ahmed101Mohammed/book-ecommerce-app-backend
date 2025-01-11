import jwt from 'jsonwebtoken'
import proccessVars from '../utils/confige.js'
import cryptoMethods from '../utils/cryptoMethods.js'
import BlockedAccessToken from '../models/BlockedAccessTokens.js'

const verifyJWT = async(request, response, next) =>
{
  const authHeader = request.headers['authorization']
  if(!authHeader)
  {
    return next({ name: 'UNAUTHORIZED', message: 'Not authorized to access the route'})
  }

  const accessToken = authHeader.split(' ')[1]
  const hashedAccessToken = cryptoMethods.hashData(accessToken)
  const hashedAcccessTokenInDb = await BlockedAccessToken.findOne({hashedToken: hashedAccessToken})

  if(hashedAcccessTokenInDb)
  {
    const accessToken = cryptoMethods.decryptData(hashedAcccessTokenInDb.token.get('value'), hashedAcccessTokenInDb.token.get('iv'))
    try
    {
      jwt.verify(accessToken, proccessVars.ACCESS_TOKEN)
    }
    catch(e)
    {
      await BlockedAccessToken.deleteOne({hashedToken: hashedAccessToken})
    }

    return next({ name: 'UNAUTHORIZED', message: 'Token is invalied sience user logedout'})
  }

  try
  {
    const accessData = await jwt.verify(accessToken, proccessVars.ACCESS_TOKEN)
    request.authData = accessData
  }
  catch(e)
  {
    return next({ name: 'UNAUTHORIZED', message: e.message})
  }
  next()
}

export default verifyJWT