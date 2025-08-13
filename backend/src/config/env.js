const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 4000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL
};

// Validate required environment variables
if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

module.exports = { env };