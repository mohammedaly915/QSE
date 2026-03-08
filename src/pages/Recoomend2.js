import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../component/NavBar/NavBAr';
import Tabs from '../component/Recommend/Taps';
import CardQuestion from '../component/Recommend/CardQuestion';
import CategorySelector from '../component/Recommend/CategorySelector';
import { QSEQuestions, specificQuestions } from '../Utilities/RecommendData';
import SchemeHeader from '../component/Recommend/Scheme';

const Recommend = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedData = sessionStorage.getItem('auditData');
  const auditDaa = JSON.parse(storedData);
  if (storedData) {
    console.log('audit data in recommend', auditDaa.scheme); 
  }
  // Initialize selectedQuestions from location.state or sessionStorage
  const [selectedQuestions, setSelectedQuestions] = useState(() => {
    // Prioritize location.state from /review navigation
    if (location.state?.selectedQuestions) {
      return location.state.selectedQuestions;
    }
    // Fallback to sessionStorage (excluding attachments)
    const storedQuestions = sessionStorage.getItem('selectedQuestions');
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  });

  const [auditDatas, setAuditDatas] = useState(null);

  // Sync selectedQuestions with location.state and sessionStorage
  useEffect(() => {
    // Update selectedQuestions if navigating back from /review
    if (location.state?.selectedQuestions) {
      setSelectedQuestions(location.state.selectedQuestions);
    }

    // Retrieve auditData from sessionStorage
    const storedFormData = sessionStorage.getItem('auditData');
    if (storedFormData) {
      setAuditDatas(JSON.parse(storedFormData));
    }
  }, [location.state]);

  // Save selectedQuestions to sessionStorage (excluding File objects)
  useEffect(() => {
    // Create a copy of selectedQuestions without File objects for serialization
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

  const categoryColors = {
    QSE: '#34D399', // Green
    GAHAR: '#FBBF24', // Yellow
    JCI: '#3B82F6', // Blue
    ISO: '#F97316', // Orange
  };

  const [selectedType, setSelectedType] = useState('Organization');
  const [selectedCategory, setSelectedCategory] = useState(auditDaa);

  
  const [selectedFilter, setSelectedFilter] = useState('general');

  // Handle question selection
  const handleQuestionSelect = (question, isSelected, option, notes = '', attachments = []) => {
    setSelectedQuestions((prev) => {
      const existingQuestion = prev.find(
        (q) =>
          q.question === question.question &&
          q.category === question.category &&
          q.tab === selectedType
      );

      if (isSelected) {
        if (existingQuestion) {
          // Update existing question
          return prev.map((q) =>
            q.question === question.question &&
            q.category === question.category &&
            q.tab === selectedType
              ? { ...q, selectedOption: option || 'Partially Met', notes, attachments }
              : q
          );
        } else {
          // Add new question
          return [
            ...prev,
            {
              ...question,
              selectedOption: option || 'Partially Met',
              category: question.category || selectedCategory,
              tab: selectedType,
              notes,
              attachments,
            },
          ];
        }
      } else {
        // Remove question if deselected
        return prev.filter(
          (q) =>
            !(
              q.question === question.question &&
              q.category === question.category &&
              q.tab === selectedType
            )
        );
      }
    });
  };

  // Navigate to /review
  const handleConfirm = () => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question.');
      return;
    }
    navigate('/review', { state: { selectedQuestions } });
  };

  // Clear selected questions and sessionStorage
  const handleRestart = () => {
    setSelectedQuestions([]);
    sessionStorage.removeItem('selectedQuestions');
  };

  // Find selected option for a question
  const findSelectedOption = (question, category) => {
    return selectedQuestions.find(
      (selected) =>
        selected.question === question.question &&
        selected.category === category &&
        selected.tab === selectedType
    )?.selectedOption;
  };

  // Map questions with selected options
  const mapQuestionsWithOptions = (questions, category) => {
    return questions?.map((q) => ({
      ...q,
      category,
      selectedOption: findSelectedOption(q, category),
    })) || [];
  };

  // Determine displayed questions based on category and filter
  const displayedQuestions = () => {
    const isQSECategory = selectedCategory === 'QSE';
    const isGeneralFilter = selectedFilter === 'general';
    const specificCategoryQuestions = specificQuestions[selectedCategory]?.[selectedType];

    if (isQSECategory) {
      return mapQuestionsWithOptions(QSEQuestions[selectedType], 'QSE');
    } 
    else if (selectedCategory && isGeneralFilter) {
      return [
        ...mapQuestionsWithOptions(QSEQuestions[selectedType], 'QSE'),
        ...mapQuestionsWithOptions(specificCategoryQuestions, selectedCategory),
      ];
    } 
    else if (selectedCategory && selectedFilter === 'specific') {
      return mapQuestionsWithOptions(specificCategoryQuestions, selectedCategory);
    }

    return [];
  };

  return (
    <>
      <NavBar
        title="Recommendation"
        onConfirm={handleConfirm}
        showConfirm={selectedQuestions.length > 0}
        onRestart={handleRestart}
        questionNum={selectedQuestions.length}
      />
      <div className="bg-light-blue-50 min-h-screen mt-16">
        <Tabs selectedType={selectedType} onTypeChange={setSelectedType} />
        {/* <CategorySelector    
          scheme={auditDaa.scheme}    
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        /> */}
        <SchemeHeader
          scheme={auditDaa.scheme}    
        />
        <div className="mt-4 grid grid-cols-1 gap-4">
          {displayedQuestions().map((question) => {
            const selectedQuestion = selectedQuestions.find(
              (q) =>
                q.question === question.question &&
                q.category === question.category &&
                q.tab === selectedType
            );

            return (
              <CardQuestion
                key={`${question.question}-${selectedType}-${selectedCategory}`}
                question={question}
                isSelected={!!selectedQuestion}
                onSelect={handleQuestionSelect}
                option={selectedQuestion?.selectedOption || 'Not Met'}
                notes={selectedQuestion?.notes || ''}
                attachments={selectedQuestion?.attachments || []}
                categoryColor={categoryColors[question.category] || 'gray'}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Recommend;