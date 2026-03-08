import React from 'react';

const InputField = ({ label, type, value, onChange, placeholder, required = false, name, width }) => {
  
  // Prevent scrolling or using arrow keys to change the number
  const handleKeyDown = (e) => {
    if (type === 'number' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();  // Prevent arrow keys from changing the number
    }
  };

  const handleWheel = (e) => {
    if (type === 'number') {
      e.target.blur();  // Blur the input to prevent the wheel from changing its value
    }
  };

  return (
    <div className={`mb-4 col-span-3 md:col-span-3 lg:col-span-1 ${width ? `w-[${width}%]` : ''}`}>
      {label && <label className="block mb-1 text-lg font-semibold text-gray-700">{label}</label>}
      <input
        type={type}
        name={name}  // Ensure the name prop is set
        value={value}
        onChange={onChange}
        onWheel={handleWheel}  // Handle wheel event without preventDefault
        onKeyDown={handleKeyDown}  // Prevent arrow keys from changing the value
        placeholder={placeholder}
        required={required}
        className="w-full p-3 rounded-lg border border-gray-300 focus:border-primeColor focus:ring-2 focus:ring-primeColor focus:outline-none transition-all duration-300 shadow-md appearance-none"
      />
    </div>
  );
};

export default InputField;
