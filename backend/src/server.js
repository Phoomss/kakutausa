const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PORT } = require('./utils/constants');
const { initializeAdminUser } = require('./controllers/authController');
const routRouter = require('./routes/index');
const prisma = require('./config/db');
const swagger = require('./config/swagger');

const app = express();

// Trust proxy (required for correct client IP detection under Docker/Proxies/Cloudflare)
app.set('trust proxy', 1);

// Secure Express headers with Helmet (OWASP A05:2021-Security Misconfiguration)
app.use(helmet());

// Hide X-Powered-By banner to prevent tech stack fingerprinting
app.disable('x-powered-by');

// Secure CORS configuration
const allowedOrigins = [
  'https://kakutausa.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or local swagger UI)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Rate Limiters to protect against DoS & Brute Force (OWASP A04:2021, A07:2021)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 authentication/email requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login or email attempts, please try again after 15 minutes.' }
});

// Apply rate limiting to API routes
app.use('/api/auth', authLimiter);
app.use('/api/send-email', authLimiter);
app.use('/api', generalLimiter);

app.use('/api', routRouter);
app.use('/api-docs', swagger.serve, swagger.setup);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    await initializeAdminUser();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
