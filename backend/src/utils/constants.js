require('dotenv').config({ path: '.env' })

const PORT = process.env.PORT || 8081
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
    PORT,
    JWT_SECRET
}