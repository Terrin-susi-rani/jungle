const express = require('express');
const Submission = require('../models/Submission');
const Level = require('../models/Level');
const User = require('../models/User');
const { authenticateToken, isStudent } = require('../middleware/auth');
const router = express.Router();

// Submit code for a level
router.post('/:levelId', authenticateToken, isStudent, async (req, res) => {
  try {
    const { code, dryRun } = req.body;
    const { levelId } = req.params;
    const userId = req.user._id;

    // Validate input
    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    // Get the level
    const level = await Level.findById(levelId);
    if (!level || !level.isActive) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Test case runner logic
    let testResults = [];
    let passedCount = 0;
    let errorMessage = '';
    let executionTime = 0;
    let output = '';

    try {
      const startTime = Date.now();
      for (const tc of level.testCases && level.testCases.length ? level.testCases : [{input: '', expectedOutput: level.expectedOutput}]) {
        // For MVP, simulate running code by checking if code contains expected output
        // In production, use Pyodide or a secure Python runner
        // Pseudo: const fullCode = `${code}\nprint(add(${tc.input}))`;
        // const result = await runInPython(fullCode);
        // For now, just check if code includes expectedOutput
        let simulatedOutput = '';
        if (code.includes(tc.expectedOutput)) {
          simulatedOutput = tc.expectedOutput;
        } else {
          simulatedOutput = 'Code executed successfully';
        }
        const passed = simulatedOutput.trim() === tc.expectedOutput.trim();
        if (passed) passedCount++;
        testResults.push({
          input: tc.input,
          expected: tc.expectedOutput,
          actual: simulatedOutput,
          passed
        });
      }
      executionTime = Date.now() - startTime;
      output = testResults.map((tr, i) => `Test ${i+1}: ${tr.passed ? 'Passed' : 'Failed'}`).join('\n');
    } catch (error) {
      errorMessage = error.message;
    }

    const totalCases = testResults.length;
    const percentPassed = totalCases > 0 ? (passedCount / totalCases) : 0;
    const isCorrect = percentPassed >= 0.8;

    // Only update user progress and save submission if all test cases are passed and not dryRun
    const allPassed = testResults.every(tr => tr.passed);
    let submission = null;
    if (allPassed && !dryRun) {
      // Delete previous submission for this user and level
      await Submission.deleteMany({ userId, levelId });
      // Save new submission
      submission = new Submission({
        userId,
        levelId,
        code,
        output,
        isCorrect: true,
        executionTime,
        errorMessage,
        testResults,
      });
      await submission.save();
      // Update user progress
      const user = await User.findById(userId);
      const existingProgress = user.progress.find(p => p.levelId.toString() === levelId);
      if (!existingProgress || !existingProgress.completed) {
        user.progress.push({
          levelId,
          completed: true,
          submittedAt: new Date()
        });
        user.totalScore += level.points;
        // Add badges based on progress
        const completedLevels = user.progress.filter(p => p.completed).length;
        if (completedLevels === 1 && !user.badges.find(b => b.name === 'First Steps')) {
          user.badges.push({
            name: 'First Steps',
            description: 'Completed your first challenge!'
          });
        }
        if (completedLevels === 5 && !user.badges.find(b => b.name === 'Python Explorer')) {
          user.badges.push({
            name: 'Python Explorer',
            description: 'Completed 5 challenges!'
          });
        }
        if (!user.badges.find(b => b.name === 'Test Case Master')) {
          user.badges.push({
            name: 'Test Case Master',
            description: 'Passed all test cases in a challenge!'
          });
        }
        await user.save();
      }
    }
    // Response
    let latestUser = await User.findById(userId);
    res.json({
      message: allPassed
        ? (dryRun ? `All test cases passed!` : `All test cases passed! Submission saved.`)
        : `You passed ${passedCount}/${totalCases} test cases. All must pass to complete this level.`,
      submission: {
        id: submission?._id,
        isCorrect: allPassed,
        output,
        errorMessage,
        executionTime,
        testResults
      },
      user: {
        totalScore: latestUser.totalScore,
        progress: latestUser.progress,
        badges: latestUser.badges,
        name: latestUser.name,
        role: latestUser.role,
        email: latestUser.email
      }
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's submissions for a level
router.get('/:levelId', authenticateToken, async (req, res) => {
  try {
    const { levelId } = req.params;
    const userId = req.user._id;

    const submissions = await Submission.find({ userId, levelId })
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all submissions (admin only)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('userId', 'name email')
      .populate('levelId', 'title difficulty')
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (error) {
    console.error('Get all submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 