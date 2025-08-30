const Route = require('express')
const routRouter = Route()
const authRouter = require('./authRouter')

routRouter.use('/auth', authRouter)

module.exports = routRouter