import express from 'express'
import registerController from '../controllers/auth/register.js'
import loginController from '../controllers/auth/login.js'
import verifyJWT from '../middlewares/verifyJWT.js'
import logout from '../controllers/auth/logout.js'
import refreash from '../controllers/auth/refreash.js'
const authRouter = express.Router()
authRouter.route('/register')
  .post(registerController)

authRouter.route('/login')
  .post(loginController)

authRouter.route('/logout')
  .post(verifyJWT, logout)

authRouter.route('/refreash')
  .get(refreash)
export default authRouter