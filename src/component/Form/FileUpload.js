import React from 'react';

const FileUpload = ({ file, label, handleFileUpload, fileType, Icon }) => {
  const isExcelFile = (file) => file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file?.type === 'application/vnd.ms-excel';

  return (
    <div className="flex items-center justify-between w-full border p-4 rounded-lg shadow-md bg-white transition-transform duration-300 mb-4">
      <input
        type="file"
        id={fileType}
        accept=".xlsx, .xls"
        onChange={(e) => handleFileUpload(e)}
        className="hidden"
      />
      <label
        htmlFor={fileType}
        className="flex items-center space-x-2 cursor-pointer border border-gray-300 rounded-lg p-2 transition-transform duration-300 hover:border-primeColor hover:scale-105"
      >
        {Icon}
        {label}
      </label>

      {file && (
        <div className="flex items-center gap-[5px] space-x-2">
          <span className="text-gray-700 truncate border-b-2 border-gray-300 pb-1 font-medium">
            {file.name && file.name.length > 10 ? `${file.name.slice(0, 10)}...` : file.name}
          </span>
          {isExcelFile(file) && (
            <span className="text-xs text-green-600 font-medium">Valid Excel File</span>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
