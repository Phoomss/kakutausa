const prisma = require("../config/db")
const { JWT_SECRET, DEFAULT_ADMIN_PASSWORD } = require("../utils/constants")
const { hashPassword, comparePassword } = require("../utils/hashPassword")
const InternalServer = require("../utils/internal-server")
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const { username, email, password } = req.body
    try {
        // All validation is handled by middleware now
        const existingUsername = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (existingUsername) {
            return res.status(409).json({  // 409 Conflict for duplicate resource
                message: "Username already exists"
            })
        }

        const existingEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingEmail) {
            return res.status(409).json({  // 409 Conflict for duplicate resource
                message: "Email already exists"
            })
        }

        const hashedPassword = await hashPassword(password)

        const register = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'USER'  // Explicitly set default role
            }
        })

        // Don't return password in response
        const { password: _, ...userWithoutPassword } = register;

        return res.status(201).json({
            message: "User registered successfully",
            data: userWithoutPassword
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
        const defaultAdminPassword =
            DEFAULT_ADMIN_PASSWORD || 'SecurePass!2025@Kakuta';
        const hashedPassword = await hashPassword(defaultAdminPassword);

        await prisma.user.upsert({
            where: { username: 'KakutaAdmin' },
            update: {},
            create: {
                username: 'KakutaAdmin',
                email: 'KakutaAdmin@example.com',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        console.log('Admin user initialized successfully!');
        if (!DEFAULT_ADMIN_PASSWORD) {
            console.warn(
                'Warning: Using default admin password. Please set DEFAULT_ADMIN_PASSWORD environment variable.'
            );
        }
    } catch (error) {
        console.error('Failed to initialize admin user:', error);
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

    const userId = req.user.id;

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
