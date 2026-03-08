import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../component/NavBar/NavBAr2';
import * as XLSX from 'xlsx';


const Result = () => { 
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results?.recommendations || []; // Get recommendations data from state
  console.log(
    "results",
    results
  );
  
  const [AuditData, setAuditData] = useState(null);

  useEffect(() => {
    // Retrieve formData from session storage
    const storedFormData = sessionStorage.getItem('auditData');
    if (storedFormData) {
      setAuditData(JSON.parse(storedFormData));
    }
  }, []);
  
  console.log("AuditDatas Session",AuditData );
  const handleNewRecommend = () => {
    sessionStorage.removeItem('selectedQuestions');
    sessionStorage.removeItem('auditData'); 
    navigate('/'); // Navigate to the recommendation page for new recommendations
  };

  const handleExportToExcel = () => {
    if (!AuditData || results.length === 0) {
      alert("No data available to export.");
      return;
    }
  
    // Combine AuditData and recommendations into a single array of objects
    const combinedData = results.map((result, index) => {
      const flattenedResult = Object.entries(result).reduce((acc, [key, value]) => {
        acc[`Result_${key}`] = value; // Prefix keys with "Result_" for clarity
        return acc;
      }, {});
  
      return {
        RowNumber: index + 1, // Optional row number column
        ...AuditData,         // Include AuditData fields
        ...flattenedResult,   // Include flattened result fields
      };
    });
  
    // Convert the combined data into an Excel worksheet
    const worksheet = XLSX.utils.json_to_sheet(combinedData);
  
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit_Results');
  
    // Trigger the file download
    XLSX.writeFile(workbook, 'Audit_Results.xlsx');
  };
  

  return (
    <>
      <NavBar title="Recommendation Results" />
    <div className="bg-gradient-to-r from-light-blue-50 to-blue-100 min-h-[90vh] p-6 mt-16">

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Your Recommendations</h1>

        {results.length === 0 ? (
          <p className="text-center text-lg text-gray-500 mt-4">
            No recommendations available. Please go back and select some questions.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                <div className="space-y-1">
                  {Object.keys(result).map((key) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-semibold text-gray-700">{key}:</span>
                      <span className="text-gray-600">{result[key]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center gap-[10px]">
          <button
            onClick={handleNewRecommend}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors shadow-md"
          >
            Get New Recommendations
          </button>

          <button 
          onClick={handleExportToExcel}  
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors shadow-md"
          >
            Export to Excel
        </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Result;
