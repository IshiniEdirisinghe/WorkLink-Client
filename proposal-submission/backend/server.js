require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const proposalRoutes = require('./routes/proposals');
const path = require('path');

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files as static resources
app.use('/api/proposals', proposalRoutes); // Proposal routes

// Validate MongoDB URI
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI not set in .env file');
  process.exit(1); // Exit with failure if no MongoDB URI is provided
}

// Connect to MongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process if connection fails
  }
};
connectToDB();

// Root route for health check or simple test
app.get('/', (req, res) => {
  res.send('API is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
