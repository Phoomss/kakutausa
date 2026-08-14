const app = require('./app');
const prisma = require('./config/db');
const { PORT } = require('./utils/constants');
const { initializeAdminUser } = require('./controllers/authController');

// Validate required environment variables on startup
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`❌ CRITICAL: Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

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
