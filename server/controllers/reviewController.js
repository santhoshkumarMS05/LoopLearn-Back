// controllers/reviewController.js
const Skill = require('../models/Skill');
const SkillLog = require('../models/SkillLog');

// @desc    Get weak skills for review
// @route   GET /api/review/weak-skills
// @access  Private
const getWeakSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.userId });
    
    // Calculate weakness score for each skill
    const weakSkills = skills.map(skill => {
      const daysSincePractice = Math.floor((new Date() - new Date(skill.lastPracticed)) / (1000 * 60 * 60 * 24));
      
      // Calculate weakness score (higher = weaker)
      let weaknessScore = 0;
      
      // Factor 1: Low confidence
      weaknessScore += (10 - skill.currentConfidence) * 2;
      
      // Factor 2: Days since practice
      if (daysSincePractice > 30) {
        weaknessScore += 20;
      } else if (daysSincePractice > 14) {
        weaknessScore += 10;
      } else if (daysSincePractice > 7) {
        weaknessScore += 5;
      }
      
      return {
        _id: skill._id,
        name: skill.name,
        category: skill.category,
        currentConfidence: skill.currentConfidence,
        lastPracticed: skill.lastPracticed,
        daysSincePractice,
        weaknessScore,
        totalTimeSpent: skill.totalTimeSpent,
        practiceCount: skill.practiceCount
      };
    });
    
    // Sort by weakness score (highest first) and take top skills
    const sortedWeakSkills = weakSkills
      .filter(skill => skill.weaknessScore > 5) // Only show skills that need review
      .sort((a, b) => b.weaknessScore - a.weaknessScore);
    
    res.status(200).json({
      success: true,
      weakSkills: sortedWeakSkills
    });
  } catch (error) {
    console.error('Get weak skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weak skills',
      error: error.message
    });
  }
};

// @desc    Generate 7-day review plan
// @route   GET /api/review/generate-plan
// @access  Private
const generateReviewPlan = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.userId });
    
    // Get weak skills
    const weakSkills = skills
      .map(skill => {
        const daysSincePractice = Math.floor((new Date() - new Date(skill.lastPracticed)) / (1000 * 60 * 60 * 24));
        const weaknessScore = (10 - skill.currentConfidence) * 2 + (daysSincePractice > 30 ? 20 : daysSincePractice > 14 ? 10 : daysSincePractice > 7 ? 5 : 0);
        
        return { ...skill.toObject(), daysSincePractice, weaknessScore };
      })
      .filter(skill => skill.weaknessScore > 5)
      .sort((a, b) => b.weaknessScore - a.weaknessScore)
      .slice(0, 7); // Take top 7 weak skills
    
    // Generate 7-day plan with spaced repetition
    const plan = {};
    const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    
    days.forEach((day, index) => {
      plan[day] = {
        date: new Date(Date.now() + index * 24 * 60 * 60 * 1000),
        skills: [],
        totalMinutes: 0
      };
    });
    
    // Distribute skills across days with spaced repetition
    weakSkills.forEach((skill, index) => {
      // First review
      const day1Index = index % 3; // Spread across first 3 days
      plan[days[day1Index]].skills.push({
        skillId: skill._id,
        name: skill.name,
        category: skill.category,
        confidence: skill.currentConfidence,
        suggestedMinutes: skill.currentConfidence < 5 ? 45 : 30,
        reviewType: 'initial'
      });
      plan[days[day1Index]].totalMinutes += skill.currentConfidence < 5 ? 45 : 30;
      
      // Second review (spaced repetition - 3 days later)
      const day2Index = day1Index + 3;
      if (day2Index < 7) {
        plan[days[day2Index]].skills.push({
          skillId: skill._id,
          name: skill.name,
          category: skill.category,
          confidence: skill.currentConfidence,
          suggestedMinutes: 20,
          reviewType: 'reinforcement'
        });
        plan[days[day2Index]].totalMinutes += 20;
      }
    });
    
    res.status(200).json({
      success: true,
      plan,
      totalSkills: weakSkills.length
    });
  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating review plan',
      error: error.message
    });
  }
};

// @desc    Get skill confidence chart data
// @route   GET /api/review/chart-data
// @access  Private
const getChartData = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.userId })
      .sort({ currentConfidence: 1 }) // Sort by confidence (lowest first)
      .limit(10); // Show top 10 skills that need work
    
    const chartData = skills.map(skill => ({
      name: skill.name,
      confidence: skill.currentConfidence,
      category: skill.category,
      lastPracticed: skill.lastPracticed
    }));
    
    res.status(200).json({
      success: true,
      chartData
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chart data',
      error: error.message
    });
  }
};

module.exports = {
  getWeakSkills,
  generateReviewPlan,
  getChartData
};