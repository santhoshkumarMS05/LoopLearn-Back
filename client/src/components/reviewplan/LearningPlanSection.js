// components/reviewplan/LearningPlanSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LearningPlanSection.css';

const LearningPlanSection = ({ reviewPlan, handleAskAI }) => {
  const navigate = useNavigate();

  return (
    <section className="review-section plan-section">
      <div className="section-header">
        <div className="header-left">
          <h2>📅 Your 7-Day Learning Plan</h2>
          <p>AI-generated study schedule based on your skill analysis</p>
        </div>
      </div>
      
      <div className="plan-content">
        {!reviewPlan || Object.keys(reviewPlan).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Review Plan Available</h3>
            <p>Complete some skill assessments to get your personalized study plan!</p>
            <button 
              className="cta-button"
              onClick={() => navigate('/skills')}
            >
              Assess Your Skills
            </button>
          </div>
        ) : (
          <div className="plan-timeline">
            {Object.entries(reviewPlan).map(([day, dayPlan]) => (
              <div key={day} className="day-plan-card">
                <div className="day-header">
                  <div className="day-info">
                    <h3>{day}</h3>
                    <span className="plan-date">
                      {new Date(dayPlan.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="day-summary">
                    <span className="total-time">{dayPlan.totalMinutes} min</span>
                    <span className="skill-count">{dayPlan.skills.length} skill{dayPlan.skills.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="day-skills">
                  {dayPlan.skills.length === 0 ? (
                    <div className="rest-day">
                      <span className="rest-icon">🎉</span>
                      <p>Rest day - You've earned it!</p>
                    </div>
                  ) : (
                    dayPlan.skills.map((skill, index) => (
                      <div key={index} className="plan-skill">
                        <div className="skill-details">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-category">{skill.category}</span>
                        </div>
                        <div className="skill-meta">
                          <span className="duration">{skill.suggestedMinutes} min</span>
                          <span className={`review-type ${skill.reviewType}`}>
                            {skill.reviewType === 'initial' ? '🎯 Focus' : '🔄 Review'}
                          </span>
                        </div>
                        <button 
                          className="study-btn"
                          onClick={() => handleAskAI({
                            name: skill.name,
                            category: skill.category,
                            _id: skill.skillId
                          })}
                        >
                          Study Now
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LearningPlanSection;