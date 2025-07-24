const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  levelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  output: {
    type: String,
    default: ''
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  executionTime: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  testResults: [{
    testCase: String,
    passed: Boolean,
    expected: String,
    actual: String
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
submissionSchema.index({ userId: 1, levelId: 1 });
submissionSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema); 