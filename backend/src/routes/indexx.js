const Route = require('express')
const routRouter = Route()
const authRouter = require('./authRouter')
const categoryRouter = require('./categoryRouter')

routRouter.use('/auth', authRouter)
routRouter.use('/categories', categoryRouter)

module.exports = routRouter