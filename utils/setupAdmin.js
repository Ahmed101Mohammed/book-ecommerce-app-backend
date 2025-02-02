import User from "../models/User.js"
import Joi from "joi"
import proccessVars from "./confige.js"
import logger from "./logger.js"
import cryptoMethods from "./cryptoMethods.js"
import upash from "upash"
import rolesConstants from "./rolesConstants.js"


const setupAdmin = async() =>
{
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
  
  const admin = proccessVars.ADMIN_USER
  const validationResponse = await schema.validate({name: admin.NAME, email: admin.EMAIL, password: admin.PASSWORD})
  if(validationResponse.error)
  {
    return logger.error(`Error-> ${validationResponse.error}`)
  }
  const validData = validationResponse.value
  
  // validate data step 2: email is not dublicated
  const hashEmail = cryptoMethods.hashData(validData.email)
  const dublicatedEmail = await User.findOne({hash_email: hashEmail})
  if(dublicatedEmail)
  {
    console.log(`Admin is already exist`)
    return
  }

  // Encrypt password
  const hashedPassword = await upash.hash(validData.password)

  // Encrypt other data
  const encryptedName = cryptoMethods.encryptData(validData.name)
  const encryptedEmail = cryptoMethods.encryptData(validData.email)
  const encryptedRole = cryptoMethods.encryptData(rolesConstants.ADMIN)

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
  console.log(`Admin created successfuly`)
}


export default setupAdmin