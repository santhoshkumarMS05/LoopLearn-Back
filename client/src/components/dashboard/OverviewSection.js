// components/dashboard/OverviewSection.js
import React from 'react';
import './OverviewSection.css';

const OverviewSection = ({ stats }) => {
  return (
    <section className="overview-section">
      <div className="overview-grid">
        <div className="overview-card fresh">
          <div className="card-header">
            <span className="card-icon">✅</span>
            <h3>Fresh Skills</h3>
          </div>
          <div className="card-value">{stats.fresh}</div>
          <p className="card-description">Practiced within 7 days</p>
        </div>
        <div className="overview-card review">
          <div className="card-header">
            <span className="card-icon">⚠️</span>
            <h3>Needs Review</h3>
          </div>
          <div className="card-value">{stats.needsReview}</div>
          <p className="card-description">7-30 days since practice</p>
        </div>
        <div className="overview-card urgent">
          <div className="card-header">
            <span className="card-icon">🚨</span>
            <h3>Urgent Review</h3>
          </div>
          <div className="card-value">{stats.urgent}</div>
          <p className="card-description">Over 30 days inactive</p>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;