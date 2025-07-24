const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
import path from 'path';

const authRoutes = require('./routes/auth');
const levelRoutes = require('./routes/levels');
const submissionRoutes = require('./routes/submissions');

const app = express();

const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jungle-quest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/submissions', submissionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Jungle Quest API is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html'));  
  });
} else {      
app.listen(PORT, () => {
  console.log(`🚀 Jungle Quest API running on port ${PORT}`);
  console.log(`🌿 Environment: ${process.env.NODE_ENV || 'development'}`);
});
}
module.exports = app;
