require('dotenv').config({ path: '.env' })

const PORT = process.env.PORT || 8081
const JWT_SECRET = process.env.JWT_SECRET
const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_PASS = process.env.GMAIL_PASS
const FROM_EMAIL = process.env.FROM_EMAIL
const TEAM_EMAIL = process.env.TEAM_EMAIL
module.exports = {
    PORT,
    JWT_SECRET,
    GMAIL_USER,
    GMAIL_PASS,
    FROM_EMAIL,
    TEAM_EMAIL,
}