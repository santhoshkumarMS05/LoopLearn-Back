import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import DashboardPage from './pages/DashboardPage';
import SkillLoggingPage from './pages/SkillloggingPage';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';
import NotFoundPage from './pages/NotFoundPage';
import ReviewPlanPage from './pages/ReviewplanPage';
import AiAssistantPage from './pages/AiAssistantPage'; // Add this import

// Components
import { LoadingSpinner } from './components/common/LoadingComponent';
// import Header from './components/common/Header';
// import Footer from './components/common/Footer';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      // Check for token in localStorage
      const token = localStorage.getItem('token');
      if (token) {
        // Verify token with backend (implement this later)
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Loading screen while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
                <WelcomePage />
              
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
                <DashboardPage />

            } 
          /> 
          
          <Route 
            path="/skills" 
            element={
                <SkillLoggingPage />
              
            } 
          /> 
          
          <Route 
            path="/profile" 
            element={
                <ProfilePage />
             
            } 
          />
          
          <Route 
            path="/review" 
            element={
              isAuthenticated ? (
                <ReviewPlanPage />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* AI Assistant Route */}
          <Route 
            path="/ai-assistant" 
            element={
              isAuthenticated ? (
                <AiAssistantPage />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;