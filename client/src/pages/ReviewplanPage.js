// ReviewPlanPage.js (Updated with Notes Section)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewPlanPage.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { reviewService } from '../services/api';

// Import Component Sections
import PageHeader from '../components/skillLogging/PageHeader';
import LoadingComponent from '../components/reviewplan/LoadingComponent';
import SkillOverviewSection from '../components/reviewplan/SkillOverviewSection';
import LearningPlanSection from '../components/reviewplan/LearningPlanSection';
import AIAssistantSection from '../components/reviewplan/AIAssistantSection';
import NotesSection from '../components/reviewplan/NotesSection';

// Import Notes Utilities
import { 
  downloadNotesAsPDF, 
  saveNotesToStorage, 
  loadNotesFromStorage 
} from '../utils/notesUtils';

const ReviewPlanPage = () => {
  const navigate = useNavigate();
  
  // Existing state
  const [weakSkills, setWeakSkills] = useState([]);
  const [reviewPlan, setReviewPlan] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Notes state
  const [userNotes, setUserNotes] = useState([]);
  const [notesError, setNotesError] = useState('');
  const [notesSuccess, setNotesSuccess] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchReviewData();
    loadUserNotes();
  }, []);

  const fetchReviewData = async () => {
    try {
      const [weakSkillsData, planData, chartData] = await Promise.all([
        reviewService.getWeakSkills(),
        reviewService.generatePlan(),
        reviewService.getChartData()
      ]);

      setWeakSkills(weakSkillsData.weakSkills || []);
      setReviewPlan(planData.plan || null);
      setChartData(chartData.chartData || []);
    } catch (error) {
      console.error('Error fetching review data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user notes from localStorage
  const loadUserNotes = () => {
    const notes = loadNotesFromStorage();
    setUserNotes(notes);
  };

  // Handle AI navigation with skill context
  const handleAskAI = (skill = null) => {
    if (skill) {
      // Navigate to AI page with skill context
      navigate('/ai-assistant', { 
        state: { 
          selectedSkill: skill,
          context: `reviewing-${skill.name || skill._id}` 
        } 
      });
    } else {
      // Navigate to general AI page
      navigate('/ai-assistant');
    }
  };

  // Handle notes save
  const handleSaveNotes = (notes) => {
    const result = saveNotesToStorage(notes);
    if (result.success) {
      setUserNotes(notes);
      setNotesSuccess('Notes saved successfully!');
      setTimeout(() => setNotesSuccess(''), 3000);
    } else {
      setNotesError(result.message || 'Failed to save notes');
      setTimeout(() => setNotesError(''), 3000);
    }
  };

  // Handle notes download
  const handleDownloadNotes = async (notes, filename) => {
  // Change .docx to .pdf in filename
  const pdfFilename = filename.replace('.docx', '.pdf');
  const result = downloadNotesAsPDF(notes, pdfFilename);  // ← Changed function name
  
  if (result.success) {
    setNotesSuccess(result.message);
    setTimeout(() => setNotesSuccess(''), 3000);
  } else {
    setNotesError(result.message);
    setTimeout(() => setNotesError(''), 3000);
  }
};

  // Get color based on confidence
  const getConfidenceColor = (confidence) => {
    if (confidence >= 7) return '#4CAF50';
    if (confidence >= 4) return '#FFC107';
    return '#F44336';
  };

  
  if (isLoading) {
    return (
      <div className="review-container">
        <Header />
        <LoadingComponent message="Loading your learning insights..." />
        <Footer />
      </div>
    );
  }

  return (
    <div className="review-container">
      <Header />
      
      {/* Hero Header */}
      <PageHeader 
        title="📚 Review & Master Your Skills"
        subtitle="Track your progress, follow personalized plans, and learn with AI assistance"
      />

      <main className="review-main">
        {/* Success/Error Messages for Notes */}
        {notesSuccess && (
          <div className="alert success-alert">
            <span>✅ {notesSuccess}</span>
          </div>
        )}
        {notesError && (
          <div className="alert error-alert">
            <span>❌ {notesError}</span>
          </div>
        )}

        {/* Section 1: Skill Confidence Overview */}
        <SkillOverviewSection 
          chartData={chartData}
          weakSkills={weakSkills}
          handleAskAI={handleAskAI}
          getConfidenceColor={getConfidenceColor}
        />

        {/* Section 2: 7-Day Personalized Plan */}
        <LearningPlanSection 
          reviewPlan={reviewPlan}
          handleAskAI={handleAskAI}
        />

        {/* Section 3: Learning Notes */}
        <NotesSection 
          userNotes={userNotes}
          onSaveNotes={handleSaveNotes}
          onDownloadNotes={handleDownloadNotes}
        />

        {/* Section 4: AI Learning Assistant */}
        <AIAssistantSection 
          handleAskAI={handleAskAI}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default ReviewPlanPage;