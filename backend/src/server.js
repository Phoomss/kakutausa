const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { PORT } = require('./utils/constants');
const { initializeAdminUser } = require('./controllers/authController');
const routRouter = require('./routes/indexx');

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: "https://kakutausa.vercel.app/", 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/models", express.static("uploads/models"));


// Initialize admin user
initializeAdminUser();

app.use('/api', routRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
