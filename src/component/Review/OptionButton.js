// OptionButton.js
import React from 'react'; 

const OptionButton = ({ label, icon, isActive, onClick, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-colors ${isActive ? `bg-${color}-500` : 'bg-gray-200'} hover:bg-${color}-200`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default OptionButton;
