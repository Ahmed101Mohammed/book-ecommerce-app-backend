import Joi from "joi"
import User from "../../models/User.js"
import cryptoMethods from "../../utils/cryptoMethods.js"
import upash from "upash"
import jwt from 'jsonwebtoken'
import proccessVars from '../../utils/confige.js'
const loginController = async(request, response, next) =>
{
  // Get user input
  const data = request.body
  const { email, password } = data

  // Validate user inputs
  const schema = Joi.object({
    email: Joi.string()
              .email()
              .min(3)
              .max(100)
              .required(),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'), 
        'pattern for strong password. Sure the password lenght is more than 7, and it contain at least one (Lower & Upper & special charcters And one digit)')
      .min(9)
      .max(30)
      .required()
  })

  const validationResponse = schema.validate({email, password})
  if(validationResponse.error)
  {
    return next(validationResponse.error)
  }

  const validData = validationResponse.value

  // Get the user data from DB
  const hashEmail = cryptoMethods.hashData(validData.email)
  const user = await User.findOne({hash_email: hashEmail}, 'password _id')
  if(!user)
  {
    return next({name: 'NOTFOUND', message: `The ${validData.email} email didn't register before`})
  }

  // Check that password is true
  const isPasswordTrue = await upash.verify(user.password, validData.password)
  if(!isPasswordTrue)
  {
    return next({name: 'WRONGCREDENTIALS', message: 'Wrong password'})
  }

  // Create jwt
  const accessToken = jwt.sign({id: user._id}, proccessVars.ACCESS_TOKEN, { expiresIn: '2m' })
  const refreachToken = jwt.sign({id: user._id}, proccessVars.REFREASH_TOKEN, { expiresIn: "5m" })


  // Save refreachToken in DB
  user.refreachToken = refreachToken
  await user.save()

  // Save the refreash token in the secure cookie
  response.cookie('jwt', refreachToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 5 * 1000})

  // Respond with true status
  return response.status(200).json({state: true ,accessToken}).end()
}

export default loginController