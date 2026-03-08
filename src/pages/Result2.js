import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../component/NavBar/NavBAr';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaRedo, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Result2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results?.recommendations || [];
  const [auditData, setAuditData] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const storedFormData = sessionStorage.getItem('auditData');
    if (storedFormData) {
      setAuditData(JSON.parse(storedFormData));
    }
  }, []);

  const toggleQuestion = (resultIndex, questionIndex) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [`${resultIndex}-${questionIndex}`]: !prev[`${resultIndex}-${questionIndex}`],
    }));
  };

  const handleNewRecommend = () => {
    sessionStorage.removeItem('selectedQuestions');
    sessionStorage.removeItem('auditData');
    navigate('/');
  };

  const handleExportToExcel = () => {
    if (!auditData || results.length === 0) {
      alert('No data available to export.');
      return;
    }

    const combinedData = results.flatMap((result, index) =>
      result.mapped_questions.map((question, qIndex) => ({
        RowNumber: `${index + 1}.${qIndex + 1}`,
        StandardText: result.standard_text,
        Confidence: result.confidence.toFixed(4),
        QuestionID: question.id,
        QuestionDescription: question.description,
        ...auditData,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(combinedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit_Results');
    XLSX.writeFile(workbook, 'Audit_Results.xlsx');
  };

  return (
    <>
      {/* <NavBar title="Recommendation Results" /> */}
      <div className="min-h-[90vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10 tracking-tight">
            Your Recommendations
          </h1>

          {results.length === 0 ? (
            <div className="text-center bg-white rounded-2xl shadow-lg p-8">
              <p className="text-lg text-gray-600 font-medium">
                No recommendations available. Please go back and select some questions.
              </p>
              <button
                onClick={handleNewRecommend}
                className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaRedo className="mr-2" />
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="mb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="flex items-center space-x-3">
                        <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                          {result.standard_text}
                        </span>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Confidence:</span>
                          <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                            <span>{(result.confidence * 100).toFixed(2)}%</span>
                            <div className="ml-2 h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${result.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-gray-800">Mapped Questions:</h3>
                    {result.mapped_questions.map((question, qIndex) => (
                      <div
                        key={qIndex}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200"
                      >
                        <div
                          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleQuestion(index, qIndex)}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-blue-600">ID: {question.id}</span>
                          </div>
                          {expandedQuestions[`${index}-${qIndex}`] ? (
                            <FaChevronUp className="text-gray-500" />
                          ) : (
                            <FaChevronDown className="text-gray-500" />
                          )}
                        </div>
                        {expandedQuestions[`${index}-${qIndex}`] && (
                          <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-600 leading-relaxed">{question.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleNewRecommend}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <FaRedo className="mr-2" />
              Get New Recommendations
            </button>
            <button
              onClick={handleExportToExcel}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <FaFileExcel className="mr-2" />
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Result2;