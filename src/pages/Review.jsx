// Review.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../component/NavBar/NavBAr';
import ReviewCard from '../component/Review/ReviewCard';
import SendingStatus from '../component/popup/SenedingStatus';
 
const Review = ({exportDatainExcel}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedQuestions, setSelectedQuestions] = useState(location.state?.selectedQuestions || []);
  const [selectedGeneration, setSelectedGeneration] = useState('1');
  const [sendingStatus, setSendingStatus] = useState(null); // loading, success, error
  const [statusMessage, setStatusMessage] = useState('');

  const [auditData, setAuditData] = useState(null);

  // Fetch auditData from sessionStorage on component mount
  useEffect(() => {
    const storedFormData = sessionStorage.getItem('auditData');
    if (storedFormData) {
      setAuditData(JSON.parse(storedFormData));
    }
  }, []);
  useEffect(() => {
    // Listen for navbar confirm button click
    const handleConfirmClick = () => {
      handleSubmit();
    };
    
    window.addEventListener('navbar-confirm-clicked', handleConfirmClick);
    
    return () => {
      window.removeEventListener('navbar-confirm-clicked', handleConfirmClick);
    };
  }, [selectedQuestions, selectedGeneration]);

  useEffect(() => {
    console.log(selectedQuestions);
    
    if (!selectedQuestions || selectedQuestions.length<=0) {
      
      navigate('/');
    }
  }, [selectedQuestions, navigate]);

  const handleOptionSelect = (index, option) => {
    const updatedQuestions = selectedQuestions.map((question, i) => {
      if (i === index) return { ...question, selectedOption: option };
      return question;
    });
    setSelectedQuestions(updatedQuestions);
  };

  const handleDelete = (index) => {
    const updatedQuestions = selectedQuestions.filter((_, i) => i !== index);
    setSelectedQuestions(updatedQuestions);
  };


  const calculateStandardCounts = (questions) => {
    const counts = {
      jci: { met: 0, partially: 0, notMet: 0 },
      Gahar: { met: 0, partially: 0, notMet: 0 },
      iso: { met: 0, partially: 0, notMet: 0 },
    };
  
    // Mapping source values to standards
    const sourceToStandard = {
      'JCI Laboratories, 4th Edition': 'jci',
      'ISO 15189-2022': 'iso',
      'GAHAR, Edition 2021': 'Gahar',
      'GAHAR, 2021 to GAHAR, 2025': 'Gahar',
      'GAHAR, 2025': 'Gahar',
    };
  
    // Mapping category/schemeBadge to standards
    const categoryToStandard = {
      'JCI Laboratory': 'jci',
      'ISO 15189-2022': 'iso',
      'GAHAR': 'Gahar',
      'GAHAR (2021 to GAHAR 2025)': 'Gahar',
      'GAHAR (Edition 2025)': 'Gahar',
      'Recommendation Prediction': 'Recommendation Prediction',
      'ALL': 'ALL',
    };
  
    // List of all standards
    const allStandards = Object.keys(counts); // ['jci', 'Gahar', 'iso']
  
    questions.forEach((question) => {
      const category = question.category || 'ALL';
      const standard = categoryToStandard[category];
  
      if (category === 'ALL') {
        // Use schemeBadge for 'ALL' category
        const schemeBadge = question.schemeBadge;
        const targetStandard = categoryToStandard[schemeBadge];
        
        if (!targetStandard || !allStandards.includes(targetStandard)) return;
  
        if (question.selectedOption === 'Met') {
          counts[targetStandard].met += 1;
        } else if (question.selectedOption === 'Partially Met') {
          counts[targetStandard].partially += 1;
        } else if (question.selectedOption === 'Not Met') {
          counts[targetStandard].notMet += 1;
        }
      } else if (category === 'Recommendation Prediction') {
        // Handle based on source for Recommendation Prediction
        const sources = Array.isArray(question.source) ? question.source : [];
        const questionStandards = sources
          .map((src) => sourceToStandard[src])
          .filter((std) => std && allStandards.includes(std));
  
        if (questionStandards.length === 0) return;
  
        if (question.selectedOption === 'Met') {
          questionStandards.forEach((std) => {
            counts[std].met += 1;
            counts[std].notMet -= 1;
            if (counts[std].notMet < 0) counts[std].notMet = 0; // Clamp to 0
          });
        } else if (question.selectedOption === 'Partially Met') {
          questionStandards.forEach((std) => {
            counts[std].partially += 1;
          });
        } else if (question.selectedOption === 'Not Met') {
          questionStandards.forEach((std) => {
            counts[std].notMet += 1;
          });
        }
      } else if (standard && allStandards.includes(standard)) {
        // Basic counting for GAHAR, JCI Laboratory, ISO 15189-2022
        if (question.selectedOption === 'Met') {
          counts[standard].met += 1;
        } else if (question.selectedOption === 'Partially Met') {
          counts[standard].partially += 1;
        } else if (question.selectedOption === 'Not Met') {
          counts[standard].notMet += 1;
        }
      }
    });
  
    return counts;
  };
  const handleSubmit = async () => {
    const questionsToSubmit = selectedQuestions.filter((q) => q.selectedOption === 'Met');
    const allQuestions = questionsToSubmit.map((q) => q.question).join(', ');
  
    // Calculate counts for each standard
    const standardCounts = calculateStandardCounts(selectedQuestions);
    console.log(standardCounts);
  
    setSendingStatus('loading');
    setStatusMessage('');
    try {
       const response = await fetch('https://abdelrahman12012-scorelab.hf.space/calculate_scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(standardCounts), // Include standards counts
       });
  
      if (!response.ok) throw new Error('Network response was not ok');
  
      const data = await response.json();
      console.log(data);
  
      setTimeout(() => {
         setSendingStatus('success');
         setStatusMessage('Your submission was successful!');
       });
      sessionStorage.removeItem('selectedQuestions');
      navigate('/result', { state: { results: data, selectedQuestions, standards: standardCounts } });
    } catch (error) {
      setTimeout(() => {
        setSendingStatus('error');
        setStatusMessage('An error occurred while submitting.');
      });
      console.error('Error submitting data:', error);
    }
  };

  const handleCloseStatus = () => {
    setSendingStatus(null);
    setStatusMessage('');
  };

  const handleBack = () => {
    navigate('/recommend', { state: { selectedQuestions } });
  };

  return (
    <>
      <NavBar exportDatainExcel={()=>exportDatainExcel(auditData,selectedQuestions)} title="Review Selected Questions" onBack={handleBack} onSubmit={handleSubmit} questionNum={selectedQuestions.length} 
       selectGen={selectedGeneration}  setSelectGen={setSelectedGeneration} /> 
      <div className="bg-gradient-to-r from-indigo-50 to-blue-100 min-h-[90vh] p-10 mt-16">

      <div className="flex flex-col space-y-8">
          {selectedQuestions.map((question, index) => (
            <ReviewCard
              key={index}
              questionData={question}
              index={index}
              onDelete={handleDelete}
              handleOptionSelect={handleOptionSelect}
            />  
          ))}
      </div>
        <SendingStatus status={sendingStatus} onClose={handleCloseStatus} message={statusMessage} />

      </div>
    </>
  );
};

export default Review;
