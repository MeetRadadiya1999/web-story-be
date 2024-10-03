const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json()); 

app.use(cors({
  origin: 'https://web-story-dl8hnxu6u-meetradadiya1999s-projects.vercel.app'
}));


app.get('/', (req, res) => {
  res.redirect('/api/stories');
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/slides', require('./routes/slideRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
