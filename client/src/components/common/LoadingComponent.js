// LoadingComponents.js
import React from 'react';
import './LoadingComponent.css';

// Full Page Loading Spinner
export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-content">
        <div className="spinner-logo">
          <span className="spinner-icon">🔄</span>
        </div>
        <h2>Loading your learning journey...</h2>
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

// Dashboard Skeleton
export const DashboardSkeleton = () => {
  return (
    <div className="skeleton-container">
      {/* Header Skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-logo"></div>
        <div className="skeleton-nav">
          <div className="skeleton-nav-item"></div>
          <div className="skeleton-nav-item"></div>
          <div className="skeleton-nav-item"></div>
        </div>
        <div className="skeleton-avatar"></div>
      </div>

      {/* Welcome Section Skeleton */}
      <div className="skeleton-welcome">
        <div className="skeleton-text-large"></div>
        <div className="skeleton-text-medium"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="skeleton-stats">
        <div className="skeleton-stat-card"></div>
        <div className="skeleton-stat-card"></div>
        <div className="skeleton-stat-card"></div>
      </div>

      {/* Table Skeleton */}
      <div className="skeleton-table">
        <div className="skeleton-table-header"></div>
        <div className="skeleton-table-row"></div>
        <div className="skeleton-table-row"></div>
        <div className="skeleton-table-row"></div>
      </div>
    </div>
  );
};

// Skill Card Skeleton
export const SkillCardSkeleton = () => {
  return (
    <div className="skill-card-skeleton">
      <div className="skeleton-card-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-badge"></div>
      </div>
      <div className="skeleton-card-content">
        <div className="skeleton-text-small"></div>
        <div className="skeleton-text-small"></div>
      </div>
      <div className="skeleton-card-footer">
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = () => {
  return (
    <tr className="skeleton-row">
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-button-small"></div></td>
    </tr>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="profile-skeleton">
      <div className="skeleton-profile-header">
        <div className="skeleton-avatar-large"></div>
        <div className="skeleton-profile-info">
          <div className="skeleton-text-large"></div>
          <div className="skeleton-text-medium"></div>
          <div className="skeleton-text-small"></div>
        </div>
      </div>
      <div className="skeleton-profile-grid">
        <div className="skeleton-section">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-form-field"></div>
          <div className="skeleton-form-field"></div>
          <div className="skeleton-form-field"></div>
        </div>
        <div className="skeleton-section">
          <div className="skeleton-section-title"></div>
          <div className="skeleton-stats-grid">
            <div className="skeleton-stat-box"></div>
            <div className="skeleton-stat-box"></div>
            <div className="skeleton-stat-box"></div>
            <div className="skeleton-stat-box"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inline Loading Spinner (small)
export const InlineLoader = () => {
  return (
    <div className="inline-loader">
      <div className="inline-spinner"></div>
    </div>
  );
};

// Button Loading State
export const ButtonLoader = ({ text = 'Loading' }) => {
  return (
    <span className="button-loader">
      <span className="button-spinner"></span>
      {text}...
    </span>
  );
};

// Progress Bar Loader
export const ProgressLoader = ({ progress = 0 }) => {
  return (
    <div className="progress-loader">
      <div className="progress-bar" style={{ width: `${progress}%` }}>
        <span className="progress-text">{progress}%</span>
      </div>
    </div>
  );
};

// Content Placeholder
export const ContentPlaceholder = ({ lines = 3 }) => {
  return (
    <div className="content-placeholder">
      {[...Array(lines)].map((_, index) => (
        <div 
          key={index} 
          className="placeholder-line"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        ></div>
      ))}
    </div>
  );
};