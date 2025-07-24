const express = require('express');
const Level = require('../models/Level');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all levels (students)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const levels = await Level.find({ isActive: true })
      .select('-testCases')
      .sort({ order: 1 });

    res.json({ levels });
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single level (students)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);
    
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    if (!level.isActive) {
      return res.status(404).json({ message: 'Level not available' });
    }

    res.json({ level });
  } catch (error) {
    console.error('Get level error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new level (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      starterCode,
      expectedOutput,
      testCases,
      hints,
      points,
      order
    } = req.body;

    // Validate required fields
    if (!title || !description || !expectedOutput) {
      return res.status(400).json({ message: 'Title, description, and expected output are required' });
    }

    const level = new Level({
      title,
      description,
      difficulty: difficulty || 'beginner',
      starterCode: starterCode || '# Write your Python code here\nprint("Hello, World!")',
      expectedOutput,
      testCases: testCases || [],
      hints: hints || [],
      points: points || 10,
      order: order || 1
    });

    await level.save();

    res.status(201).json({
      message: 'Level created successfully',
      level
    });
  } catch (error) {
    console.error('Create level error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update level (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      starterCode,
      expectedOutput,
      testCases,
      hints,
      points,
      order,
      isActive
    } = req.body;

    const level = await Level.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        difficulty,
        starterCode,
        expectedOutput,
        testCases,
        hints,
        points,
        order,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    res.json({
      message: 'Level updated successfully',
      level
    });
  } catch (error) {
    console.error('Update level error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete level (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const level = await Level.findByIdAndDelete(req.params.id);

    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    res.json({ message: 'Level deleted successfully' });
  } catch (error) {
    console.error('Delete level error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all levels with full details (admin only)
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const levels = await Level.find().sort({ order: 1 });
    res.json({ levels });
  } catch (error) {
    console.error('Get admin levels error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 