import User from "../models/User.js"
import cryptoMethods from "./cryptoMethods.js"

const authenticated = (role) =>
{
  return async (request, response, next) =>
  {
    const authData = request.authData
    const userId = authData.id
    // get the user
    const userRole = await User.findById(userId).select('role')

    // Check the user role
    const roleMap = userRole.role
    const value = roleMap.get('value')
    const iv = roleMap.get('iv')
    const userRoleDecoded = cryptoMethods.decryptData(value, iv)
    if(userRoleDecoded !== role) return next({name: 'UNAUTHENTICATED', message: 'Access denied'})

    next()
  }
}

export default authenticated