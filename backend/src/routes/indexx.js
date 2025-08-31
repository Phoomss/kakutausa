const Route = require('express')
const routRouter = Route()
const authRouter = require('./authRouter')
const categoryRouter = require('./categoryRouter')
const addressTypeRouter = require('./addressTypeRouter')
const addressRouter = require('./addressRouter')

routRouter.use('/auth', authRouter)
routRouter.use('/categories', categoryRouter)
routRouter.use('/address-types', addressTypeRouter)
routRouter.use('/addresses', addressRouter)

module.exports = routRouter