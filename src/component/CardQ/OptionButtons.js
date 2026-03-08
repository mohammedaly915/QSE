import React from 'react';
import { FaFrown, FaMeh, FaSmile } from 'react-icons/fa';

const OptionButtons = ({ option, handleOptionSelect }) => {

  return ( 
    <div className="flex justify-around mt-3">
      <button
        onClick={(e) => handleOptionSelect('Not Met', e)}
        className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${option === 'Not Met' ? 'bg-red-200 border-red-500 text-red-700' : 'bg-gray-100'} hover:bg-red-100 border border-transparent`}
      >
        <FaFrown className="text-red-500" />
        <span>Not Met</span>
      </button>
      <button
        onClick={(e) => handleOptionSelect('Partially Met', e)}
        className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${option === 'Partially Met' ? 'bg-yellow-200 border-yellow-500 text-yellow-700' : 'bg-gray-100'} hover:bg-yellow-100 border border-transparent`}
      >
        <FaMeh className="text-yellow-500" />
        <span>Partially Met</span>
      </button>
      <button
        onClick={(e) => handleOptionSelect('Met', e)}
        className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${option === 'Met' ? 'bg-green-200 border-green-500 text-green-700' : 'bg-gray-100'} hover:bg-green-100 border border-transparent`}
      >
        <FaSmile className="text-green-500" />
        <span>Met</span>
      </button>
    </div>
  );
};

export default OptionButtons;
