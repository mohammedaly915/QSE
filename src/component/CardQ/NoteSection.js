import React, { useState } from 'react';
import { FaPlus, FaTrash, FaTimes, FaEdit } from 'react-icons/fa';

const NoteSection = ({ notes, onAddNote, onDeleteNote }) => {
  const [newNote, setNewNote] = useState('');
  const [isTextareaVisible, setIsTextareaVisible] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote('');
      setIsTextareaVisible(false);
    }
  };

  const toggleTextareaVisibility = (event) => {
    event.stopPropagation();
    setIsTextareaVisible(!isTextareaVisible);
  };

  return (
    <div className="mt-4 animate-fadeIn">
      

      {isTextareaVisible ? (
        <div className="mt-3 flex flex-col space-y-3 animate-fadeIn">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="w-full h-24 p-4 bg-white border border-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 resize-none"
            onClick={(e) => e.stopPropagation()}
            aria-label="Enter a new note"
          />

          <div className='flex  justify-between'>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            onClick={toggleTextareaVisibility}
            aria-label={isTextareaVisible ? 'Cancel adding note' : 'Add a new note'}
          >
            {isTextareaVisible ? <FaTimes className="text-lg" /> : <FaEdit className="text-lg" />}
            <span>{isTextareaVisible ? 'Cancel' : 'Add Note'}</span>
          </button>
              <button
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-sm hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                onClick={handleAddNote}
                aria-label="Add note"
              >
                <FaPlus className="text-lg mr-2" />
                <span>Add</span>
              </button>
              
          </div>
        </div>
      ):(<button
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        onClick={toggleTextareaVisibility}
        aria-label={isTextareaVisible ? 'Cancel adding note' : 'Add a new note'}
      >
        {isTextareaVisible ? <FaTimes className="text-lg" /> : <FaEdit className="text-lg" />}
        <span>{isTextareaVisible ? 'Cancel' : 'Add Note'}</span>
      </button>)}

      {notes.length > 0 && (
        <div className="mt-4 space-y-4">
          {notes.map((note, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-md border-l-4 border-blue-500 flex items-start space-x-4 transition-all duration-200 hover:bg-blue-200 animate-fadeIn"
            >
              <div className="flex-shrink-0">
                <span className="font-semibold text-blue-600 text-sm bg-blue-200 px-2 py-1 rounded-md">
                  Note {index + 1}
                </span>
              </div>
              <div className="text-start flex-grow">
                <span className="text-base font-medium text-gray-800 leading-relaxed">
                  {note}
                </span>
              </div>
              <button
                className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(index);
                }}
                aria-label={`Delete note ${index + 1}`}
              >
                <FaTrash className="text-lg" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(NoteSection);