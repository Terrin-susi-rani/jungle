const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  starterCode: {
    type: String,
    required: true,
    default: '# Write your Python code here\nprint("Hello, World!")'
  },
  expectedOutput: {
    type: String,
    required: true
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    description: String
  }],
  hints: [String],
  points: {
    type: Number,
    default: 10
  },
  order: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for difficulty color
levelSchema.virtual('difficultyColor').get(function() {
  const colors = {
    beginner: 'text-green-500',
    intermediate: 'text-orange-500',
    advanced: 'text-red-500'
  };
  return colors[this.difficulty] || 'text-gray-500';
});

module.exports = mongoose.model('Level', levelSchema); 