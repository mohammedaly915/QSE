import React from 'react';

const CategorySelector = ({ selectedCategory, onCategorySelect, selectedFilter, onFilterChange }) => {
  const categories = [
    { label: 'QSE', color: '#34D399' },
    { label: 'GAHAR', color: '#FBBF24' }, // Changed 'yellow' to a specific hex for consistency
    { label: 'JCI', color: '#3B82F6' },   // Changed 'blue' to a specific hex
    { label: 'ISO', color: '#F97316' },   // Changed 'orange' to a specific hex
  ];

  const filters = [
    { label: 'Show All', value: 'general' },
    { label: `Only ${selectedCategory}`, value: 'specific' },
  ];

  const getCategoryClass = (category) => {
    switch (category) {
      case 'QSE':
        return 'border-green-500 text-green-600 bg-green-50';
      case 'GAHAR':
        return 'border-yellow-500 text-yellow-600 bg-yellow-50';
      case 'JCI':
        return 'border-blue-500 text-blue-600 bg-blue-50';
      case 'ISO':
        return 'border-orange-500 text-orange-600 bg-orange-50';
      default:
        return 'border-transparent text-gray-500 bg-gray-50';
    }
  };

  const getHeaderStyle = (categoryLabel) => {
    const category = categories.find((cat) => cat.label === categoryLabel);
    return {
      color: category ? category.color : '#4B5563', // Fallback to gray-600
    };
  };

  return (
    <div className="space-y-4 px-4 py-3 bg-gray-100 rounded-xl shadow-sm">
      {/* Category Header */}
      {selectedCategory && (
        <h2
          className="text-lg md:text-xl font-bold text-center transition-all duration-300 animate-fadeIn"
          style={getHeaderStyle(selectedCategory)}
        >
          {selectedCategory} Shceme
        </h2>
      )}

      {/* Category Selector */}
      {/* <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.label}
            onClick={() => onCategorySelect(category.label)}
            className={`min-w-[80px] px-4 py-2 text-sm md:text-base rounded-lg font-semibold border-b-4 
              transition-all duration-300 ease-in-out transform hover:scale-105
              ${selectedCategory === category.label
                ? `${getCategoryClass(category.label)} scale-105 shadow-md`
                : 'border-transparent text-gray-600 bg-gray-50 hover:bg-gray-200 hover:text-gray-800'
              }`}
            style={{
              flex: '1 0 auto',
              maxWidth: '140px',
            }}
          >
            {category.label}
          </button>
        ))}
      </div> */}

      {/* Filters - Only show when category is selected and not QSE */}
      {selectedCategory !== 'QSE' && selectedCategory && (
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`min-w-[100px] px-4 py-2 text-sm md:text-base rounded-lg font-semibold 
                border-b-4 transition-all duration-300 ease-in-out transform hover:scale-105
                ${selectedFilter === filter.value
                  ? 'border-blue-500 text-blue-600 bg-blue-50 scale-105 shadow-md'
                  : 'border-transparent text-gray-600 bg-gray-50 hover:bg-gray-200 hover:text-gray-800'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;