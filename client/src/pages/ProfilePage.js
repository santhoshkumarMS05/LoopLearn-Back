// ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import useErrorHandler from '../hooks/useErrorHandler';
import ErrorToast from '../components/common/ErrorToast';
import { userService } from '../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler();
  
  // User data state
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    fullName: '',
    bio: '',
    joinDate: '',
    avatar: null
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userData);

  // Stats (from backend)
  const [userStats, setUserStats] = useState({
    totalSkills: 0,
    totalHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    completedSessions: 0,
    averageConfidence: 0
  });

  // Learning preferences
  const [preferences, setPreferences] = useState({
    dailyGoal: 30,
    reminderTime: '19:00',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const data = await userService.getProfile();
      
      if (data.success) {
        setUserData({
          username: data.user.username,
          email: data.user.email,
          fullName: data.user.fullName || data.user.username,
          bio: data.user.bio || '',
          joinDate: data.user.joinDate,
          avatar: data.user.avatar
        });
        setEditData({
          username: data.user.username,
          email: data.user.email,
          fullName: data.user.fullName || data.user.username,
          bio: data.user.bio || ''
        });
        setPreferences(data.user.preferences);
      } else {
        handleError('Failed to load profile');
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const data = await userService.getStats();
      
      if (data.success) {
        setUserStats(data.stats);
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  // Handle preference changes
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      const data = await userService.updateProfile(editData);
      
      if (data.success) {
        setUserData(editData);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Update localStorage if username changed
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          username: editData.username,
          fullName: editData.fullName
        }));
      } else {
        handleError(data.message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Save preferences
  const handleSavePreferences = async () => {
    try {
      const data = await userService.updatePreferences(preferences);
      
      if (data.success) {
        setSuccessMessage('Preferences saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        handleError('Failed to save preferences');
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  // Reset progress
  const handleResetProgress = async () => {
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      try {
        const data = await userService.resetProgress();
        
        if (data.success) {
          setSuccessMessage('Progress reset successfully!');
          fetchUserStats(); // Refresh stats
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } catch (err) {
        handleError(err);
      }
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.')) {
      try {
        const data = await userService.deleteAccount();
        
        if (data.success) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }
      } catch (err) {
        handleError(err);
      }
    }
  };

  // Achievement badges (calculated based on stats)
  const badges = [
    { 
      id: 1, 
      name: 'Early Bird', 
      icon: '🌅', 
      description: '7 day streak', 
      earned: userStats.currentStreak >= 7 || userStats.longestStreak >= 7 
    },
    { 
      id: 2, 
      name: 'Dedicated Learner', 
      icon: '📚', 
      description: '100 hours total', 
      earned: userStats.totalHours >= 100 
    },
    { 
      id: 3, 
      name: 'Skill Master', 
      icon: '🏆', 
      description: '10 skills at 8+ confidence', 
      earned: false // Will be calculated when we have skills data
    },
    { 
      id: 4, 
      name: 'Consistency King', 
      icon: '👑', 
      description: '30 day streak', 
      earned: userStats.longestStreak >= 30 
    }
  ];

  if (isLoading) {
    return (
      <div className="profile-container">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ErrorToast message={error} onClose={clearError} />
      <Header />
      <main className="profile-main">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="alert success-alert">
            <span>✅ {successMessage}</span>
          </div>
        )}
        {error && (
          <div className="alert error-alert">
            <span>❌ {error}</span>
          </div>
        )}

        {/* Profile Header */}
        <section className="profile-header-section">
          <div className="profile-header-bg"></div>
          <div className="profile-header-content">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                
                <span className="avatar-placeholder">{userData.fullName.charAt(0)}</span>
              
              </div>
              <div className="profile-info">
                <h1>{userData.fullName}</h1>
                <p className="username">@{userData.username}</p>
                <p className="member-since">Member since {new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <button 
              className="edit-profile-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </section>

        <div className="profile-grid">
          {/* Left Column - User Info & Preferences */}
          <div className="profile-left">
            {/* User Information */}
            <section className="profile-section">
              <h2>Profile Information</h2>
              {isEditing ? (
                <form className="edit-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editData.fullName}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      name="username"
                      value={editData.username}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={editData.bio}
                      onChange={handleEditChange}
                      className="form-textarea"
                      rows="3"
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="save-btn"
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="info-display">
                  <div className="info-item">
                    <label>Full Name</label>
                    <p>{userData.fullName}</p>
                  </div>
                  <div className="info-item">
                    <label>Username</label>
                    <p>@{userData.username}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{userData.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Bio</label>
                    <p>{userData.bio || 'No bio added yet'}</p>
                  </div>
                </div>
              )}
            </section>

            {/* Learning Preferences */}
            <section className="profile-section">
              <h2>Learning Preferences</h2>
              <div className="preferences-form">
                <div className="preference-item">
                  <label>Daily Goal (minutes)</label>
                  <input
                    type="number"
                    name="dailyGoal"
                    value={preferences.dailyGoal}
                    onChange={handlePreferenceChange}
                    className="preference-input"
                    min="10"
                    max="180"
                  />
                </div>
                <div className="preference-item">
                  <label>Reminder Time</label>
                  <input
                    type="time"
                    name="reminderTime"
                    value={preferences.reminderTime}
                    onChange={handlePreferenceChange}
                    className="preference-input"
                  />
                </div>
                <div className="preference-toggle">
                  <label>
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={preferences.emailNotifications}
                      onChange={handlePreferenceChange}
                    />
                    <span className="toggle-label">Email Notifications</span>
                  </label>
                </div>
                <div className="preference-toggle">
                  <label>
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={preferences.pushNotifications}
                      onChange={handlePreferenceChange}
                    />
                    <span className="toggle-label">Push Notifications</span>
                  </label>
                </div>
                <div className="preference-toggle">
                  <label>
                    <input
                      type="checkbox"
                      name="weeklyReport"
                      checked={preferences.weeklyReport}
                      onChange={handlePreferenceChange}
                    />
                    <span className="toggle-label">Weekly Progress Report</span>
                  </label>
                </div>
                <button 
                  className="save-preferences-btn"
                  onClick={handleSavePreferences}
                >
                  Save Preferences
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Stats & Achievements */}
          <div className="profile-right">
            {/* Learning Stats */}
            <section className="profile-section stats-section">
              <h2>Learning Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-icon">📚</span>
                  <div className="stat-info">
                    <h3>{userStats.totalSkills}</h3>
                    <p>Total Skills</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">⏱️</span>
                  <div className="stat-info">
                    <h3>{userStats.totalHours}h</h3>
                    <p>Total Hours</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🔥</span>
                  <div className="stat-info">
                    <h3>{userStats.currentStreak}</h3>
                    <p>Current Streak</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🏅</span>
                  <div className="stat-info">
                    <h3>{userStats.longestStreak}</h3>
                    <p>Longest Streak</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">✅</span>
                  <div className="stat-info">
                    <h3>{userStats.completedSessions}</h3>
                    <p>Sessions</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">💪</span>
                  <div className="stat-info">
                    <h3>{userStats.averageConfidence.toFixed(1)}</h3>
                    <p>Avg Confidence</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Achievement Badges */}
            <section className="profile-section badges-section">
              <h2>Achievement Badges</h2>
              <div className="badges-grid">
                {badges.map(badge => (
                  <div 
                    key={badge.id} 
                    className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}
                  >
                    <span className="badge-icon">{badge.icon}</span>
                    <h4>{badge.name}</h4>
                    <p>{badge.description}</p>
                    {!badge.earned && <div className="badge-lock">🔒</div>}
                  </div>
                ))}
              </div>
            </section>

            {/* Danger Zone */}
            <section className="profile-section danger-section">
              <h2>Account Settings</h2>
              <div className="danger-zone">
                <button 
                  className="danger-btn reset-progress"
                  onClick={handleResetProgress}
                >
                  <span className="danger-icon">🔄</span>
                  Reset All Progress
                </button>
                <button 
                  className="danger-btn delete-account"
                  onClick={handleDeleteAccount}
                >
                  <span className="danger-icon">🗑️</span>
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;