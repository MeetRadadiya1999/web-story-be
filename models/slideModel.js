const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    contentUrl: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    caption: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slide', slideSchema);
