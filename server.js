const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Add a root route
app.get('/', (req, res) => {
  res.send('Welcome to my API!'); // Simple response
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/slides', require('./routes/slideRoutes'));

// Error handling middleware (optional, improves error management)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Set the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
