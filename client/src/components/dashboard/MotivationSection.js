// components/dashboard/MotivationSection.js
import React from 'react';
import './MotivationSection.css';

const MotivationSection = ({ stats }) => {
  return (
    <section className="motivation-section">
      <div className="motivation-card">
        <h3>💪 Keep Going!</h3>
        <p>"The expert in anything was once a beginner who never gave up."</p>
        <div className="progress-ring">
          <svg width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#e0e0e0"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#4CAF50"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - (stats.total > 0 ? stats.fresh / stats.total : 0))}`}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="progress-text1">
            <span className="progress-value1">
              {stats.total > 0 ? Math.round((stats.fresh / stats.total) * 100) : 0}%
            </span>
            <span className="progress-label1">Skills Fresh</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MotivationSection;