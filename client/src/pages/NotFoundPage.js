// NotFoundPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">
          <span className="four">4</span>
          <span className="zero-icon">🔄</span>
          <span className="four">4</span>
        </div>
        
        <h1 className="error-title">Oops! Page Not Found</h1>
        <p className="error-message">
          Looks like you've taken a wrong turn in your learning journey.
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="error-illustration">
          <div className="floating-icons">
            <span className="float-icon icon-1">⚛️</span>
            <span className="float-icon icon-2">🟨</span>
            <span className="float-icon icon-3">🗄️</span>
            <span className="float-icon icon-4">🚀</span>
            <span className="float-icon icon-5">📊</span>
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="primary-btn"
            onClick={() => navigate('/dashboard')}
          >
            <span className="btn-icon">🏠</span>
            Go to Dashboard
          </button>
          <button 
            className="secondary-btn"
            onClick={() => navigate(-1)}
          >
            <span className="btn-icon">←</span>
            Go Back
          </button>
        </div>
        
        <div className="helpful-links">
          <p>Here are some helpful links:</p>
          <div className="link-grid">
            <a href="/dashboard" className="help-link">
              <span className="link-icon">📊</span>
              Dashboard
            </a>
            <a href="/skills" className="help-link">
              <span className="link-icon">📝</span>
              Log Skills
            </a>
            <a href="/profile" className="help-link">
              <span className="link-icon">👤</span>
              Profile
            </a>
            <a href="/" className="help-link">
              <span className="link-icon">🏠</span>
              Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;