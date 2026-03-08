import React from 'react';
import { FaFrown, FaMeh, FaSmile } from 'react-icons/fa';

const OptionButtons = ({
  variant = 'review',
  label,
  icon,
  isActive,
  onClick,
  color,
  option,
  selectedOption,
  handleOptionSelect,
  className = '',
}) => {
  // Configuration for recommend variant
  const recommendOptions = [
    {
      value: 'Not Met',
      icon: <FaFrown className="text-red-500" />,
      activeBg: 'bg-gradient-to-r from-red-200 to-red-300',
      activeBorder: 'border-red-500',
      activeText: 'text-red-700',
      hoverBg: 'hover:bg-red-100',
    },
    {
      value: 'Partially Met',
      icon: <FaMeh className="text-yellow-500" />,
      activeBg: 'bg-gradient-to-r from-yellow-200 to-yellow-300',
      activeBorder: 'border-yellow-500',
      activeText: 'text-yellow-700',
      hoverBg: 'hover:bg-yellow-500',
    },
    {
      value: 'Met',
      icon: <FaSmile className="text-green-500" />,
      activeBg: 'bg-gradient-to-r from-green-200 to-green-300',
      activeBorder: 'border-green-500',
      activeText: 'text-green-700',
      hoverBg: 'hover:bg-green-100',
    },
  ];

  if (variant === 'recommend') {
    return (
      <div className={`flex justify-around gap-3 mt-3 ${className}`}>
        {recommendOptions.map(({ value, icon, activeBg, activeBorder, activeText, hoverBg }) => (
          <button
            key={value}
            onClick={(e) => handleOptionSelect(value, e)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border shadow-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${value === 'Not Met' ? 'red' : value === 'Partially Met' ? 'yellow' : 'green'}-400 ${
              option === value
                ? `${activeBg} ${activeBorder} ${activeText}`
                : `bg-gray-100 border-transparent ${hoverBg}`
            }`}
            aria-pressed={option === value}
            aria-label={`Select ${value} option`}
          >
            {icon}
            <span className="text-sm font-medium">{value}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium shadow-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-400 ${isActive ? `bg-gradient-to-r from-${color}-500 to-${color}-600 text-white` : 'bg-gray-200 text-gray-700'} hover:bg-${color}-300 ${className}`}
      aria-pressed={isActive}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default OptionButtons;