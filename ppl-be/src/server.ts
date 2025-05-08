import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection established');
    
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
});