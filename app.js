require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const nodemailer = require("nodemailer");

// Import routes
const userRoutes = require('./routes/userRoutes');
const levelRoutes = require('./routes/levelRoutes');
const videoRoutes = require('./routes/videoRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all origins
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req, res) => req.ip
});
app.use(limiter);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Learning App API!');
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Load from .env
    pass: process.env.EMAIL_PASS, // Load from .env
  },
});

// Test Nodemailer connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer connection error:', error);
  } else {
    console.log('Nodemailer is ready to send emails');
  }
});


// Use routes
app.use('/api/users', userRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/products', productRoutes);

// Start server
const PORT = process.env.PORT || 5700;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});