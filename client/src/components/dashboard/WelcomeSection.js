// components/dashboard/WelcomeSection.js
import React from 'react';
import './WelcomeSection.css';

const WelcomeSection = ({ userName, userStats, stats }) => {
  return (
    <section className="welcome-section1">
      <div className="welcome-content1">
        <h1>Welcome back, {userName}! 👋</h1>
        <p>
          {userStats.currentStreak > 0 
            ? `You're on a ${userStats.currentStreak}-day learning streak! Keep it up!`
            : 'Start a new learning streak today!'}
        </p>
      </div>
      <div className="quick-stats">
        <div className="stat-card2">
          <span className="stat-icon">🔥</span>
          <div>
            <h3>{userStats.currentStreak}</h3>
            <p>Day Streak</p>
          </div>
        </div>
        <div className="stat-card2">
          <span className="stat-icon">⏱️</span>
          <div>
            <h3>{userStats.totalHours}h</h3>
            <p>Total Hours</p>
          </div>
        </div>
        <div className="stat-card2">
          <span className="stat-icon">📚</span>
          <div>
            <h3>{stats.total}</h3>
            <p>Skills Tracked</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;