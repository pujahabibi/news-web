require('dotenv').config();
const app = require('./app');
const { env } = require('./config/env');

const PORT = env.PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 News API server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${env.NODE_ENV}`);
});