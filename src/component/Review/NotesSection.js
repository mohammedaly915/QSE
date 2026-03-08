// NotesSection.js
import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const NotesSection = ({ notes, categoryColor }) => {
  const [isNotesVisible, setIsNotesVisible] = useState(false);

  return (
    <div>
      <button
        className="mt-2 flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        onClick={() => setIsNotesVisible(!isNotesVisible)}
      >
        {isNotesVisible ? <FaChevronUp /> : <FaChevronDown />}
        <span>{isNotesVisible ? 'Hide Notes' : 'Show Notes'}</span>
      </button>
      {isNotesVisible && notes.length > 0 && (
        <ul className="mt-3 space-y-3">
          {notes.map((note, index) => (
            <li key={index} className="relative bg-white p-3 rounded-lg shadow-lg flex items-start space-x-4 border-l-4" style={{ borderColor: categoryColor }}>
              <div className="font-bold text-blue-600 text-lg bg-blue-100 px-2 py-1 rounded-md">
                Note {index + 1}
              </div>
              <div className="min-w-0 flex-1 text-sm text-gray-800">{note}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotesSection;
