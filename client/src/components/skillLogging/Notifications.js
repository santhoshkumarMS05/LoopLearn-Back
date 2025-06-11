// components/skilllogging/Notifications.js
import React from 'react';
import './Notifications.css';

const Notifications = ({ showSuccess, error }) => {
  if (!showSuccess && !error) return null;

  return (
    <div className="notifications-container">
      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          Great job! Your practice session has been logged.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default Notifications;