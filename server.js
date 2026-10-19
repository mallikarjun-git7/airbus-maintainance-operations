require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase, seedData } = require('./src/db/database');
const authRoutes = require('./src/routes/auth.routes');
const requestsRoutes = require('./src/routes/requests.routes');
const equipmentRoutes = require('./src/routes/equipment.routes');
const workCentersRoutes = require('./src/routes/workcenters.routes');
const { errorHandler, notFoundHandler } = require('./src/middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await initDatabase();
    
    // Seed sample data (idempotent)
    await seedData();

    // Middleware
    app.use(cors({
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
      credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logging
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });

    // Health check
    app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'GearGuard API is running',
        timestamp: new Date().toISOString()
      });
    });

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/requests', requestsRoutes);
    app.use('/api/equipment', equipmentRoutes);
    app.use('/api/work-centers', workCentersRoutes);

    // 404 handler
    app.use(notFoundHandler);

    // Error handler (must be last)
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║     GearGuard Backend API Server      ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                           
║  Environment: ${process.env.NODE_ENV || 'development'}
║  Database: SQLite (${process.env.DATABASE_PATH})
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});
