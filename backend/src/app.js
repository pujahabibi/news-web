const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { env } = require('./config/env');

// Import routes
const healthRoutes = require('./interfaces/http/routes/health');
const articleRoutes = require('./interfaces/http/routes/articles');
const categoryRoutes = require('./interfaces/http/routes/categories');
const uploadRoutes = require('./interfaces/http/routes/uploads');
const searchRoutes = require('./interfaces/http/routes/search');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/search', searchRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    error: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404 handler (Express 5 compatible - no wildcards)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;