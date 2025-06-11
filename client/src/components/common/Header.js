import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { userService } from '../../services/api'; // Adjust path as needed

const Header = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('User');
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeLink, setActiveLink] = useState('/dashboard');

  useEffect(() => {
    // Fetch user profile data
    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Update active link on route change
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const fetchUserProfile = async () => {
    try {
      const data = await userService.getProfile();
      if (data.success) {
        setUser(data.user);
        // Set display name priority: fullName > username > email
        const displayName = data.user.fullName || data.user.username || data.user.email;
        setUserName(displayName);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // Keep default username if fetch fails
    }
  };

  const handleNavigation = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  // Generate avatar initials
  const getAvatarInitials = () => {
    if (user?.fullName) {
      // If fullName exists, use first letter of first and last name
      const names = user.fullName.trim().split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    } else if (user?.username) {
      // If no fullName, use first letter of username
      return user.username.charAt(0).toUpperCase();
    } else if (user?.email) {
      // Fallback to first letter of email
      return user.email.charAt(0).toUpperCase();
    }
    return 'U'; // Ultimate fallback
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo" onClick={() => handleNavigation('/dashboard')}>
          <span className="header-logo-icon">🔄</span>
          <span className="header-logo-text">LoopBack Learn</span>
        </div>
        <nav className="nav-menu">
          <span
            className={`nav-link ${activeLink === '/dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('/dashboard')}
          >
            Dashboard
          </span>
          <span
            className={`nav-link ${activeLink === '/skills' ? 'active' : ''}`}
            onClick={() => handleNavigation('/skills')}
          >
            Skills
          </span>
          <span
            className={`nav-link ${activeLink === '/review' ? 'active' : ''}`}
            onClick={() => handleNavigation('/review')}
          >
            Review
          </span>
          <span
            className={`nav-link ${activeLink === '/profile' ? 'active' : ''}`}
            onClick={() => handleNavigation('/profile')}
          >
            Profile
          </span>
        </nav>
        <div className="user-info">
          <span className="notification-icon">🔔</span>
          <div className="user-avatar" title={userName}>
            {user?.avatar ? (
              <img src={user.avatar} alt={userName} className="avatar-image" />
            ) : (
              <span>{getAvatarInitials()}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;