import React from 'react';
import { FaRegCheckCircle, FaCheckCircle } from 'react-icons/fa';

const CardHeader = ({ question, isSelected, handleSelect }) => {
  return (
    <div
      onClick={handleSelect}
      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 
      ${isSelected ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-100 hover:bg-gray-200'}`}
    >
      <div className="flex items-center space-x-3">
        {isSelected ? (
          <FaCheckCircle className="text-green-500 text-lg" />
        ) : (
          <FaRegCheckCircle className="text-gray-400 text-lg" />
        )}
        <span style={{ whiteSpace: 'pre-line' }} className={`font-medium text-start ${isSelected ? 'text-green-700' : 'text-gray-700'}`}>
          {question.question}
        </span>
      </div>
    </div>
  );
};

export default CardHeader;
