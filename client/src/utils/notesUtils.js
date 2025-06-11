// utils/notesUtils.js (PDF Version)
// Install required package: npm install jspdf

import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

// Function to download notes as PDF document
export const downloadNotesAsPDF = (notes, filename = 'notes.pdf') => {
  try {
    const pdf = new jsPDF();
    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(46, 49, 146);
    pdf.text('Learning Notes', margin, yPosition);
    yPosition += 15;

    // Add creation date
    pdf.setFontSize(10);
    pdf.setTextColor(102, 102, 102);
    pdf.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, margin, yPosition);
    yPosition += 20;

    // Add each note
    notes.forEach((note, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      // Note title
      pdf.setFontSize(16);
      pdf.setTextColor(31, 78, 121);
      pdf.text(`${index + 1}. ${note.title}`, margin, yPosition);
      yPosition += 10;

      // Note metadata
      pdf.setFontSize(9);
      pdf.setTextColor(102, 102, 102);
      pdf.text(`Category: ${note.category} | Created: ${new Date(note.createdAt).toLocaleDateString()}`, margin, yPosition);
      yPosition += 8;

      // Tags if available
      if (note.tags && note.tags.length > 0) {
        pdf.setTextColor(0, 122, 204);
        pdf.text(`Tags: ${note.tags.map(tag => `#${tag}`).join(', ')}`, margin, yPosition);
        yPosition += 10;
      }

      // Note content
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      
      // Split content into lines that fit the page width
      const contentLines = pdf.splitTextToSize(note.content, pdf.internal.pageSize.width - 2 * margin);
      
      contentLines.forEach(line => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      yPosition += 15; // Space between notes

      // Add separator line (except for last note)
      if (index < notes.length - 1) {
        pdf.setDrawColor(204, 204, 204);
        pdf.line(margin, yPosition, pdf.internal.pageSize.width - margin, yPosition);
        yPosition += 15;
      }
    });

    // Save the PDF
    pdf.save(filename);

    return { success: true, message: 'Notes downloaded as PDF successfully!' };
  } catch (error) {
    console.error('Error creating PDF document:', error);
    return { success: false, message: 'Failed to download PDF' };
  }
};

// Keep other utility functions unchanged
export const saveNotesToStorage = (notes) => {
  try {
    localStorage.setItem('userNotes', JSON.stringify(notes));
    return { success: true };
  } catch (error) {
    console.error('Error saving notes:', error);
    return { success: false, message: 'Failed to save notes' };
  }
};

export const loadNotesFromStorage = () => {
  try {
    const savedNotes = localStorage.getItem('userNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

export const exportNotesAsJSON = (notes, filename = 'learning_notes_backup.json') => {
  try {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    saveAs(dataBlob, filename);
    return { success: true, message: 'Notes exported successfully!' };
  } catch (error) {
    console.error('Error exporting notes:', error);
    return { success: false, message: 'Failed to export notes' };
  }
};

export const importNotesFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const notes = JSON.parse(e.target.result);
        resolve(notes);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};