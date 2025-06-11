// components/reviewplan/SkillOverviewSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SkillOverviewSection.css';

const SkillOverviewSection = ({ chartData, weakSkills, handleAskAI, getConfidenceColor }) => {
  const navigate = useNavigate();

  return (
    <section className="review-section overview-section">
      <div className="section-header">
        <div className="header-left">
          <h2>📊 Skill Confidence Overview</h2>
          <p>Visual representation of your current skill levels</p>
        </div>
      </div>
      
      <div className="overview-content">
        {chartData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📈</div>
            <h3>No Skills Tracked Yet</h3>
            <p>Start logging your practice sessions to see your progress here!</p>
            <button 
              className="cta-button"
              onClick={() => navigate('/log-practice')}
            >
              Log Your First Session
            </button>
          </div>
        ) : (
          <>
            {/* Weak Skills Alert */}
            {weakSkills.length > 0 && (
              <div className="weak-skills-alert">
                <div className="alert-header">
                  <span className="alert-icon">⚠️</span>
                  <h3>Skills Needing Immediate Attention</h3>
                  <p>{weakSkills.length} skill{weakSkills.length > 1 ? 's' : ''} require review</p>
                </div>
                <div className="weak-skills-grid">
                  {weakSkills.map(skill => (
                    <div key={skill._id} className="weak-skill-card">
                      <div className="skill-header">
                        <h4>{skill.name}</h4>
                        <span className="category-badge">{skill.category}</span>
                      </div>
                      <div className="skill-stats">
                        <div className="stat-row">
                          <span className="stat-label">Confidence:</span>
                          <span 
                            className="stat-value confidence" 
                            style={{ color: getConfidenceColor(skill.currentConfidence) }}
                          >
                            {skill.currentConfidence}/10
                          </span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Last practiced:</span>
                          <span className="stat-value">{skill.daysSincePractice} days ago</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Practice sessions:</span>
                          <span className="stat-value">{skill.practiceCount || 0}</span>
                        </div>
                      </div>
                      <button 
                        className="review-btn"
                        onClick={() => handleAskAI(skill)}
                      >
                        🎯 Review with AI
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SkillOverviewSection;