// DashboardPage.js (Refactored)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { skillService, userService } from '../services/api';

// Import Component Sections
import WelcomeSection from '../components/dashboard/WelcomeSection';
import ChartsSection from '../components/dashboard/ChartSection';
import OverviewSection from '../components/dashboard/OverviewSection';
import SkillsTableSection from '../components/dashboard/SkillsTableSection';
import ReviewCardsSection from '../components/dashboard/ReviewCardsSection';
import MotivationSection from '../components/dashboard/MotivationSection';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const navigate = useNavigate();
  
  // State for data from backend
  const [skills, setSkills] = useState([]);
  const [userStats, setUserStats] = useState({
    totalSkills: 0,
    totalHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    completedSessions: 0,
    averageConfidence: 0
  });
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [practiceHistory, setPracticeHistory] = useState([]);

  // Fetch all data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get user info from localStorage or fetch it
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUserName(storedUser.fullName || storedUser.username || 'User');

      await Promise.all([
        fetchUserSkills(),
        fetchUserStats(),
        fetchPracticeHistory()
      ]);
    } catch (err) {
      console.error('Dashboard data error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user skills
  const fetchUserSkills = async () => {
    try {
      const data = await skillService.getAllSkills();
      if (data.success) {
        setSkills(data.skills);
      }
    } catch (err) {
      console.error('Fetch skills error:', err);
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
      console.error('Fetch stats error:', err);
    }
  };

  // Fetch practice history for charts
  const fetchPracticeHistory = async () => {
    try {
      const data = await skillService.getPracticeHistory({ limit: 30 });
      if (data.success) {
        setPracticeHistory(data.history);
      }
    } catch (err) {
      console.error('Fetch practice history error:', err);
    }
  };

  // Calculate days since last practice
  const calculateDaysSince = (dateString) => {
    const practiceDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - practiceDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get decay status based on days
  const getDecayStatus = (days) => {
    if (days < 7) return { status: 'fresh', color: '#4CAF50', text: 'Fresh' };
    if (days <= 30) return { status: 'review', color: '#FFC107', text: 'Needs Review' };
    return { status: 'urgent', color: '#F44336', text: 'Urgent!' };
  };

  // Calculate skill statistics
  const getSkillStats = () => {
    const total = skills.length;
    const fresh = skills.filter(s => calculateDaysSince(s.lastPracticed) < 7).length;
    const needsReview = skills.filter(s => {
      const days = calculateDaysSince(s.lastPracticed);
      return days >= 7 && days <= 30;
    }).length;
    const urgent = skills.filter(s => calculateDaysSince(s.lastPracticed) > 30).length;
    
    return { total, fresh, needsReview, urgent };
  };

  // Get skills that need urgent review
  const getUrgentSkills = () => {
    return skills
      .filter(skill => calculateDaysSince(skill.lastPracticed) > 7 || skill.currentConfidence < 5)
      .sort((a, b) => {
        // Sort by combination of decay and low confidence
        const daysA = calculateDaysSince(a.lastPracticed);
        const daysB = calculateDaysSince(b.lastPracticed);
        const scoreA = daysA + (10 - a.currentConfidence) * 3; // Weight confidence more
        const scoreB = daysB + (10 - b.currentConfidence) * 3;
        return scoreB - scoreA;
      })
      .slice(0, 3);
  };

  // Prepare data for Skill Distribution Doughnut Chart
  const getSkillDistributionData = () => {
    const categories = skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#4CAF50',
          '#FFC107',
          '#FF6B6B',
          '#00BCD4'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  // Prepare data for Confidence Trend Line Chart
  const getConfidenceTrendData = () => {
    // Group practice sessions by date and calculate average confidence
    const last7Days = [];
    const confidenceByDay = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push(dateStr);
      confidenceByDay[dateStr] = [];
    }

    practiceHistory.forEach(log => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      if (confidenceByDay[logDate] !== undefined) {
        confidenceByDay[logDate].push(log.confidence);
      }
    });

    const avgConfidenceData = last7Days.map(date => {
      const confidences = confidenceByDay[date];
      return confidences.length > 0 
        ? confidences.reduce((a, b) => a + b) / confidences.length 
        : null;
    });

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en', { weekday: 'short' })),
      datasets: [{
        label: 'Average Confidence',
        data: avgConfidenceData,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8
      }]
    };
  };

  // Prepare data for Practice Time Bar Chart
  const getPracticeTimeData = () => {
    const last7Days = [];
    const timeByDay = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push(dateStr);
      timeByDay[dateStr] = 0;
    }

    practiceHistory.forEach(log => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      if (timeByDay[logDate] !== undefined) {
        timeByDay[logDate] += log.timeSpent;
      }
    });

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en', { weekday: 'short' })),
      datasets: [{
        label: 'Practice Time (minutes)',
        data: last7Days.map(date => timeByDay[date]),
        backgroundColor: 'rgba(118, 75, 162, 0.8)',
        borderColor: '#764ba2',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 40
      }]
    };
  };

  // Prepare data for Skill Decay Status
  const getDecayStatusData = () => {
    const stats = getSkillStats();
    return {
      labels: ['Fresh', 'Needs Review', 'Urgent'],
      datasets: [{
        data: [stats.fresh, stats.needsReview, stats.urgent],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderWidth: 0
      }]
    };
  };

  const stats = getSkillStats();
  const urgentSkills = getUrgentSkills();

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <WelcomeSection 
          userName={userName}
          userStats={userStats}
          stats={stats}
        />

        {/* Charts Section */}
        <ChartsSection 
          skills={skills}
          practiceHistory={practiceHistory}
          getConfidenceTrendData={getConfidenceTrendData}
          getPracticeTimeData={getPracticeTimeData}
          getSkillDistributionData={getSkillDistributionData}
          getDecayStatusData={getDecayStatusData}
        />

        {/* Overview Cards */}
        <OverviewSection stats={stats} />

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* Skills Table */}
          <SkillsTableSection 
            skills={skills}
            calculateDaysSince={calculateDaysSince}
            getDecayStatus={getDecayStatus}
          />

          {/* Right Column */}
          <div className="dashboard-right">
            {/* Review Cards */}
            <ReviewCardsSection 
              urgentSkills={urgentSkills}
              calculateDaysSince={calculateDaysSince}
            />

            {/* Motivational Section */}
            <MotivationSection stats={stats} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;