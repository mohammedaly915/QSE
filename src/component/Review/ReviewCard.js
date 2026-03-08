// QuestionCard.js
import React from 'react';
import { FaTrashAlt, FaFrown, FaMeh, FaSmile } from 'react-icons/fa';
// import OptionButton from './OptionButton';
import AttachmentPreview from './AttachPreview';
import NotesSection from './NotesSection';
import OptionButtons from '../OptionButton/OptionButtons';
import QuestionHeader from '../OptionButton/QuestionHeader';

const categoryColors = {
  QSE: '#34D399', 
  GAHAR: '#FBBF24',
  JCI: '#3B82F6',
  ISO: '#F97316',
};

const ReviewCard = ({ questionData, index, onDelete, handleOptionSelect }) => {
  const categoryColor = categoryColors[questionData.category] || 'gray';

  return (
    <div className="relative w-full p-6 rounded-lg shadow-lg bg-white hover:shadow-2xl transition-all transform duration-300 ease-in-out flex flex-col space-y-6">
      {/* Question header part */}
      {/* <div className="flex items-start justify-between p-4 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4 flex-grow">
          <span className="text-[16px] text-start font-semibold text-gray-800 block leading-relaxed">
            {questionData.question}
          </span>
        </div>
        <button className="ml-4 p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors" onClick={() => onDelete(index)}>
          <FaTrashAlt className="text-red-500 hover:text-red-800 text-xl" />
        </button>
      </div> */}
      
      <QuestionHeader variant="review" question={questionData} index={index} onDelete={onDelete} />
      {/* Category and Tab Info */}
      <div className="flex justify-between px-8 text-md">
        <p>Category: <strong style={{ color: categoryColor }}>{questionData.category}</strong></p>
        <p>Tab: <strong style={{ color: categoryColor }}>{questionData.tab}</strong></p>
      </div>

      
      {/* Option Selection Buttons */}
      <div className="flex justify-around mt-4">
          {/* <OptionButton label="Not Met" icon={<FaFrown className="text-red-600" />} isActive={questionData.selectedOption === 'Not Met'} onClick={() => onOptionSelect(index, 'Not Met')} color="red" />
          <OptionButton label="Partially Met" icon={<FaMeh className="text-yellow-600 " />} isActive={questionData.selectedOption === 'Partially Met'} onClick={() => onOptionSelect(index, 'Partially Met')} color="yellow"  /> */}
          {/* <OptionButton label="Met" icon={<FaSmile className="text-green-600" />} isActive={questionData.selectedOption === 'Met'} onClick={() => onOptionSelect(index, 'Met')} color="green" /> */}
        <OptionButtons variant="review" label="Not Met" icon={<FaFrown className="text-red-500" />} isActive={questionData.selectedOption === 'Not Met'} onClick={() => handleOptionSelect(index,'Not Met')} color="red"/>
        <OptionButtons variant="review" label="Partially Met" icon={<FaMeh className="text-yellow-500" />} isActive={questionData.selectedOption === 'Partially Met'} onClick={() => handleOptionSelect(index,'Partially Met')} color="yellow"/>
        <OptionButtons variant="review" label="Met" icon={<FaSmile className="text-green-500" />} isActive={questionData.selectedOption === 'Met'} onClick={() => handleOptionSelect(index,'Met')} color="green"/>
      </div>

      {/* Notes Section */}
      {questionData.notes && <NotesSection notes={questionData.notes} categoryColor={categoryColor} />}

      {/* Attachments Section */}
      {questionData.attachments && questionData.attachments.length > 0 && (
        <AttachmentPreview attachments={questionData.attachments} />
      )}

    </div>
  );
};

export default ReviewCard;
