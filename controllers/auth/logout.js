import User from "../../models/User.js"
import cryptoMethods from "../../utils/cryptoMethods.js"
import BlockedAccessToken from "../../models/BlockedAccessTokens.js"
const logout = async(request, response) =>
{
  // get user id
  const userId = request.authData.id

  // find user
  const user = await User.findById(userId)
  user.refreachToken = ''
  
  // save user data
  await user.save()

  // block current access token
  const accessToken = request.headers['authorization'].split(' ')[1]
  
  const accessTokenEnchrepted = cryptoMethods.encryptData(accessToken)
  const accessTokenHashed = cryptoMethods.hashData(accessToken)
  const newBlockedAccessToken = new BlockedAccessToken({
    token: {
      value: accessTokenEnchrepted.encryptedData,
      iv: accessTokenEnchrepted.iv
    },
    hashedToken: accessTokenHashed
  })

  await newBlockedAccessToken.save()

  // send a response
  response.status(204).end()
}

export default logout