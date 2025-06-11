// components/common/ErrorToast.js
import React from 'react';
import './ErrorToast.css';

const ErrorToast = ({ message, type = 'error', onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  const getClassName = () => {
    return `error-toast ${type}-toast`;
  };

  return (
    <div className={getClassName()}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      {onClose && (
        <button className="toast-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorToast;