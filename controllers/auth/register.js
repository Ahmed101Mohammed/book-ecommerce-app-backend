import Joi from 'joi'
import upash from 'upash'
import argon2 from '@phc/argon2'
import cryptoMethods from '../../utils/cryptoMethods.js'
import User from '../../models/User.js'
upash.install('argon2', argon2)

const registerController = async (request, response, next) =>
{
  // extract needed data
  const registerData = request.body
  const { name, email, password } = registerData

  // validate data Step 1: Data required is exist with its accepted form.
  const schema = Joi.object(
    {
      name: Joi.string()
        .min(5)
        .max(15)
        .required(),
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
    }
  )

  const validationResponse = await schema.validate({name, email, password})
  if(validationResponse.error)
  {
    return next(validationResponse.error)
  }
  const validData = validationResponse.value

  // validate data step 2: email is not dublicated
  const hashEmail = cryptoMethods.hashData(validData.email)
  const dublicatedEmail = await User.findOne({hash_email: hashEmail})
  if(dublicatedEmail)
  {
    return next({name: 'DublicatedData', message: 'The email is already registered before.'})
  }
  
  // Encrypt password
  const hashedPassword = await upash.hash(validData.password)
  
  // Encrypt other data
  const encryptedName = cryptoMethods.encryptData(validData.name)
  const encryptedEmail = cryptoMethods.encryptData(validData.email)
  const encryptedRole = cryptoMethods.encryptData('user')

  // Create user
  const newUser = new User({
    name: {
      value: encryptedName.encryptedData,
      iv: encryptedName.iv
    },
    email: {
      value: encryptedEmail.encryptedData,
      iv: encryptedEmail.iv
    },
    hash_email: hashEmail,
    role: { 
      value: encryptedRole.encryptedData,
      iv: encryptedRole.iv
    },
    password: hashedPassword,
  })

  await newUser.save()
  response.status(201).end()

  // for testing
  // const users = await User.find({})
  // console.log(users.length)
}

export default registerController