// components/skilllogging/TodayStats.js
import React from 'react';
import './TodayStats.css';

const TodayStats = ({ todayStats }) => {
  return (
    <div className="today-stats">
      <div className="stat-box">
        <span className="stat-icon">📝</span>
        <div>
          <h3>{todayStats.sessionsToday}</h3>
          <p>Sessions Today</p>
        </div>
      </div>
      <div className="stat-box">
        <span className="stat-icon">⏱️</span>
        <div>
          <h3>{todayStats.minutesToday} min</h3>
          <p>Time Today</p>
        </div>
      </div>
      <div className="stat-box">
        <span className="stat-icon">📈</span>
        <div>
          <h3>{todayStats.averageConfidence}/10</h3>
          <p>Avg Confidence</p>
        </div>
      </div>
    </div>
  );
};

export default TodayStats;