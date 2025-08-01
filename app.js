const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./models/db');
const userRouter = require('./routes/user');

const User = require('./models/user');

const app = express();

// CORS middleware - allow all origins for testing
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(express.json());
app.use(userRouter);

// Test route to verify server is running
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend API is running successfully on Vercel!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(8000, 'localhost', () => {
    console.log('Server is running on port 8000');
  });
}

// Export for Vercel serverless
module.exports = app;
