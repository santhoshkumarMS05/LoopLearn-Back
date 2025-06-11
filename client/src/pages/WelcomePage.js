// WelcomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';
import useErrorHandler from '../hooks/useErrorHandler';
import ErrorToast from '../components/common/ErrorToast';
import { authService } from '../services/api';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Floating animation for skill icons
  useEffect(() => {
    const icons = document.querySelectorAll('.skill-icon');
    icons.forEach((icon, index) => {
      icon.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    clearError(); // Use clearError instead of handleError('')
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      handleError('Email and password are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.username) {
        handleError('Username is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        handleError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        handleError('Password must be at least 6 characters long');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing errors
    clearError();
    setSuccessMessage('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            username: formData.username,
            confirmPassword: formData.confirmPassword
          };

      const data = isLogin 
        ? await authService.login(body)
        : await authService.signup(body);

      // Check if the response indicates success
      if (data && (data.success || data.token)) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Show success message
        setSuccessMessage(isLogin ? 'Login successful!' : 'Account created successfully!');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard'; // Using window.location to trigger App.js auth check
        }, 1000);
      } else {
        // Handle API error response
        const errorMsg = data?.message || data?.error || 'Authentication failed';
        handleError(errorMsg);
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with an error
        const errorMsg = err.response.data?.message || 
                        err.response.data?.error || 
                        `Server error (${err.response.status})`;
        handleError(errorMsg);
      } else if (err.request) {
        // Network error
        handleError('Network error. Please check if the server is running.');
      } else {
        // Other errors
        handleError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when switching between login and signup
  const handleTabSwitch = (loginMode) => {
    setIsLogin(loginMode);
    setFormData({
      email: '',
      password: '',
      username: '',
      confirmPassword: ''
    });
    clearError(); // Use clearError instead of handleError('')
    setSuccessMessage('');
  };

  const skillIcons = [
    { icon: '⚛️', name: 'React', color: '#61DAFB' },
    { icon: '🟨', name: 'JavaScript', color: '#F7DF1E' },
    { icon: '🟩', name: 'Node.js', color: '#339933' },
    { icon: '🗄️', name: 'MongoDB', color: '#47A248' },
    { icon: '🎨', name: 'CSS', color: '#1572B6' },
    { icon: '📊', name: 'DSA', color: '#FF6B6B' },
    { icon: '🚀', name: 'Express', color: '#000000' },
    { icon: '🔧', name: 'Redux', color: '#764ABC' }
  ];

  const testimonials = [
    { text: "Helped me get back into coding after 6 months break!", author: "Sarah K." },
    { text: "The spaced repetition system is genius for skill retention.", author: "Mike D." }
  ];

  return (
    <div className="welcome-container">
      <ErrorToast message={error} onClose={clearError} />
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-circle circle-1"></div>
        <div className="gradient-circle circle-2"></div>
        <div className="gradient-circle circle-3"></div>
      </div>

      {/* Main Content Grid */}
      <div className="welcome-grid">
        {/* Left Side - Content */}
        <div className="content-section">
          {/* Floating Skill Icons */}
          <div className="skills-orbit">
            {skillIcons.map((skill, index) => (
              <div
                key={index}
                className="skill-icon"
                style={{
                  '--orbit-radius': `${120 + (index % 3) * 60}px`,
                  '--orbit-speed': `${20 + (index % 4) * 5}s`,
                  '--start-angle': `${(360 / skillIcons.length) * index}deg`
                }}
              >
                <span className="icon-emoji">{skill.icon}</span>
                <span className="icon-tooltip">{skill.name}</span>
              </div>
            ))}
          </div>

          {/* Brand and Content */}
          <div className="brand-content">
            <div className="logo-container">
              <div className="logo">
                <span className="logo-icon">🔄</span>
                <span className="logo-text">LoopBack Learn</span>
              </div>
            </div>

            <h1 className="main-title">
              <span className="gradient-text">Recover Your Skills,</span>
              <br />
              <span className="gradient-text-2">Rebuild Your Confidence</span>
            </h1>

            <p className="tagline">
              Jump back into development with personalized learning paths, 
              skill tracking, and smart insights to overcome the forgetting curve.
            </p>

            {/* Features List */}
            <div className="features-list">
              <div className="feature-item">
                <span className="check-icon">✅</span>
                <div>
                  <h4>Smart Skill Tracking</h4>
                  <p>Monitor your skill decay with visual indicators</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="check-icon">🎯</span>
                <div>
                  <h4>Personalized Review Plans</h4>
                  <p>AI-powered schedules based on your forgetting curve</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="check-icon">📈</span>
                <div>
                  <h4>Progress Analytics</h4>
                  <p>Track confidence levels and practice streaks</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="check-icon">🏆</span>
                <div>
                  <h4>Gamified Learning</h4>
                  <p>Earn achievements and maintain learning streaks</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-container">
              <div className="stat">
                <h3>10K+</h3>
                <p>Active Learners</p>
              </div>
              <div className="stat">
                <h3>95%</h3>
                <p>Skill Retention</p>
              </div>
              <div className="stat">
                <h3>30min</h3>
                <p>Daily Average</p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="testimonials">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial">
                  <p>"{testimonial.text}"</p>
                  <span>- {testimonial.author}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth */}
        <div className="auth-section">
          <div className="auth-card">
            <div className="auth-header">
              <h2>{isLogin ? 'Welcome Back!' : 'Start Your Journey'}</h2>
              <p>{isLogin ? 'Continue your learning journey' : 'Create an account to track your progress'}</p>
            </div>

            <div className="auth-tabs">
              <button 
                className={`tab-btn ${isLogin ? 'active' : ''}`}
                onClick={() => handleTabSwitch(true)}
              >
                Login
              </button>
              <button 
                className={`tab-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => handleTabSwitch(false)}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="success-message-auth">
                <span className="success-icon">✅</span>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="input-group">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required={!isLogin}
                    className="auth-input"
                    minLength="3"
                  />
                  <span className="input-icon">👤</span>
                </div>
              )}
              
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
                <span className="input-icon">✉️</span>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="auth-input"
                  minLength="6"
                />
                <span className="input-icon">🔒</span>
              </div>

              {!isLogin && (
                <div className="input-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    className="auth-input"
                    minLength="6"
                  />
                  <span className="input-icon">🔒</span>
                </div>
              )}

              <button 
                type="submit" 
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loader"></span>
                ) : (
                  isLogin ? 'Start Learning' : 'Create Account'
                )}
              </button>
            </form>

            {isLogin && (
              <div className="forgot-password">
                <a href="#forgot">Forgot password?</a>
              </div>
            )}

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-auth">
              <button className="social-btn google" disabled>
                <span>G</span> Google
              </button>
              <button className="social-btn github" disabled>
                <span>🐙</span> GitHub
              </button>
            </div>

            {isLogin && (
              <div className="signup-prompt">
                <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleTabSwitch(false); }}>Sign up</a></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;