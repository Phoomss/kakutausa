const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/constants");
const prisma = require("../config/db");

// Middleware function for authentication
const authMiddleware = async (req, res, next) => {
  // Extracting token from Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // Check if token is present
  if (!token) {
    // Respond with 401 Unauthorized if token is missing
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verifying the JWT and extracting payload
    const payload = jwt.verify(token, JWT_SECRET);

    // Fetching the user from the database based on userId in the token payload
    const user = await prisma.user.findFirst({ where: { id: payload.userId } });

    // Check if the user exists
    if (!user) {
      // Respond with 401 Unauthorized if user does not exist
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // If user exists, attach the user object to the request
    req.user = user;

    // Call next() to pass control to the next middleware
    next();
  } catch (error) {
    // Respond with 401 Unauthorized if token verification fails
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;