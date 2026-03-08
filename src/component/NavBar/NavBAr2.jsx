import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaRedo } from 'react-icons/fa';

const NavBar = ({ title, showBackButton, showConfirmButton ,showRestartButton }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleConfirm = () => {
    // Trigger custom event for confirm action
    const event = new CustomEvent('navbar-confirm-clicked');
    window.dispatchEvent(event);
  };

  const handleRestart = () => {
    // Trigger custom event for restart action
    const event = new CustomEvent('navbar-restart-clicked');
    window.dispatchEvent(event);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="mr-4 p-2 rounded-full hover:bg-blue-500 transition-colors duration-200"
              >
                <FaArrowLeft className="text-white" />
              </button>
            )}
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {showConfirmButton && (
              <>
                <button
                  onClick={handleRestart}
                  className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                  <FaRedo className="mr-1" />
                  <span className="hidden sm:inline">Restart</span>
                </button>
                
                <button
                  onClick={handleConfirm}
                  className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                >
                  <FaCheck className="mr-1" />
                  <span className="hidden sm:inline">Confirm</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;