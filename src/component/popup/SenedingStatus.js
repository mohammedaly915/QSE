import React from 'react';

const SendingStatus = ({ status, message, onClose }) => {
  if (!status) return null;

  const handleClose = () => {
    if (onClose) {
      onClose(); // Call the onClose callback to reset status or handle closing
    }
  };

  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex items-center space-x-3">
            <div className="loader border-t-transparent border-blue-500 border-4 rounded-full w-8 h-8 animate-spin"></div>
            <span className="text-lg font-medium text-gray-800">Sending...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-lg font-medium text-gray-800">{message || 'Submission successful!'}</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span className="text-lg font-medium text-gray-800">{message || 'Submission failed!'}</span>
            </div>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              aria-label="Close error message"
            >
              Close
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-opacity duration-300"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full mx-4 transform scale-95 animate-fadeIn">
        {getStatusContent()}
      </div>
    </div>
  );
};

export default SendingStatus;