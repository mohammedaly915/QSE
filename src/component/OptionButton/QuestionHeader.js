import React from 'react';
import { FaCheckCircle, FaRegCheckCircle, FaTrashAlt } from 'react-icons/fa';

const QuestionHeader = ({
  variant = 'review',
  question,
  index,
  onDelete,
  isSelected,
  handleSelect, 
  className = '',
}) => {
  const questionText = typeof question === 'string' ? question : question?.question || '';
  const naContent =  question?.source; // Get the NA array
  

  return (
    <div
      
      className={`flex items-center justify-between p-4 rounded-lg  transition-all duration-300  ${
        variant === 'recommend'
          ? isSelected
            ? 'bg-gradient-to-r from-green-100 to-green-200 hover:bg-green-300'
            : 'bg-gray-100 hover:bg-gray-200'
          : 'bg-white border border-gray-200 hover:bg-gray-50'
      } ${className}`}
      aria-selected={variant === 'recommend' ? isSelected : undefined}
      aria-label={variant === 'recommend' ? `Select question: ${questionText}` : undefined}
    >
      <div className="flex items-center space-x-4 flex-grow">
        {variant === 'recommend' && (
          <span className="text-lg">
            {isSelected ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaRegCheckCircle className="text-gray-400" />
            )}
          </span>
        )}
        <span
          style={{ whiteSpace: 'pre-line' }}
          className={`text-base font-medium text-start leading-relaxed ${
            variant === 'recommend' ? (isSelected ? 'text-green-700' : 'text-gray-700') : 'text-gray-800'
          }`}
        >
          {questionText}
        </span>
      </div>
      {naContent && naContent.length > 0 && (
    <div className="absolute -top-2 -right-2 flex flex-wrap gap-1">
      {naContent.map((item, idx) => (
        <span
          key={idx}
          className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md"
        >
          {item}
        </span>
      ))}
    </div>
  )}
      {variant === 'review' && (
        <button
          onClick={() => onDelete(index)}
          className="ml-4 p-2 bg-red-100 rounded-full hover:bg-red-200 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          aria-label={`Delete question: ${questionText}`}
        >
          <FaTrashAlt className="text-red-500 hover:text-red-800 text-xl" />
        </button>
      )}
    </div>
  );
};

export default QuestionHeader;