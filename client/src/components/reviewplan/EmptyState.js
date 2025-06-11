// components/reviewplan/EmptyState.js
import React from 'react';
import './EmptyState.css';

const EmptyState = ({ icon, title, description, buttonText, onButtonClick }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {buttonText && onButtonClick && (
        <button 
          className="cta-button"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;