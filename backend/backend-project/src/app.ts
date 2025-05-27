import express from 'express';
import mongoose from 'mongoose';
import { connectPostgres } from './config/postgresql';
import connectToMongoDB from './config/mongodb';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectToMongoDB()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Connect to PostgreSQL
connectPostgres()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch((error) => {
    console.error('PostgreSQL connection error:', error);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});