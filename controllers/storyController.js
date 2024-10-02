// backend/controllers/storyController.js
const Story = require('../models/storyModel');
const User = require('../models/userModel'); // Ensure this model exists
const Slide = require('../models/slideModel'); // Import Slide model

const createStory = async (req, res) => {
  try {
    console.log('User creating the story:', req.user); // Log user info

    const { title, slides, category } = req.body;

    // Validation
    if (!title || !slides || slides.length < 3 || slides.length > 6) {
      return res.status(400).json({ message: 'Invalid story data' });
    }

    // Create slides with the required contentType
    const slideDocuments = await Promise.all(
      slides.map(async (slide) => {
        const newSlide = await Slide.create({
          contentUrl: slide.contentUrl,
          caption: slide.caption,
          contentType: slide.contentType, // Ensure contentType is saved
          createdBy: req.user.id, 
        });
        return newSlide._id;
      })
    );

    // Now create the story with the created slides' IDs
    const story = await Story.create({
      title,
      slides: slideDocuments,
      category,
      createdBy: req.user.id,
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Edit an existing story
// Edit an existing story
const editStory = async (req, res) => {
  try {
    const { id } = req.params; // Story ID
    const { title, slides, category } = req.body; // Data from request body


    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Find the story by ID
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    console.log('Story found:', story);
    console.log('Created By:', story.createdBy);

    // Update slides if provided
    if (slides && slides.length) {
      const updatedSlides = await Promise.all(
        slides.map(async (slide) => {
          if (slide._id) {
            // Update existing slide
            const existingSlide = await Slide.findById(slide._id);
            if (existingSlide) {
              existingSlide.contentUrl = slide.contentUrl || existingSlide.contentUrl;
              existingSlide.caption = slide.caption || existingSlide.caption;
              existingSlide.contentType = slide.contentType || existingSlide.contentType; // Update contentType
              await existingSlide.save();
              return existingSlide._id;
            } else {
              console.error(`Slide with ID ${slide._id} not found`);
              return null; // Handle case where the slide doesn't exist
            }
          } else {
            // Create a new slide if no _id is provided
            const newSlide = await Slide.create({
              contentUrl: slide.contentUrl,
              caption: slide.caption,
              contentType: slide.contentType, // Make sure to include contentType
            });
            return newSlide._id;
          }
        })
      );

      // Filter out null values in case of missing slides
      story.slides = updatedSlides.filter((slideId) => slideId !== null);
    }

    // Update other fields if provided
    story.title = title || story.title;
    story.category = category || story.category;

    // Save the updated story
    const updatedStory = await story.save();
    res.json(updatedStory);
  } catch (error) {
    console.error('Error editing story:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// Bookmark a story
const bookmarkStory = async (req, res) => {
  console.log('Request User:', req.user); // Log the user object

  try {
    const { id } = req.params; // This is the story ID
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    console.log('User ID from token:', req.user.id); // Debug: Check user ID
    const user = await User.findById(req.user.id); // Correctly fetching user by token's user ID
    console.log('Fetched User:', user); // Debug: Check fetched user

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Proceed to bookmark the story
    if (!user.bookmarks.includes(id)) {
      user.bookmarks.push(id);
      await user.save();
    }

    res.json({ message: 'Story bookmarked' });
  } catch (error) {
    console.error('Error bookmarking story:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Get all stories
const getStories = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const stories = await Story.find(query).populate('createdBy', 'name'); // Ensure `createdBy` is populated

    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get a story by ID
const getStoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const story = await Story.findById(id).populate('createdBy').populate('slides');
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    console.error('Error populating story with slides:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
  
};


module.exports = {
  createStory,
  editStory,
  bookmarkStory,
  getStories,
  getStoryById,
};
