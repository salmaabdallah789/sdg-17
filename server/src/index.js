import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scenarioRoutes from './routes/scenarios.js';
import simulationRoutes from './routes/simulation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/simulate', simulationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SDG 17 Simulation API is running' });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Trying alternative port ${port + 1}...`);
      server.close(() => {
        startServer(port + 1);
      });
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  return server;
}

startServer(PORT);

