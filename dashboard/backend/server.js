const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const router = express.Router();
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());
module.exports = router;

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/clubhead', require('./routes/clubhead'));
app.use('/api/student', require('./routes/student'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));