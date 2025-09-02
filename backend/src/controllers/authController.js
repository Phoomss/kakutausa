const prisma = require("../config/db")
const { JWT_SECRET } = require("../utils/constants")
const { hashPassword, comparePassword } = require("../utils/hashPassword")
const InternalServer = require("../utils/internal-server")
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const existingUsername = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (existingUsername) {
            return res.status(400).json({
                message: "Username already exists"
            })
        }

        const existingEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingEmail) {
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        const hashedPassword = await hashPassword(password)

        const register = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        return res.status(201).json({
            message: "User registered successfully",
            data: register
        })
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.login = async (req, res) => {
    const { login, password } = req.body; // login = username หรือ email

    try {
        if (!login || !password) {
            return res.status(400).json({
                message: "Username/email and password are required"
            });
        }

        // ตรวจสอบว่า login เป็น email หรือ username
        const isEmail = login.includes("@");

        // สร้าง where condition
        const whereConditions = isEmail
            ? [{ email: login }]
            : [{ username: login }];

        const identifier = await prisma.user.findFirst({
            where: { OR: whereConditions }
        });

        if (!identifier) {
            return res.status(400).json({
                message: "Invalid username or email"
            });
        }

        const isPasswordValid = await comparePassword(
            password,
            identifier.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const jwtToken = jwt.sign(
            {
                userId: identifier.id,
                username: identifier.username,
                email: identifier.email
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ส่ง JWT ลง cookie
        res.cookie('sescoin', jwtToken, {
            httpOnly: true,
            secure: false, // true ถ้าใช้ HTTPS
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60
        });

        return res.status(200).json({
            message: "Login successful",
            data: {
                userId: identifier.id,
                username: identifier.username,
                email: identifier.email,
                token: jwtToken
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        InternalServer(res, error);
    }
};

exports.initializeAdminUser = async () => {
    try {
        const adminUser = await prisma.user.findFirst({
            where: { username: 'admin' }
        });

        if (!adminUser) {
            const hashedPassword = await hashPassword('admin1234');
            await prisma.user.create({
                data: {
                    username: 'admin',
                    email: 'admin@example.com',
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
            console.log('Admin user created successfully!');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        InternalServer(null, error);
    }
};