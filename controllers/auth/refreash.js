import User from "../../models/User.js"
import jwt from 'jsonwebtoken'
import proccessVars from "../../utils/confige.js"
const refreash = async(request, response, next) =>
{
  const cookies = request.cookies
  if(!cookies?.jwt)
  {
    return next({
      name: 'UNAUTHORIZED',
      message: 'Refreach token is not exist'
    }) 
  }

  const refreachToken = cookies.jwt
  const user = User.findOne({refreachToken}, {'password': false})

  if(!user)
  {
    return next({
      name: 'UNAUTHORIZED',
      message: 'Invalid refreach token.'
    })
  }

  try
  {
    const decoded = jwt.verify(refreachToken, proccessVars.REFREASH_TOKEN)
    const {id} = decoded
    console.log({id})
    const accessToken = jwt.sign({id}, proccessVars.ACCESS_TOKEN, {expiresIn: '2m'})
    return response.status(201).json({state: true, accessToken}).end()
  }
  catch(e)
  {
    return next({
      name: 'UNAUTHORIZED',
      message: e.message
    })
  }
}

export default refreash