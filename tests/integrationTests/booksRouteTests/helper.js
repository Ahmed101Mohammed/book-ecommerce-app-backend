import User from "../../../models/User.js"
import proccessVars from "../../../utils/confige.js"
import cryptoMethods from "../../../utils/cryptoMethods.js"

const deleteAllUsersExceptAdmin = async() =>
{
  const hashedEmail = cryptoMethods.hashData(proccessVars.ADMIN_USER.EMAIL)
  await User.deleteMany({hash_email: {$ne: hashedEmail}})
}

const booksRouteHelperFunctions = {
  deleteAllUsersExceptAdmin
} 

export default booksRouteHelperFunctions