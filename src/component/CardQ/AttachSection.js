import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaTimes, FaUpload, FaCamera, FaFile } from 'react-icons/fa';

const AttachmentSection = ({ attachments, onAddAttachment, onDeleteAttachment }) => {
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  
  const toggleUploadVisibility = (event) => {
    event.stopPropagation();
    setIsUploadVisible(!isUploadVisible);
  };

  const handleFileSelection = (file) => {
    if (file) {
      onAddAttachment(file);
      setIsUploadVisible(false);
    }
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    const objectURLs = attachments
      .filter((file) => file instanceof File || file instanceof Blob)
      .map((file) => URL.createObjectURL(file));
    return () => {
      objectURLs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [attachments]);

  return (
    <div className="mt-3">
      {/* <button
        className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-lg hover:bg-gray-600 transition-colors"
        onClick={toggleUploadVisibility}
      >
        {isUploadVisible ? <FaTimes /> : <FaUpload />}
        <span>{isUploadVisible ? 'Cancel' : 'Add Attachment'}</span>
      </button> */}

      { (
        <div className="mt-3 flex gap-2">
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={(e) => handleFileSelection(e.target.files[0])}
            className="hidden"
            onClick={(e) => e.stopPropagation()}
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 cursor-pointer border border-gray-300 hover:to-blue-700 hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600  text-white rounded-lg p-2 px-4 hover:border-green-500 transition-all"
          >
            <FaUpload className="text-white" />
            <span className="text-white  font-medium">Upload File</span>
          </label>
        </div>
      )}

      {/* Display uploaded files */}
      {/* <div>
        {attachments?.length > 0 ? (
          attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-full p-4 border rounded-lg shadow-md bg-gray-50 mb-2"
            >
              <div className="flex items-center space-x-2">
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="attachment"
                    className="w-[50px] h-[50px] object-cover rounded border border-gray-300 shadow-md"
                  />
                ) : (
                  <FaUpload className="text-gray-500" />
                )}
                <span className="text-gray-700 truncate border-b-2 border-gray-300 pb-1 font-medium">
                  {file.name.length > 10 ? `${file.name.slice(0, 10)}...` : file.name}
                </span>
              </div>
              <button
                onClick={() => onDeleteAttachment(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No attachments yet.</p>
        )}
      </div> */}

      {/* Attachment List */}
      <div className="mt-4 flex  gap-[30px]">
        {attachments.length > 0 ? (
          attachments.map((file, index) => {
            const isFileObject = file instanceof File || file instanceof Blob;
            const fileName = isFileObject ? file.name : file.name || `Attachment ${index + 1}`;
            const isImage = isFileObject && file.type.startsWith('image/');
            const previewURL = isImage ? URL.createObjectURL(file) : null;

            return (
              <div
  key={index}
  className="relative flex items-center justify-between w-full max-w-[280px] overflow-x-hidden p-3 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-xl shadow-md hover:bg-blue-200 transition-all duration-300 ease-in-out animate-slideIn"
>
  <div className="flex flex-col items-start space-y-2">
    {isImage && previewURL ? (
      <img
        src={previewURL}
        alt={`Attachment ${fileName}`}
        className="w-10 h-10 object-cover rounded-md border border-gray-300 shadow-sm"
        onError={() => console.error(`Failed to load image: ${fileName}`)}
      />
    ) : (
      <FaFile className="text-blue-600 text-lg" />
    )}
    <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
      {fileName.length > 18 ? `${fileName.slice(0, 18)}...` : fileName}
    </span>
  </div>
  <button
    onClick={() => onDeleteAttachment(index)}
    className="absolute top-2 right-2 p-1.5 text-red-600 hover:text-red-800 hover:scale-125 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded-full"
    aria-label={`Delete attachment ${fileName}`}
  >
    <FaTrash className="text-base" />
  </button>
</div>

              
              
            );
          })
        ) : (
          <p className="text-gray-500 text-base">No attachments yet.</p>
        )}
      </div>
    </div>
  );
};

export default AttachmentSection;
