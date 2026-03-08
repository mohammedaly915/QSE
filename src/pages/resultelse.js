import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaRedo, FaExclamationCircle } from 'react-icons/fa';

const Result3 = ({exportDatainExcel}) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Destructure recommendations and processing_time with default values
  console.log(location);
  
  const { recommendations = [], processing_time   } = location.state?.results || {};
  const {  selectedQuestions } = location.state || {};

  const [auditData, setAuditData] = useState(null);
 
  // Fetch auditData from sessionStorage on component mount
  useEffect(() => {
    const storedFormData = sessionStorage.getItem('auditData');
    if (storedFormData) {
      setAuditData(JSON.parse(storedFormData));
    }
  }, []);

 
  // Handler for starting a new recommendation process
  const handleNewRecommend = useCallback(() => {
    sessionStorage.removeItem('selectedQuestions'); // Clear selected questions
    sessionStorage.removeItem('auditData'); // Clear audit data
    navigate('/'); // Navigate to the home/start page
  }, [navigate]);



  const sortedRecommendations = useMemo(() => {
    if (!recommendations) return [];
    
    return [...recommendations].sort((a, b) => {
      const maxScoreA = Math.max(
        a.gahar || 0, 
        a.jci || 0, 
        a.iso_15189_2022 || 0
      );
      
      const maxScoreB = Math.max(
        b.gahar || 0,
        b.jci || 0,
        b.iso_15189_2022 || 0
      );
      
      return maxScoreB - maxScoreA; // Descending order
    });
  }, [recommendations]);
  // Helper function to get color class for scores (background of the score box)
  const getScoreColorClass = useCallback((score) => {
    if (score === null || score === undefined || isNaN(score)) return 'bg-gray-100 text-gray-800';
    if (score >= 95) return 'w-full bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  }, []);

  // Helper function to get color for the progress bar
  const getScoreProgressBarColor = useCallback((score,isMaxScore) => {
    if (score === null || score === undefined || isNaN(score)) return 'bg-gray-400';
    if (score === isMaxScore) return 'bg-green-500';
    return 'bg-blue-500';
  }, []);

  // New helper function to determine if a score is "big" for additional styling
  const isBigScore = useCallback((score) => {
    return typeof score === 'number' && score >= 80; // Define your "big score" threshold
  }, []);

  
  const ScoreDisplay = useCallback(({ label, score, isMaxScore }) => {
    const scoreValue = typeof score === 'number' ? score : parseFloat(score);
    const displayValue = !isNaN(scoreValue) ? scoreValue : 'N/A';
    
    const scoreColorClass = getScoreColorClass(scoreValue);
    const progressBarColor = getScoreProgressBarColor(scoreValue , isMaxScore);
    const progressBarWidth = !isNaN(scoreValue) 
      ? Math.max(0, Math.min(100, scoreValue)) 
      : 0;
  
    const bigScoreClass = isBigScore(scoreValue) 
      ? 'shadow-lg transform' 
      : '';
  
    // Special styling for max score
    const maxScoreClass = isMaxScore 
      ? 'ring-2 ring-yellow-400 ring-inset shadow-[0_0_15px_rgba(255,215,0,0.5)]' 
      : '';
  
    return (
      <div
        className={`
          p-3 rounded-lg transition-all duration-300 hover:scale-[1.03]
          ${scoreColorClass} 
          ${bigScoreClass}
          ${maxScoreClass}
          relative
        `}
      >
        {isMaxScore && (
          <span className="absolute -top-2 -right-2 bg-blue-400 text-white text-xs font-bold rounded w-auto px-1 h-6 flex items-center justify-center">
            Recommend
          </span>
        )}
        
        <span className="block text-sm font-medium mb-1">{label}</span>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            {displayValue}
            {!isNaN(scoreValue) && '%'}
          </span>
          {!isNaN(scoreValue) && (
            <div className="ml-2 h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressBarColor} transition-all duration-500`}
                style={{ width: `${progressBarWidth}%` }}
                role="progressbar"
                aria-valuenow={scoreValue}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          )}
        </div>
      </div>
    );
  }, [isBigScore, getScoreColorClass, getScoreProgressBarColor]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12 tracking-tight animate-fadeIn">
          Audit Recommendations
        </h1>

        {recommendations.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow-lg p-10 border border-gray-100 animate-fadeIn">
            <FaExclamationCircle className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 font-medium mb-6">
              No recommendations available. Please go back and generate new recommendations.
            </p>
            <button
              onClick={handleNewRecommend}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Get new recommendations"
            >
              <FaRedo className="mr-2" />
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8">
          {sortedRecommendations.map((rec, index) => {
  // Create score array with labels
  const scoreEntries = [
    { label: "GAHAR", value: rec.gahar },
    { label: "JCI", value: rec.jci },
    { label: "ISO 15189-2022", value: rec.iso_15189_2022 }
  ];

  // Sort scores descending
  const sortedScores = [...scoreEntries].sort(
    (a, b) => (b.value || 0) - (a.value || 0)
  );

  // Get max score for highlighting
  const maxScore = sortedScores[0]?.value;

  return (
    <div
      key={index}
      className="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn"
      role="region"
      aria-label={`Recommendation ${index + 1}`}
    >
      <div className="grid grid-cols-1 gap-4 mb-6">
        {sortedScores.map((entry) => (
          <ScoreDisplay 
            key={entry.label}
            label={entry.label}
            score={entry.value}
            isMaxScore={entry.value === maxScore}
          />
        ))}
      </div>
    </div>
  );
})}
            {processing_time && (
              <div className="mt-8 text-center bg-blue-100 rounded-lg p-4 shadow-md animate-fadeIn">
                <p className="text-sm text-gray-700 font-medium">
                  Processing Time: <span className="font-semibold">{processing_time.toFixed(3)} seconds</span>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleNewRecommend}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Get new recommendations"
          >
            <FaRedo className="mr-2" />
            Get New Recommendations
          </button>
          <button
            onClick={exportDatainExcel}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Export to Excel"
          >
            <FaFileExcel className="mr-2" />
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result3;