// components/reviewplan/AIAssistantSection.js
import React from 'react';
import './AIAssistantSection.css';

const AIAssistantSection = ({ handleAskAI }) => {
  return (
    <section className="review-section ai-section">
      <div className="section-header">
        <div className="header-left">
          <h2>🤖 AI Learning Assistant</h2>
          <p>Get personalized help and explanations for any programming concept</p>
        </div>
      </div>
      
      <div className="ai-intro-content">
        <div className="ai-features">
          <div className="ai-feature">
            <div className="feature-icon">🎯</div>
            <h3>Personalized Learning</h3>
            <p>Get explanations tailored to your current skill level and learning goals</p>
          </div>
          <div className="ai-feature">
            <div className="feature-icon">💡</div>
            <h3>Interactive Examples</h3>
            <p>Receive practical code examples and step-by-step explanations</p>
          </div>
          <div className="ai-feature">
            <div className="feature-icon">🚀</div>
            <h3>Instant Help</h3>
            <p>Ask questions anytime and get immediate, comprehensive answers</p>
          </div>
        </div>
        
        <div className="ai-cta">
          <div className="ai-preview">
            <div className="chat-preview">
              <div className="preview-message user">
                "Explain React hooks with examples"
              </div>
              <div className="preview-message ai">
                "React hooks are functions that let you use state and lifecycle features..."
              </div>
            </div>
          </div>
          
          <div className="ai-actions">
            <button 
              className="primary-ai-btn"
              onClick={() => handleAskAI()}
            >
              🚀 Start Learning with AI
            </button>
            <p className="ai-description">
              Our AI assistant is trained to help you master programming concepts with 
              clear explanations, practical examples, and personalized guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSection;