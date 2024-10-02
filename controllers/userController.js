
// backend/controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password, // Plaintext password
    });

    await user.save(); // Pre-save hook hashes the password

    // Generate JWT Token
    const token = jwt.sign({ user: { userId: user._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);

      if (isMatch) {
        const token = jwt.sign({ user: { userId: user._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated JWT:', token);
        res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
        return;
      } else {
        console.log('Password does not match for user:', email);
      }
    } else {
      console.log('User not found with email:', email);
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Error in loginUser:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const bookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks'); // Ensure bookmarks are populated
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.bookmarks); // Assuming bookmarks is an array of story objects
  } catch (error) {
    console.error('Error fetching bookmarks:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, bookmarks };
