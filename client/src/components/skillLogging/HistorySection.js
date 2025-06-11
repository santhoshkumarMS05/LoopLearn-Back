// components/skilllogging/HistorySection.js
import React from 'react';
import './HistorySection.css';

const HistorySection = ({
  practiceHistory,
  categories,
  filterCategory,
  searchTerm,
  editingId,
  setFilterCategory,
  setSearchTerm,
  handleEdit,
  handleDelete,
  getConfidenceColor
}) => {
  return (
    <section className="history-section">
      <div className="history-header">
        <h2>📚 Practice History</h2>
        <div className="history-filters">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="history-list">
        {practiceHistory.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No practice sessions found</p>
          </div>
        ) : (
          practiceHistory.map(entry => (
            <div key={entry._id} className={`history-card ${editingId === entry._id ? 'editing' : ''}`}>
              <div className="history-main">
                <div className="history-header-info">
                  <h3>{entry.skillName}</h3>
                  <span className="category-badge">{entry.category}</span>
                </div>
                <div className="history-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    {entry.timeSpent} min
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">💪</span>
                    <span 
                      className="confidence-badge"
                      style={{ backgroundColor: getConfidenceColor(entry.confidence) }}
                    >
                      {entry.confidence}/10
                    </span>
                  </span>
                </div>
                {entry.notes && (
                  <div className="history-notes">
                    <p>{entry.notes}</p>
                  </div>
                )}
              </div>
              <div className="history-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => handleEdit(entry)}
                  title="Edit"
                  disabled={editingId && editingId !== entry._id}
                >
                  ✏️
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDelete(entry._id)}
                  title="Delete"
                  disabled={editingId}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default HistorySection;