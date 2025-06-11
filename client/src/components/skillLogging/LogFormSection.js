// components/skilllogging/LogFormSection.js
import React from 'react';
import './LogFormSection.css';

const LogFormSection = ({
  formData,
  existingSkills,
  categories,
  editingId,
  isSubmitting,
  handleChange,
  handleConfidenceChange,
  handleSubmit,
  setEditingId,
  setFormData,
  getConfidenceColor
}) => {
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      skillName: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      timeSpent: '',
      confidence: 5,
      notes: ''
    });
  };

  return (
    <section className="log-form-section">
      <div className={`form-card ${editingId ? 'editing' : ''}`}>
        <h2>📝 {editingId ? 'Edit Session' : 'Log New Session'}</h2>
        {editingId && (
          <button 
            type="button"
            className="cancel-edit-btn"
            onClick={resetForm}
          >
            Cancel Edit
          </button>
        )}
        <form onSubmit={handleSubmit} className="log-form">
          {/* Skill Name */}
          <div className="form-group">
            <label htmlFor="skillName">Skill Name</label>
            <input
              type="text"
              id="skillName"
              name="skillName"
              value={formData.skillName}
              onChange={handleChange}
              placeholder="e.g., React Hooks"
              required
              list="skills-list"
              className="form-input"
              disabled={editingId} // Disable when editing
            />
            <datalist id="skills-list">
              {existingSkills.map(skill => (
                <option key={skill} value={skill} />
              ))}
            </datalist>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-select"
              disabled={editingId} // Disable when editing
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
                className="form-input"
                disabled={editingId} // Disable when editing
              />
            </div>
            <div className="form-group">
              <label htmlFor="timeSpent">Time Spent (minutes)</label>
              <input
                type="number"
                id="timeSpent"
                name="timeSpent"
                value={formData.timeSpent}
                onChange={handleChange}
                placeholder="30"
                min="1"
                max="480"
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Confidence Rating */}
          <div className="form-group">
            <label>Confidence Rating</label>
            <div className="confidence-selector">
              <div className="confidence-slider">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    type="button"
                    className={`confidence-btn ${formData.confidence === num ? 'active' : ''}`}
                    onClick={() => handleConfidenceChange(num)}
                    style={{
                      backgroundColor: formData.confidence === num ? getConfidenceColor(num) : '#e0e0e0',
                      color: formData.confidence === num ? 'white' : '#666'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="What did you learn? Any challenges?"
              rows="3"
              maxLength="500"
              className="form-textarea"
            />
            <small>{formData.notes.length}/500 characters</small>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loader"></span>
                {editingId ? 'Updating...' : 'Logging...'}
              </>
            ) : (
              <>
                <span className="btn-icon">{editingId ? '✏️' : '💾'}</span>
                {editingId ? 'Update Practice Session' : 'Log Practice Session'}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick Tips */}
      <div className="tips-card">
        <h3>💡 Quick Tips</h3>
        <ul>
          <li>Be honest with your confidence ratings</li>
          <li>Log sessions immediately after practice</li>
          <li>Add notes about what you learned</li>
          <li>Consistency beats intensity</li>
          <li>Click edit to modify time spent, confidence, or notes</li>
        </ul>
      </div>
    </section>
  );
};

export default LogFormSection;