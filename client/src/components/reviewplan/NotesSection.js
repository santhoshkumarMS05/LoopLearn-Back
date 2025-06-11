// components/reviewplan/NotesSection.js
import React, { useState, useEffect } from 'react';
import './NotesSection.css';

const NotesSection = ({ userNotes, onSaveNotes, onDownloadNotes }) => {
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  const categories = ['Frontend', 'Backend', 'Database', 'DSA', 'DevOps', 'General', 'Other'];

  useEffect(() => {
    if (userNotes) {
      setNotes(userNotes);
    }
  }, [userNotes]);

  // Handle new note creation
  const handleCreateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now(),
        title: newNote.title.trim(),
        content: newNote.content.trim(),
        category: newNote.category || 'General',
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      onSaveNotes(updatedNotes);
      
      // Reset form
      setNewNote({ title: '', content: '', category: '', tags: '' });
      setIsCreating(false);
    }
  };

  // Handle note editing
  const handleEditNote = (id) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setNewNote({
        title: noteToEdit.title,
        content: noteToEdit.content,
        category: noteToEdit.category,
        tags: noteToEdit.tags.join(', ')
      });
      setEditingId(id);
      setIsCreating(true);
    }
  };

  // Handle note update
  const handleUpdateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const updatedNotes = notes.map(note => 
        note.id === editingId 
          ? {
              ...note,
              title: newNote.title.trim(),
              content: newNote.content.trim(),
              category: newNote.category || 'General',
              tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
              updatedAt: new Date().toISOString()
            }
          : note
      );

      setNotes(updatedNotes);
      onSaveNotes(updatedNotes);
      
      // Reset form
      setNewNote({ title: '', content: '', category: '', tags: '' });
      setIsCreating(false);
      setEditingId(null);
    }
  };

  // Handle note deletion
  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      onSaveNotes(updatedNotes);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setNewNote({ title: '', content: '', category: '', tags: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  // Download single note
  const handleDownloadSingleNote = (note) => {
    onDownloadNotes([note], `${note.title}.docx`);
  };

  // Download all notes
  const handleDownloadAllNotes = () => {
    if (notes.length > 0) {
      onDownloadNotes(notes, 'All_Learning_Notes.docx');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="review-section notes-section">
      <div className="section-header">
        <div className="header-left">
          <h2>📝 Learning Notes</h2>
          <p>Create, organize and download your study notes</p>
        </div>
        <div className="notes-actions">
          {notes.length > 0 && (
            <button 
              className="download-all-btn"
              onClick={handleDownloadAllNotes}
            >
              📥 Download All
            </button>
          )}
          <button 
            className="add-note-btn"
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating ? '❌ Cancel' : '➕ Add Note'}
          </button>
        </div>
      </div>

      <div className="notes-content">
        {/* Create/Edit Note Form */}
        {isCreating && (
          <div className="note-form-card">
            <h3>{editingId ? 'Edit Note' : 'Create New Note'}</h3>
            <div className="note-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    placeholder="Enter note title..."
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                  placeholder="react, hooks, state management..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Write your notes here..."
                  className="form-textarea note-content-input"
                  rows="10"
                />
              </div>

              <div className="form-actions">
                <button 
                  className="save-note-btn"
                  onClick={editingId ? handleUpdateNote : handleCreateNote}
                >
                  {editingId ? '💾 Update Note' : '💾 Save Note'}
                </button>
                <button 
                  className="cancel-note-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="empty-notes">
              <div className="empty-icon">📝</div>
              <h3>No Notes Yet</h3>
              <p>Start creating your learning notes to organize your study materials</p>
              <button 
                className="create-first-note-btn"
                onClick={() => setIsCreating(true)}
              >
                Create Your First Note
              </button>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <div className="note-title-section">
                      <h3>{note.title}</h3>
                      <span className="note-category">{note.category}</span>
                    </div>
                    <div className="note-actions">
                      <button 
                        className="note-action-btn download"
                        onClick={() => handleDownloadSingleNote(note)}
                        title="Download as Word"
                      >
                        📥
                      </button>
                      <button 
                        className="note-action-btn edit"
                        onClick={() => handleEditNote(note.id)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="note-action-btn delete"
                        onClick={() => handleDeleteNote(note.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="note-content">
                    <p>{note.content.substring(0, 200)}...</p>
                  </div>

                  {note.tags.length > 0 && (
                    <div className="note-tags">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="note-tag">#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="note-meta">
                    <span className="note-date">
                      Created: {formatDate(note.createdAt)}
                    </span>
                    {note.updatedAt !== note.createdAt && (
                      <span className="note-date">
                        Updated: {formatDate(note.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NotesSection;