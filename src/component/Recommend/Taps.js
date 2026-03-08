import React, { useState, useEffect, useRef } from 'react';
import './Taps.scss'; // Ensure SCSS file is imported
import {
  FaBuilding, FaUserCheck, FaWarehouse, FaBoxes, FaTools, FaCogs,
  FaFolderOpen, FaInfoCircle, FaExclamationTriangle, FaRegLightbulb, FaRocket,
  FaArrowLeft, FaArrowRight
} from 'react-icons/fa';

const Tabs = ({ selectedType, onTypeChange }) => {
  const questionTypes = [
    { label: 'Organization', icon: <FaBuilding /> },
    { label: 'Customer Focus', icon: <FaUserCheck /> },
    { label: 'Facilities and Safety', icon: <FaWarehouse /> },
    { label: 'Supplier and Inventory Management', icon: <FaBoxes /> },
    { label: 'Equipment Management', icon: <FaTools /> },
    { label: 'Process Management', icon: <FaCogs /> },
    { label: 'Documents and Records Management', icon: <FaFolderOpen /> },
    { label: 'Information Management', icon: <FaInfoCircle /> },
    { label: 'Non-conforming Events Management', icon: <FaExclamationTriangle /> },
    { label: 'Assessments', icon: <FaRegLightbulb /> },
    { label: 'Continual Improvement', icon: <FaRocket /> },
  ];

  const [activeIndex, setActiveIndex] = useState(questionTypes.findIndex(type => type.label === selectedType));
  const tabsRef = useRef(null);

  // Update active index when selectedType prop changes
  useEffect(() => {
    const index = questionTypes.findIndex(type => type.label === selectedType);
    setActiveIndex(index);
  }, [selectedType, questionTypes]);

  // Scroll to the active tab when activeIndex changes
  useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.querySelector('.active-tab');
      if (activeTab) {
        const container = tabsRef.current;
        const scrollLeft = activeTab.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex(prevIndex => {
      const nextIndex = Math.min(prevIndex + 1, questionTypes.length - 1);
      const nextType = questionTypes[nextIndex].label;
      onTypeChange(nextType);
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setActiveIndex(prevIndex => {
      const preIndex = Math.max(prevIndex - 1, 0);
      const prevType = questionTypes[preIndex].label;
      onTypeChange(prevType);
      return preIndex;
    });
  };

  const handleTabClick = (label, index) => {
    onTypeChange(label);
    setActiveIndex(index);
  };

  return (
    <div className="relative flex items-center w-full mt-6 py-4">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        className={`absolute left-[4px] z-10 p-3 bg-white rounded shadow-md transition-all duration-300 focus:outline-none ring-2 ring-blue-500 ${activeIndex === 0 ? '' : 'hover:bg-gray-100'}`}
        disabled={activeIndex === 0}
        aria-label="Previous tab"
      >
        <FaArrowLeft className="text-gray-700" />
      </button>

      {/* Tab Navigation Container */}
      <div
        ref={tabsRef}
        className="flex flex-grow overflow-x-auto py-4 scrollbar-custom px-8 gap-4 scrollbar-hidden" // Added px for arrow spacing, scrollbar-hidden class
        role="tablist" // ARIA role for tab list
      >
        {questionTypes.map((type, index) => (
          <button
            key={type.label}
            onClick={() => handleTabClick(type.label, index)}
            className={`flex items-center px-4 py-3 rounded transition-all duration-300 ease-in-out whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeIndex === index
                ? 'bg-blue-600 text-white  active-tab' // active-tab class for SCSS
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            role="tab" // ARIA role for tab
            aria-selected={activeIndex === index} // ARIA attribute for selection state
            tabIndex={activeIndex === index ? 0 : -1} // tabIndex for keyboard navigation
          >
            {type.icon}
            <span className="ml-2 text-sm font-medium">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className={`absolute right-[4px] z-10 p-3 bg-white rounded shadow-md transition-all duration-300 focus:outline-none ring-2 ring-blue-500 ${activeIndex === questionTypes.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        disabled={activeIndex === questionTypes.length - 1}
        aria-label="Next tab"
      >
        <FaArrowRight className="text-gray-700" />
      </button>

       {/* Gradient Overlays (Optional, requires SCSS) */}
       <div className="absolute left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-white pointer-events-none z-9"></div>
       <div className="absolute right-8 top-0 bottom-0 w-8 bg-gradient-to-l from-white pointer-events-none z-9"></div>
    </div>
  );
};

export default Tabs;