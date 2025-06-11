// SkillLoggingPage.js (Refactored)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SkillLoggingPage.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import useErrorHandler from '../hooks/useErrorHandler';
import ErrorToast from '../components/common/ErrorToast';
import { skillService } from '../services/api';

// Import Component Sections
import PageHeader from '../components/skillLogging/PageHeader';
import Notifications from '../components/skillLogging/Notifications';
import TodayStats from '../components/skillLogging/TodayStats';
import LogFormSection from '../components/skillLogging/LogFormSection';
import HistorySection from '../components/skillLogging/HistorySection';

const SkillLoggingPage = () => {
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler();
  
  // Form state
  const [formData, setFormData] = useState({
    skillName: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    timeSpent: '',
    confidence: 5,
    notes: ''
  });

  // Data from backend
  const [existingSkills, setExistingSkills] = useState([]);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [todayStats, setTodayStats] = useState({
    sessionsToday: 0,
    minutesToday: 0,
    averageConfidence: 0
  });

  // Categories
  const categories = ['Frontend', 'Backend', 'Database', 'DSA', 'DevOps', 'Other'];

  // Loading and UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Filter states
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchSkillNames(),
        fetchPracticeHistory(),
        fetchTodayStats()
      ]);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch existing skill names for autocomplete
  const fetchSkillNames = async () => {
    try {
      const data = await skillService.getSkillNames();
      if (data.success) {
        setExistingSkills(data.skills);
      }
    } catch (err) {
      console.error('Error fetching skill names:', err);
    }
  };

  // Fetch practice history
  const fetchPracticeHistory = async () => {
    try {
      const params = {};
      if (filterCategory && filterCategory !== 'all') {
        params.category = filterCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const data = await skillService.getPracticeHistory(params);
      if (data.success) {
        setPracticeHistory(data.history);
      }
    } catch (err) {
      handleError('Error fetching practice history:', err);
    }
  };

  // Fetch today's stats
  const fetchTodayStats = async () => {
    try {
      const data = await skillService.getTodayStats();
      if (data.success) {
        setTodayStats(data.stats);
      }
    } catch (err) {
      handleError('Error fetching today stats:', err);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle confidence change
  const handleConfidenceChange = (value) => {
    setFormData({
      ...formData,
      confidence: value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    handleError('');
    
    try {
      // If editing, update instead of create
      if (editingId) {
        const data = await skillService.updateLog(editingId, {
          timeSpent: parseInt(formData.timeSpent),
          confidence: formData.confidence,
          notes: formData.notes
        });
        
        if (data.success) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          setEditingId(null);
        } else {
          handleError('');
        }
      } else {
        // Create new log
        const data = await skillService.logPractice({
          ...formData,
          timeSpent: parseInt(formData.timeSpent)
        });
        
        if (data.success) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
         handleError('');
        }
      }
      
      // Reset form
      setFormData({
        skillName: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        timeSpent: '',
        confidence: 5,
        notes: ''
      });
      
      // Refresh data
      await Promise.all([
        fetchSkillNames(),
        fetchPracticeHistory(),
        fetchTodayStats()
      ]);
      
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (entry) => {
    // Fill the form with the entry data
    setFormData({
      skillName: entry.skillName,
      category: entry.category,
      date: new Date(entry.date).toISOString().split('T')[0],
      timeSpent: entry.timeSpent.toString(),
      confidence: entry.confidence,
      notes: entry.notes || ''
    });
    
    // Set editing mode
    setEditingId(entry._id);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this practice session?')) {
      try {
        const data = await skillService.deleteLog(id);
        
        if (data.success) {
          // Refresh data
          await Promise.all([
            fetchPracticeHistory(),
            fetchTodayStats(),
            fetchSkillNames()
          ]);
        } else {
          handleError('');
        }
      } catch (err) {
        console.error('Delete error:', err);
        handleError(err);
      }
    }
  };

  // Apply filters when they change
  useEffect(() => {
    if (!isLoading) {
      fetchPracticeHistory();
    }
  }, [filterCategory, searchTerm]);

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 8) return '#4CAF50';
    if (confidence >= 5) return '#FFC107';
    return '#F44336';
  };

  if (isLoading) {
    return (
      <div className="skill-logging-container">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="skill-logging-container">
      <ErrorToast message={error} onClose={clearError} />
      <Header />
      
      {/* Main Content */}
      <main className="skill-logging-main">
        {/* Page Title */}
        <PageHeader 
          title="Log Your Practice Session"
          subtitle="Track your learning progress and build momentum"
        />

        {/* Success & Error Messages */}
        <Notifications 
          showSuccess={showSuccess}
          error={error}
        />

        {/* Today's Stats */}
        <TodayStats todayStats={todayStats} />

        {/* Main Grid */}
        <div className="logging-grid">
          {/* Log Form */}
          <LogFormSection 
            formData={formData}
            existingSkills={existingSkills}
            categories={categories}
            editingId={editingId}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handleConfidenceChange={handleConfidenceChange}
            handleSubmit={handleSubmit}
            setEditingId={setEditingId}
            setFormData={setFormData}
            getConfidenceColor={getConfidenceColor}
          />

          {/* History Section */}
          <HistorySection 
            practiceHistory={practiceHistory}
            categories={categories}
            filterCategory={filterCategory}
            searchTerm={searchTerm}
            editingId={editingId}
            setFilterCategory={setFilterCategory}
            setSearchTerm={setSearchTerm}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            getConfidenceColor={getConfidenceColor}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SkillLoggingPage;