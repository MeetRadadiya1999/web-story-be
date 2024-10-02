const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['food', 'health and fitness', 'travel', 'movie', 'education'],
      required: true,
    },
    slides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slide',
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Story', storySchema);
