const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

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

// Define a simple route
app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});