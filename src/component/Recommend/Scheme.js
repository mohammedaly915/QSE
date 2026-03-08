// SchemeHeader.js (Enhanced)
import React from 'react';

// Renamed props to be more descriptive of what they actually display
const SchemeHeader = ({ schemeName }) => {
  // Define category colors locally if they are only used for styling this component
  const categoryColors = {
    QSE: '#34D399', // Green
    GAHAR: '#FBBF24', // Yellow
    JCI: '#3B82F6', // Blue
    ISO: '#F97316', // Orange
  };

  // Helper to get the correct header style based on the scheme name
  const getHeaderStyle = (schemeLabel) => {
    const color = categoryColors[schemeLabel] || '#4B5563'; // Fallback to gray-600
    return {
      color: color,
    };
  };

  return (
    <div className="space-y-4   mx-4 mt-4"> {/* Added mx-4 and mt-4 for consistent spacing */}
      {/* Category Header */}
      {schemeName && (
        <h2
          className="text-lg md:text-xl font-bold text-center transition-all duration-300 animate-fadeIn"
          style={getHeaderStyle(schemeName)}
        >
          {schemeName} Scheme
        </h2>
      )}
    </div>
  );
};

export default SchemeHeader;