import React from 'react';
import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineExport, AiOutlineFileExcel, AiOutlineReload } from 'react-icons/ai';

const NavBar = ({ title, onConfirm, onBack, showConfirm, onRestart, onSubmit, questionNum, exportDatainExcel,selectGen, setSelectGen }) => {
  console.log("number", questionNum);

  return (
    <div className="fixed top-0 left-0 right-0 w-full flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg z-50 animate-fadeIn">
      <div className="flex items-center gap-[10px] ">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-lg font-semibold bg-blue-800/80 hover:bg-blue-800 rounded-md px-3 py-2 transition-all duration-200 hover:scale-105 focus:outline-none"
            aria-label="Go back"
          >
            <AiOutlineArrowLeft/>
          </button>
        )}

        <div className="flex items-center gap-[10px]">
        <h1 className="text-xl font-bold mb-[0] tracking-tight">{title}</h1>
        {questionNum > 0 && (
          <span
            className="bg-blue-500 text-white text-md font-semibold px-2.5 py-1 rounded transition-all duration-200 hover:bg-blue-600"
            aria-label={`Number of selected questions: ${questionNum}`}
          >
            {questionNum}
          </span>
        )}
      </div>
        
      </div>
      
      <div className="flex items-center space-x-4">
        {/* {selectGen && (
          <div className="flex items-center bg-blue-800 rounded-lg px-3 py-1.5 shadow-sm">
            <label htmlFor="gen-select" className="text-sm font-medium text-white mr-2">
              Gen:
            </label>
            <select
              id="gen-select"
              value={selectGen}
              onChange={(e) => setSelectGen(e.target.value)}
              className="bg-blue-900 text-white text-sm focus:outline-none rounded-md border-none out p-1 transition-all duration-200"
              aria-label="Select generation"
            >
              {[1, 2, 3].map((gen) => (
                <option key={gen} value={gen} className="bg-blue-900 border-none rounded focus:outline-none text-white">
                  {gen}
                </option>
              ))}
            </select>
          </div>
        )} */}

        {onRestart && (
          <button
            onClick={onRestart}
            className="flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            aria-label="Restart selection"
          >
            <AiOutlineReload className="mr-2 " />
            
            <span className='max-[480px]:hidden'>Restart</span> 

          </button>
        )}
        {showConfirm && (
          <button
            onClick={onConfirm}
            className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            aria-label="Confirm selection"
          >
            <AiOutlineCheckCircle className="mr-2 " />
            <span className='max-[480px]:hidden'>Confirm</span> 

          </button>
        )}
        {onSubmit && (
          <button
            onClick={onSubmit}
            className="flex items-center  bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            aria-label="Submit selection"
          >
            <AiOutlineCheckCircle className="mr-2 " />
           <span className='max-[480px]:hidden'>Submit</span> 
          </button>
        )}

        {onSubmit && (
          <button
            onClick={exportDatainExcel}
            className="flex items-center  bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            aria-label="Submit selection"
          >
            <AiOutlineFileExcel className="mr-2 " />
           <span className='max-[480px]:hidden'>Export</span> 
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;