// components/dashboard/SkillsTableSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SkillsTableSection.css';

const SkillsTableSection = ({ skills, calculateDaysSince, getDecayStatus }) => {
  const navigate = useNavigate();

  return (
    <section className="skills-section">
      <div className="section-header">
        <h2>Your Skills</h2>
        <button className="add-skill-btn" onClick={() => navigate('/skills')}>
          + Add Skill
        </button>
      </div>
      <div className="skills-table">
        {skills.length === 0 ? (
          <div className="empty-state">
            <p>No skills tracked yet. Start by logging your first practice session!</p>
            <button onClick={() => navigate('/skills')} className="practice-btn">
              Log Practice
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Category</th>
                <th>Last Practiced</th>
                <th>Decay Status</th>
                <th>Confidence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(skill => {
                const daysSince = calculateDaysSince(skill.lastPracticed);
                const decayInfo = getDecayStatus(daysSince);
                return (
                  <tr key={skill._id}>
                    <td className="skill-name">{skill.name}</td>
                    <td>
                      <span className="category-badge">{skill.category}</span>
                    </td>
                    <td>
                      <div className="last-practiced">
                        <span>{new Date(skill.lastPracticed).toLocaleDateString()}</span>
                        <small>{daysSince === 0 ? 'Today' : `${daysSince} days ago`}</small>
                      </div>
                    </td>
                    <td>
                      <span 
                        className={`decay-badge ${decayInfo.status}`}
                        style={{ backgroundColor: decayInfo.color }}
                      >
                        {decayInfo.text}
                      </span>
                    </td>
                    <td>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill"
                          style={{ 
                            width: `${skill.currentConfidence * 10}%`,
                            backgroundColor: skill.currentConfidence >= 7 ? '#4CAF50' : 
                                           skill.currentConfidence >= 4 ? '#FFC107' : '#F44336'
                          }}
                        ></div>
                        <span className="confidence-text">{skill.currentConfidence}/10</span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="practice-btn"
                        onClick={() => navigate('/skills')}
                      >
                        Practice
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default SkillsTableSection;