// backend/routes/slideRoutes.js
const express = require('express');
const { likeSlide, getSlideById } = require('../controllers/slideController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Fetch slide by ID
router.get('/:id', getSlideById); // Route to fetch individual slide details

// Like a slide (requires authentication)
router.put('/:id/like', authMiddleware, likeSlide); // Ensure that the user is authenticated

module.exports = router;
