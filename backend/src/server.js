const app = require('./app');
const prisma = require('./config/db');
const { PORT } = require('./utils/constants');
const { initializeAdminUser } = require('./controllers/authController');

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
