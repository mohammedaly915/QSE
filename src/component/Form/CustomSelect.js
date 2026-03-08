import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const CustomSelect = ({ name, value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || '');

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="block appearance-none w-full bg-gray-100 border border-gray-300 rounded-md py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-gray-700 cursor-pointer flex justify-between items-center"
      >
        {selectedOption || placeholder}
        <FaChevronDown className="text-gray-500" />
      </div>
      {isOpen && (
        <ul className="pl-[0px] absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                option === selectedOption ? 'bg-blue-200' : ''
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
