const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { PORT } = require('./utils/constants');
const routRouter = require('./routes/indexx');
const { initializeAdminUser } = require('./controllers/authController');

const app = express();

app.use(cookieParser())
app.use(cors(
    {
        origin: '*', 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], 
        credentials: true, 
        allowedHeaders: ['Content-Type', 'Authorization'] 
    }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

initializeAdminUser();
app.use('/api', routRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});