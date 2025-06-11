// AIAssistantPage.js - Pure JavaScript Implementation
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AiAssistantPage.css';
import { aiService } from '../services/api';

const AiAssistantPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);
  
  // State
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [canStop, setCanStop] = useState(false);
  const [typeIntervalRef, setTypeIntervalRef] = useState(null);

  // Initialize component
  useEffect(() => {
    if (location.state?.selectedSkill) {
      setSelectedSkill(location.state.selectedSkill);
      
      const initialMessage = {
        role: 'assistant',
        content: `👋 **Welcome! Let's master ${location.state.selectedSkill.name}**

I'm here to help you understand this skill better. 

**What would you like to explore?**
• Core concepts and fundamentals
• Common challenges and solutions  
• Best practices and tips
• Real-world examples

Ask me anything specific about **${location.state.selectedSkill.name}**!`,
        timestamp: new Date()
      };
      
      setMessages([initialMessage]);
    } else {
      const welcomeMessage = {
        role: 'assistant',
        content: `👋 **Welcome to your AI Programming Assistant!**

I'm here to help you learn programming concepts, debug code, and answer your technical questions.

**What can I help you with today?**
• Explain programming concepts clearly
• Help debug and review code  
• Provide coding best practices
• Suggest learning resources
• Answer specific technical questions

What would you like to explore?`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
    
    // Focus on input after component loads
    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }, 500);
  }, [location.state]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, [messages, isTyping]);

  // Enhanced typing animation effect
  useEffect(() => {
    if (isTyping && typingMessage) {
      const words = typingMessage.split(' ');
      let currentWordIndex = 0;
      let currentText = '';
      
      const typeInterval = setInterval(() => {
        if (currentWordIndex < words.length) {
          currentText += words[currentWordIndex] + ' ';
          
          // Update the last message with typed content
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isTyping) {
              lastMessage.content = currentText.trim();
            }
            return newMessages;
          });
          
          currentWordIndex++;
        } else {
          // Typing complete
          clearInterval(typeInterval);
          setIsTyping(false);
          setTypingMessage('');
          setCanStop(false);
          setTypeIntervalRef(null);
          
          // Mark message as complete
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.isTyping) {
              delete lastMessage.isTyping;
            }
            return newMessages;
          });
        }
      }, 30); // Fast typing speed
      
      setTypeIntervalRef(typeInterval);
      return () => clearInterval(typeInterval);
    }
  }, [isTyping, typingMessage]);

  // Stop typing function
  const stopTyping = () => {
    if (typeIntervalRef) {
      clearInterval(typeIntervalRef);
      setIsTyping(false);
      setTypingMessage('');
      setCanStop(false);
      setTypeIntervalRef(null);
      
      // Mark current message as complete
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.isTyping) {
          delete lastMessage.isTyping;
        }
        return newMessages;
      });
    }
  };

  // Send message to AI
  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isAiLoading || isTyping) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAiLoading(true);

    try {
      // Enhanced context for better AI responses
      const context = selectedSkill 
        ? `SKILL FOCUS SESSION:
Skill: ${selectedSkill.name}
Category: ${selectedSkill.category || 'Programming'}
Current Level: ${selectedSkill.currentConfidence || 'Not set'}/10
Context: User is learning this specific skill. Provide focused, practical responses with clear examples and actionable advice. Keep responses concise but comprehensive.`
        : 'GENERAL PROGRAMMING ASSISTANCE: Provide clear, practical programming help with examples and best practices. Keep responses focused and well-structured.';

      const response = await aiService.chat(inputMessage, context);
      
      if (response.success) {
        // Create typing message placeholder
        const aiMessage = {
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isTyping: true
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setTypingMessage(response.message);
        setIsTyping(true);
        setCanStop(true);
      } else {
        throw new Error(response.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ **Connection Error**\n\nI\'m having trouble connecting right now. Please check your connection and try again in a moment.\n\n**Possible solutions:**\n• Check your internet connection\n• Refresh the page\n• Try again in a few seconds',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
      // Refocus input
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }, 100);
    }
  };

  // Handle keyboard input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canStop && isTyping) {
        stopTyping();
      } else {
        sendMessage(e);
      }
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // Format message content with enhanced markdown parsing
  const formatMessageContent = (content) => {
    if (!content) return '';
    
    let formatted = content;
    
    // Bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-bold">$1</strong>');
    
    // Code blocks with proper formatting
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, 
      '<div class="code-wrapper"><pre class="code-block"><code>$2</code></pre></div>');
    
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Lists with proper styling
    formatted = formatted.replace(/^• (.*$)/gm, '<div class="list-item">• $1</div>');
    
    // Convert line breaks to paragraphs
    const paragraphs = formatted.split('\n\n');
    formatted = paragraphs.map(p => {
      if (p.trim()) {
        return `<p class="message-paragraph">${p.replace(/\n/g, '<br>')}</p>`;
      }
      return '';
    }).join('');
    
    return formatted;
  };

  // Generate quick action suggestions
  const getQuickActions = () => {
    if (selectedSkill) {
      return [
        `Explain ${selectedSkill.name} fundamentals`,
        `Common ${selectedSkill.name} mistakes to avoid`,
        `Best practices for ${selectedSkill.name}`,
        `${selectedSkill.name} real-world examples`,
        `How to improve in ${selectedSkill.name}`,
        `${selectedSkill.name} learning roadmap`
      ];
    }
    
    return [
      "Explain JavaScript closures",
      "React hooks tutorial", 
      "SQL vs NoSQL differences",
      "OOP concepts overview",
      "How to debug code effectively",
      "Programming best practices"
    ];
  };

  // Clear chat function
  const clearChat = () => {
    const welcomeMessage = {
      role: 'assistant',
      content: `🔄 **Chat Cleared Successfully!**

Ready for your next question. What would you like to learn about?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Stop any ongoing typing
    if (isTyping) {
      stopTyping();
    }
  };


  return (
    <div className="ai-container">
      
      
      {/* Fixed AI Header */}
      <div className="ai-header-fixed">
        <div className="ai-header-content">
          <div className="ai-title-section">
            <h1>🤖 AI Programming Assistant</h1>
            {selectedSkill ? (
              <p className="skill-context">
                Focused on: <strong>{selectedSkill.name}</strong>
                {selectedSkill.category && <span className="skill-category"> • {selectedSkill.category}</span>}
              </p>
            ) : (
              <p>Your personal coding mentor</p>
            )}
          </div>
          <div className="header-actions">
            <button 
              className="clear-btn"
              onClick={clearChat}
              title="Clear Chat History"
            >
              Clear Chat
            </button>
            <button 
              className="back-btn"
              onClick={() => navigate('/review')}
              title="Back to Review"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <main className="ai-main">
        {/* Chat Container */}
        <div className="chat-container">
          {/* Messages Area */}
          <div className="messages-container">
            <div className="messages-wrapper">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="message-wrapper">
                    <div className="message-avatar">
                      {message.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="message-content-wrapper">
                      <div 
                        className="message-content"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessageContent(message.content) 
                        }}
                      />
                      {!message.isTyping && (
                        <div className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isAiLoading && !isTyping && (
                <div className="message assistant">
                  <div className="message-wrapper">
                    <div className="message-avatar">🤖</div>
                    <div className="message-content-wrapper">
                      <div className="message-content">
                        <div className="typing-indicator">
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <span className="typing-text">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
      </main>

      {/* Quick Actions - Show for fresh chats */}
      {messages.length <= 1 && (
        <div className="quick-actions-fixed">
          <p className="quick-actions-title">💡 Quick Start</p>
          <div className="quick-actions-grid">
            {getQuickActions().map((action, index) => (
              <button 
                key={index}
                className="quick-action-btn"
                onClick={() => setInputMessage(action)}
                disabled={isAiLoading}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fixed Input Area */}
      <div className="chat-input-fixed">
        <div className="chat-input-container">
          <div className="input-wrapper">
            <textarea
              ref={chatInputRef}
              className="chat-input"
              placeholder="Ask me anything about programming..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isAiLoading}
              rows="1"
            />
            <button 
              className={`send-btn ${canStop && isTyping ? 'stop-btn' : ''}`}
              disabled={(!inputMessage.trim() || isAiLoading) && !canStop}
              onClick={canStop && isTyping ? stopTyping : sendMessage}
              title={canStop ? "Stop generation" : "Send message"}
            >
              {isAiLoading && !isTyping ? (
                <div className="send-loading">⏳</div>
              ) : canStop && isTyping ? (
                '⏹️'
              ) : (
                '➤'
              )}
            </button>
          </div>
          <p className="input-helper">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default AiAssistantPage;