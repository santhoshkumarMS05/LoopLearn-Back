// hooks/useErrorHandler.js
import { useState, useCallback } from 'react';

const useErrorHandler = () => {
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);

  const showError = useCallback((message, duration = 3000) => {
    setError(message);
    setIsError(true);
    
    if (duration) {
      setTimeout(() => {
        setError('');
        setIsError(false);
      }, duration);
    }
  }, []);

  const clearError = useCallback(() => {
    setError('');
    setIsError(false);
  }, []);

  const handleError = useCallback((err) => {
    // If err is empty string, null, undefined, or falsy, clear the error
    if (!err) {
      clearError();
      return;
    }

    console.error('Error handled:', err);
    
    let errorMessage = 'An unexpected error occurred';
    
    // Handle different error types
    if (typeof err === 'string') {
      errorMessage = err;
    } else if (err.response) {
      // Server responded with error
      errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
    } else if (err.request) {
      // Request made but no response
      errorMessage = 'Network error. Please check your connection.';
    } else if (err.message) {
      // Something else happened
      errorMessage = err.message;
    }
    
    showError(errorMessage);
    
    // Throw error for Error Boundary to catch if it's critical
    if (err.critical) {
      throw err;
    }
  }, [showError, clearError]);

  return {
    error,
    isError,
    showError,
    clearError,
    handleError
  };
};

export default useErrorHandler;