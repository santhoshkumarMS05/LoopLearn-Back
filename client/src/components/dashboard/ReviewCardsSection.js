// components/dashboard/ReviewCardsSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewCardsSection.css';

const ReviewCardsSection = ({ urgentSkills, calculateDaysSince }) => {
  const navigate = useNavigate();

  if (urgentSkills.length === 0) {
    return null;
  }

  return (
    <section className="review-cards-section">
      <h2>🎯 You should review...</h2>
      <div className="review-cards">
        {urgentSkills.map(skill => {
          const daysSince = calculateDaysSince(skill.lastPracticed);
          return (
            <div key={skill._id} className="review-card">
              <div className="review-card-header">
                <h3>{skill.name}</h3>
                <span className="days-badge">{daysSince} days</span>
              </div>
              <p className="review-card-text">
                Last practiced: {new Date(skill.lastPracticed).toLocaleDateString()}
              </p>
              <div className="review-card-footer">
                <span className="confidence-indicator">
                  Confidence: {skill.currentConfidence}/10
                </span>
                <button 
                  className="review-btn"
                  onClick={() => navigate('/skills')}
                >
                  Start Review
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ReviewCardsSection;