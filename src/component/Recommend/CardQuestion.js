import React, { useState } from 'react';
// import CardHeader from '../CardQ/CardHeader';
// import OptionButtons from '../CardQ/OptionButtons';
import NoteSection from '../CardQ/NoteSection';
import AttachmentSection from '../CardQ/AttachSection'; // Import AttachmentSection
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import OptionButtons from '../OptionButton/OptionButtons';
import QuestionHeader from '../OptionButton/QuestionHeader';

const CardQuestion = ({ question, isSelected, onSelect, notes = [], attachments = [], categoryColor, option }) => {
  const [selectedOption, setSelectedOption] = useState(question.selectedOption || '');
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [isAttachmentsVisible, setIsAttachmentsVisible] = useState(false);
  ;
  
  const handleOptionSelect = (option, event) => {
    event.stopPropagation();
    setSelectedOption(option);
    onSelect(question, true, option, notes, attachments);
  };

  const handleToggleVisibility = (type) => {
    if (type === 'notes') setIsNotesVisible(!isNotesVisible);
    if (type === 'attachments') setIsAttachmentsVisible(!isAttachmentsVisible);
  };
// notes 
  const handleAddNote = (newNote) => {
    const updatedNotes = [...notes, newNote];
    onSelect(question, true, selectedOption, updatedNotes, attachments);
  };

  const handleDeleteNote = (noteIndex) => {
    const updatedNotes = notes.filter((_, i) => i !== noteIndex);
    onSelect(question, true, selectedOption, updatedNotes, attachments);
  };
  // attachment 

  const handleAddAttachment = (newAttachment) => {
    const updatedAttachments = [...attachments, newAttachment];
    onSelect(question, true, selectedOption, notes, updatedAttachments);
  };

  const handleDeleteAttachment = (attachmentIndex) => {
    const updatedAttachments = attachments.filter((_, i) => i !== attachmentIndex);
    onSelect(question, true, selectedOption, notes, updatedAttachments);
  };
 
  return (
    <div className={`relative w-full p-4 rounded-md shadow-md flex flex-col space-y-3 transition-all ${isSelected ? 'bg-blue-100' : ''}`}>
      <div className={`absolute inset-y-0 left-0 w-1`} style={{ backgroundColor: categoryColor }}></div>


      <QuestionHeader variant="recommend" question={question} isSelected={isSelected} handleSelect={() => onSelect(question, !isSelected, selectedOption, notes, attachments)}/>  
      <OptionButtons variant="recommend" option={selectedOption} selectedOption={selectedOption} handleSelect={() => onSelect(question, !isSelected, selectedOption, notes, attachments)} handleOptionSelect={handleOptionSelect}/>
      {isSelected && ( 
        <div>
          {/* Toggle Notes Section */}
          <button
  className="mt-2 flex items-center space-x-2 text-blue-600 hover:text-blue-800"
  onClick={() => handleToggleVisibility('notes')}
>
  {isNotesVisible ? <FaChevronUp /> : <FaChevronDown />}
  {/* <span>{isNotesVisible ? 'Hide Notes' : 'Show Notes'} {notes.length}</span> */}
  <span>Notes</span>
            { (
              <span className="ml-2 bg-blue-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {notes.length}
              </span>)}
</button>

          {isNotesVisible && (
            <NoteSection
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {/* Toggle Attachments Section */}
          <button
            className="mt-2 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            onClick={() => handleToggleVisibility('attachments')}
          >
            {isAttachmentsVisible ? <FaChevronUp /> : <FaChevronDown />}
            {/* <span>{isAttachmentsVisible ? 'Hide Attachments' : 'Show Attachments'}{attachments.length}</span> */}
            <span>Attachments</span>
            { (
              <span className="ml-2 bg-teal-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {attachments.length}
              </span>)}
          </button>

          {isAttachmentsVisible && (
            <AttachmentSection
              attachments={attachments}
              onAddAttachment={handleAddAttachment}
              onDeleteAttachment={handleDeleteAttachment}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CardQuestion;
