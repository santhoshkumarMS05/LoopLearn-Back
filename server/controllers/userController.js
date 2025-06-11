// controllers/userController.js
const User = require('../models/User');
const Skill = require('../models/Skill');
const SkillLog = require('../models/SkillLog');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { fullName, username, email, bio } = req.body;

    // Check if username or email already exists (if changed)
    const user = await User.findById(req.userId);
    
    if (username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { fullName, username, email, bio },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    const { dailyGoal, reminderTime, emailNotifications, pushNotifications, weeklyReport } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        'preferences.dailyGoal': dailyGoal,
        'preferences.reminderTime': reminderTime,
        'preferences.emailNotifications': emailNotifications,
        'preferences.pushNotifications': pushNotifications,
        'preferences.weeklyReport': weeklyReport
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Import required models at the top of the file if not already imported
    const Skill = require('../models/Skill');
    const SkillLog = require('../models/SkillLog');
    
    // Calculate completed sessions (total number of skill logs)
    const completedSessions = await SkillLog.countDocuments({ userId: req.userId });
    
    // Calculate average confidence from all user's skills
    const skills = await Skill.find({ userId: req.userId });
    let averageConfidence = 0;
    
    if (skills.length > 0) {
      const totalConfidence = skills.reduce((sum, skill) => sum + skill.currentConfidence, 0);
      averageConfidence = totalConfidence / skills.length;
    }
    
    const stats = {
      totalSkills: user.totalSkills || 0,
      totalHours: Math.round(user.totalHours || 0), // Round to whole number
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      completedSessions: completedSessions,
      averageConfidence: Math.round(averageConfidence * 10) / 10 // Round to 1 decimal
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Reset user progress
// @route   DELETE /api/users/reset-progress
// @access  Private
const resetProgress = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      totalSkills: 0,
      totalHours: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: Date.now()
    });

    // TODO: Delete all user's skills and skill logs when we create those models

    res.status(200).json({
      success: true,
      message: 'Progress reset successfully'
    });
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting progress',
      error: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    
    // TODO: Delete all user's skills and skill logs when we create those models

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  getUserStats,
  resetProgress,
  deleteAccount
};