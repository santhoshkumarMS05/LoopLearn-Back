// controllers/skillController.js
const Skill = require('../models/Skill');
const SkillLog = require('../models/SkillLog');
const User = require('../models/User');

// @desc    Get all user skills
// @route   GET /api/skills
// @access  Private
const getUserSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.userId });
    
    res.status(200).json({
      success: true,
      skills
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message
    });
  }
};

// @desc    Log practice session
// @route   POST /api/skills/log
// @access  Private
const logPracticeSession = async (req, res) => {
  try {
    const { skillName, category, date, timeSpent, confidence, notes } = req.body;

    // Find or create skill
    let skill = await Skill.findOne({ 
      userId: req.userId, 
      name: skillName 
    });

    if (!skill) {
      // Create new skill
      skill = await Skill.create({
        userId: req.userId,
        name: skillName,
        category,
        lastPracticed: date || Date.now(),
        totalTimeSpent: timeSpent,
        currentConfidence: confidence,
        practiceCount: 1
      });
    } else {
      // Update existing skill
      skill.lastPracticed = date || Date.now();
      skill.totalTimeSpent += timeSpent;
      skill.currentConfidence = confidence;
      skill.practiceCount += 1;
      await skill.save();
    }

    // Create skill log entry
    const skillLog = await SkillLog.create({
      userId: req.userId,
      skillId: skill._id,
      skillName,
      category,
      date: date || Date.now(),
      timeSpent,
      confidence,
      notes
    });

    // Update user stats
    const user = await User.findById(req.userId);
    user.totalHours = (user.totalHours || 0) + (timeSpent / 60);
    user.totalSkills = await Skill.countDocuments({ userId: req.userId });
    
    // Update streak using lastPracticeDate
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if user has practiced before
    if (user.lastPracticeDate) {
      const lastPractice = new Date(user.lastPracticeDate);
      lastPractice.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Same day, no change to streak
      } else if (daysDiff === 1) {
        // Next day, increment streak
        user.currentStreak = (user.currentStreak || 0) + 1;
        user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
      } else {
        // Streak broken (more than 1 day gap)
        user.currentStreak = 1;
      }
    } else {
      // First time practicing
      user.currentStreak = 1;
      user.longestStreak = 1;
    }
    
    // Update lastPracticeDate to today
    user.lastPracticeDate = new Date();
    user.lastActiveDate = new Date(); // Also update lastActiveDate
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Practice session logged successfully',
      skillLog,
      skill
    });
  } catch (error) {
    console.error('Log practice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging practice session',
      error: error.message
    });
  }
};

// @desc    Get practice history
// @route   GET /api/skills/history
// @access  Private
const getPracticeHistory = async (req, res) => {
  try {
    const { category, search, limit = 20, page = 1 } = req.query;
    
    let query = { userId: req.userId };
    
    // Add filters if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.skillName = { $regex: search, $options: 'i' };
    }
    
    const skillLogs = await SkillLog.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await SkillLog.countDocuments(query);

    res.status(200).json({
      success: true,
      history: skillLogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching practice history',
      error: error.message
    });
  }
};

// @desc    Get today's stats
// @route   GET /api/skills/today-stats
// @access  Private
const getTodayStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = await SkillLog.find({
      userId: req.userId,
      date: { $gte: today }
    });
    
    const sessionsToday = todayLogs.length;
    const minutesToday = todayLogs.reduce((sum, log) => sum + log.timeSpent, 0);
    const averageConfidence = sessionsToday > 0 
      ? todayLogs.reduce((sum, log) => sum + log.confidence, 0) / sessionsToday 
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        sessionsToday,
        minutesToday,
        averageConfidence: Math.round(averageConfidence * 10) / 10
      }
    });
  } catch (error) {
    console.error('Get today stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching today stats',
      error: error.message
    });
  }
};

// @desc    Update skill log
// @route   PUT /api/skills/log/:id
// @access  Private
const updateSkillLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeSpent, confidence, notes } = req.body;
    
    const skillLog = await SkillLog.findOne({
      _id: id,
      userId: req.userId
    });
    
    if (!skillLog) {
      return res.status(404).json({
        success: false,
        message: 'Skill log not found'
      });
    }
    
    // Update log
    if (timeSpent !== undefined) skillLog.timeSpent = timeSpent;
    if (confidence !== undefined) skillLog.confidence = confidence;
    if (notes !== undefined) skillLog.notes = notes;
    
    await skillLog.save();
    
    // Update skill's current confidence if changed
    if (confidence !== undefined) {
      const latestLog = await SkillLog.findOne({
        skillId: skillLog.skillId
      }).sort({ date: -1 });
      
      if (latestLog._id.toString() === id) {
        await Skill.findByIdAndUpdate(skillLog.skillId, {
          currentConfidence: confidence
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Skill log updated successfully',
      skillLog
    });
  } catch (error) {
    console.error('Update skill log error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating skill log',
      error: error.message
    });
  }
};

// @desc    Delete skill log
// @route   DELETE /api/skills/log/:id
// @access  Private
const deleteSkillLog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const skillLog = await SkillLog.findOne({
      _id: id,
      userId: req.userId
    });
    
    if (!skillLog) {
      return res.status(404).json({
        success: false,
        message: 'Skill log not found'
      });
    }
    
    // Delete the log
    await skillLog.deleteOne();
    
    // Update skill stats
    const remainingLogs = await SkillLog.find({
      skillId: skillLog.skillId
    }).sort({ date: -1 });
    
    if (remainingLogs.length > 0) {
      // Update skill with latest info
      const totalTime = remainingLogs.reduce((sum, log) => sum + log.timeSpent, 0);
      await Skill.findByIdAndUpdate(skillLog.skillId, {
        lastPracticed: remainingLogs[0].date,
        totalTimeSpent: totalTime,
        currentConfidence: remainingLogs[0].confidence,
        practiceCount: remainingLogs.length
      });
    } else {
      // No logs left, delete the skill
      await Skill.findByIdAndDelete(skillLog.skillId);
    }

    res.status(200).json({
      success: true,
      message: 'Skill log deleted successfully'
    });
  } catch (error) {
    console.error('Delete skill log error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting skill log',
      error: error.message
    });
  }
};

// @desc    Get all unique skill names (for autocomplete)
// @route   GET /api/skills/names
// @access  Private
const getSkillNames = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.userId }).select('name');
    const skillNames = skills.map(skill => skill.name);
    
    res.status(200).json({
      success: true,
      skills: skillNames
    });
  } catch (error) {
    console.error('Get skill names error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skill names',
      error: error.message
    });
  }
};

module.exports = {
  getUserSkills,
  logPracticeSession,
  getPracticeHistory,
  getTodayStats,
  updateSkillLog,
  deleteSkillLog,
  getSkillNames
};