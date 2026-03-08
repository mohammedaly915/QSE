import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../component/NavBar/NavBAr';
import Tabs from '../component/Recommend/Taps';
import CardQuestion from '../component/Recommend/CardQuestion';
import { specificQuestions } from '../Utilities/RecommendData';
import SchemeHeader from '../component/Recommend/Scheme';

const Recommend = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state
  const [selectedQuestions, setSelectedQuestions] = useState(() => {
    if (location.state?.selectedQuestions) {
      return location.state.selectedQuestions;
    }
    const storedQuestions = sessionStorage.getItem('selectedQuestions');
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  });

  const [auditDatas, setAuditDatas] = useState(() => {
    const storedFormData = sessionStorage.getItem('auditData');
    return storedFormData ? JSON.parse(storedFormData) : null;
  });

  const [selectedType, setSelectedType] = useState('Organization');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return auditDatas?.scheme || 'ALL';
  });

  // Category colors mapping
  const categoryColors = {
    'GAHAR': '#FBBF24', // Yellow
    'GAHAR (2021 to GAHAR 2025)': '#FBBF24', // Yellow
    'GAHAR (Edition 2025)': '#FBBF24', // Yellow
    'JCI Laboratory': '#3B82F6', // Blue
    'ISO 15189-2022': '#F97316', // Orange
    'ALL': '#9CA3AF', // Gray for All
    'NA': '#EF4444', // Red for NA
  };

  // Effect hooks
  useEffect(() => {
    if (location.state?.auditData) {
      setAuditDatas(location.state.auditData);
      sessionStorage.setItem('auditData', JSON.stringify(location.state.auditData));
    } else {
      const storedFormData = sessionStorage.getItem('auditData');
      if (storedFormData) {
        setAuditDatas(JSON.parse(storedFormData));
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.selectedQuestions) {
      setSelectedQuestions(location.state.selectedQuestions);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (auditDatas?.scheme && auditDatas.scheme !== selectedCategory) {
      setSelectedCategory(auditDatas.scheme);
    }
  }, [auditDatas, selectedCategory]);

  useEffect(() => {
    const serializableQuestions = selectedQuestions.map((question) => ({
      ...question,
      attachments: question.attachments.map((attachment) =>
        attachment instanceof File
          ? { name: attachment.name, type: attachment.type, size: attachment.size }
          : attachment
      ),
    }));
    sessionStorage.setItem('selectedQuestions', JSON.stringify(serializableQuestions));
  }, [selectedQuestions]);

  // Redirect to home if audit data or scheme is missing
  useEffect(() => {
    if (!auditDatas || !auditDatas.scheme) {
      navigate('/');
    }
  }, [auditDatas, navigate]);

  // Helper functions
  const getAllQuestions = useCallback((type) => {
    const allSchemes = ['GAHAR', 'GAHAR (2021 to GAHAR 2025)', 'GAHAR (Edition 2025)', 'JCI Laboratory', 'ISO 15189-2022'];
    let questions = [];
    allSchemes.forEach(scheme => {
      const schemeQuestions = specificQuestions[scheme]?.[type] || [];
      // Exclude questions with non-empty NA array
      const filteredQuestions = schemeQuestions.filter(q => !q.NA || q.NA.length === 0);
      questions = [...questions, ...filteredQuestions.map(q => ({
        ...q,
        category: scheme,
        schemeBadge: scheme // Add schemeBadge for display
      }))];
    });
    return questions;
  }, []);

  const getNAQuestions = useCallback((type) => {
    // Get questions from the specified category in 'Recommendation Prediction'
    const questions = specificQuestions["Recommendation Prediction"]?.[type] || [];
    
    // Map questions to include category field
    return questions.map(q => ({
      ...q,
      category: "Recommendation Prediction",
      schemeBadge: "Recommendation Prediction" // Add schemeBadge for consistency
    }));
  }, []);

  const findQuestionState = useCallback((question, category) => {
    return selectedQuestions.find(
      (selected) =>
        selected.question === question.question &&
        selected.category === category &&
        selected.tab === selectedType
    );
  }, [selectedQuestions, selectedType]);

  console.log("question length",findQuestionState.prototype);
  

  const mapQuestionsWithOptions = useCallback((questions, category) => {
    return questions?.map((q) => {
      const state = findQuestionState(q, category);
      return {
        ...q,
        category,
        selectedOption: state?.selectedOption,
        notes: state?.notes,
        attachments: state?.attachments,
        schemeBadge: q.schemeBadge // Ensure schemeBadge is passed through
      };
    }) || [];
  }, [findQuestionState]);

  // Main question display logic
  const displayedQuestions = useCallback(() => {
    if (!selectedType) return [];

    if (selectedCategory === 'All') {
      // Get all questions from GAHAR, JCI Laboratory, and ISO 15189-2022, excluding NA
      return mapQuestionsWithOptions(getAllQuestions(selectedType), 'ALL');
    }

    if (selectedCategory === "Recommendation Prediction") {
      // Get questions from NA section and those with non-empty NA arrays
      return mapQuestionsWithOptions(getNAQuestions(selectedType), "Recommendation Prediction");
    }

    // For specific schemes (GAHAR, JCI Laboratory, ISO 15189-2022)
    const schemeQuestions = specificQuestions[selectedCategory];
    if (!schemeQuestions) return [];

    const typeQuestions = schemeQuestions[selectedType];
    return typeQuestions
      ? mapQuestionsWithOptions(typeQuestions.map(q => ({
          ...q,
          schemeBadge: selectedCategory // Add schemeBadge for specific schemes
        })), selectedCategory)
      : [];
  }, [selectedCategory, selectedType, mapQuestionsWithOptions, getAllQuestions, getNAQuestions]);

  // Event handlers
  const handleQuestionSelect = useCallback((question, isSelected, option, notes = '', attachments = []) => {
    console.log("question clicked", question);

    setSelectedQuestions((prev) => {
      const existingQuestionIndex = prev.findIndex(
        (q) =>
          q.question === question.question &&
          q.category === (question.category || selectedCategory) &&
          q.tab === selectedType
      );

      if (isSelected) {
        const newQuestionData = {
          ...question,
          selectedOption: option || 'Partially Met',
          category: question.category || selectedCategory,
          tab: selectedType,
          notes, 
          attachments,
          schemeBadge: question.schemeBadge // Preserve schemeBadge
        };

        if (existingQuestionIndex !== -1) {
          const updatedPrev = [...prev];
          updatedPrev[existingQuestionIndex] = newQuestionData;
          return updatedPrev;
        } else {
          return [...prev, newQuestionData];
        }
      } else {
        return prev.filter((q, index) => index !== existingQuestionIndex);
      }
    });
  }, [selectedCategory, selectedType]);

  const handleConfirm = useCallback(() => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question.');
      return;
    }
    navigate('/review', { state: { selectedQuestions } });
  }, [selectedQuestions, navigate]);

  const handleRestart = useCallback(() => {
    setSelectedQuestions([]);
    sessionStorage.removeItem('selectedQuestions');
  }, []);

  // Render
  const schemeName = auditDatas?.scheme;

  return (
    <>
      <NavBar 
        title={schemeName}
        onConfirm={handleConfirm}
        showConfirm={selectedQuestions.length > 0}
        onRestart={handleRestart}
        questionNum={selectedQuestions.length}
      />
      <div className="bg-light-blue-50 min-h-screen mt-16 pb-10">
        <Tabs selectedType={selectedType} onTypeChange={setSelectedType} />


        <div className="mt-4 grid grid-cols-1 gap-4 px-4">
          {displayedQuestions().length > 0 ? (
            displayedQuestions().map((question, index) => {
              const questionState = findQuestionState(question, question.category);

              return (
                <CardQuestion
                  key={`${question.question}-${question.category}-${index}`}
                  question={question}
                  isSelected={!!questionState}
                  onSelect={handleQuestionSelect}
                  option={questionState?.selectedOption || 'Not Met'}
                  notes={questionState?.notes || ''}
                  attachments={questionState?.attachments || []}
                  categoryColor={categoryColors[question.category] || 'gray'}
                  schemeBadge={question.schemeBadge} // Pass schemeBadge to CardQuestion
                />
              );
            })
          ) : (
            <p className="text-center text-gray-500 text-lg mt-8">
              No questions available for the current selection.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Recommend;