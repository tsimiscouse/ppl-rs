import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middlewares/errorHandler';

// Routes
import doctorRoutes from './routes/doctorRoutes';
import patientQueueRoutes from './routes/patientQueueRoutes';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Hospital Queue System API',
    version: '1.0.0',
    endpoints: {
      doctors: '/api/doctors',
      visitTimes: '/api/visit-times',
      patientQueues: '/api/patient-queues'
    }
  });
});

// API routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/patient-queues', patientQueueRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;