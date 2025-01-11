import User from "../../../models/User.js"

const printUsersData = async()=>
{
  const users = await User.find({})
  console.log('Users Length:', users.length)
  console.log('Users data:', {users})
}

const getAllUsers = async() =>
{
  const users = await User.find({})
  return users
}

const authHelperFunctions = {
  printUsersData,
  getAllUsers
}

export default authHelperFunctions