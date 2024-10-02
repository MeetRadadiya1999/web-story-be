// backend/controllers/slideController.js
const Slide = require('../models/slideModel');

// Fetch slide by ID
const getSlideById = async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    res.json(slide);
  } catch (error) {
    console.error('Error fetching slide:', error.message); // Log the error
    res.status(500).json({ message: 'Error fetching slide', error: error.message });
  }
};



// Like a slide
const likeSlide = async (req, res) => {
  try {
    const { id } = req.params; // This will be the slide ID
    const slide = await Slide.findById(id);

    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    // Check if the user already liked the slide
    const userId = req.user.id; // Ensure `req.user` has `id`
    if (slide.likes.includes(userId)) {
      // User already liked the slide, so we can remove the like (dislike)
      slide.likes = slide.likes.filter(like => like.toString() !== userId);
      await slide.save();
      return res.json({ message: 'Slide unliked', likesCount: slide.likes.length });
    } else {
      // User is liking the slide
      slide.likes.push(userId);
      await slide.save();
      return res.json({ message: 'Slide liked', likesCount: slide.likes.length });
    }
  } catch (error) {
    console.error('Error liking slide:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { likeSlide, getSlideById };
