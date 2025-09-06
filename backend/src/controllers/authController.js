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
                email: identifier.email,
                role: identifier.role
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ส่ง JWT ลง cookie
        res.cookie('sescoin', jwtToken, {
            httpOnly: true,
            secure: true, // true ถ้าใช้ HTTPS
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60
        });

        return res.status(200).json({
            message: "Login successful",
            data: {
                userId: identifier.id,
                username: identifier.username,
                email: identifier.email,
                role: identifier.role,
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

exports.userInfo = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        res.status(200).json({ message: "User info retrieved successfully", data: req.user });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.logout = async (req, res) => {
    try {
        // ลบ cookie sescoin
        res.cookie('sescoin', '', {
            httpOnly: true,
            secure: true, // true ถ้าใช้ HTTPS
            sameSite: 'lax',
            maxAge: 0
        });

        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.userId;

        // ตรวจสอบ username ซ้ำ
        const existingUsername = await prisma.user.findFirst({
            where: { username, id: { not: userId } }
        });
        if (existingUsername) {
            return res.status(409).json({ message: "Username already exists" });
        }

        // ตรวจสอบ email ซ้ำ
        const existingEmail = await prisma.user.findFirst({
            where: { email, id: { not: userId } }
        });
        if (existingEmail) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // สร้าง object สำหรับ update
        const dataToUpdate = { username, email };

        if (password && password.trim() !== "") {
            const hashedPassword = await hashPassword(password);
            dataToUpdate.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        InternalServer(res, error);
    }
};