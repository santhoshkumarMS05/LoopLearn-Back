// components/reviewplan/LoadingComponent.js
import React from 'react';
import './LoadingComponent.css';

const LoadingComponent = ({ message = "Loading your learning insights..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingComponent;