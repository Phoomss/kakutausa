const authController = require('../controllers/authController')
const Router = require('express')
const authRouter = Router()

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)

module.exports = authRouter