const express = require('express');
const router = express.Router();
const {
  createStory,
  editStory,
  bookmarkStory,
  getStories,
  getStoryById,
} = require('../controllers/storyController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to create a new story
router.post('/', authMiddleware, createStory);

// Route to edit an existing story
router.put('/:id', authMiddleware, editStory);

// Route to bookmark a story
router.put('/:id/bookmark', authMiddleware, bookmarkStory);

// Route to get all stories
router.get('/', getStories);

// Route to get a specific story by ID
router.get('/:id', getStoryById);

module.exports = router;
