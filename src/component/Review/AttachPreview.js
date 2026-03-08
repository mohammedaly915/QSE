// AttachmentPreview.js
import React, { useEffect } from 'react';
import { FaFile, FaUpload } from 'react-icons/fa';

const AttachmentPreview = ({ attachments }) => {
  console.log("review",attachments);
  
  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    const objectURLs = attachments
      .filter((file) => file instanceof File || file instanceof Blob)
      .map((file) => URL.createObjectURL(file));
    return () => {
      objectURLs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [attachments]);
  return(
  <div className="mt-4 flex gap-[10px]">
   {/* <div className='flex gap-[10px]'>
        {attachments?.length > 0 ? (
          attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center  justify-between w-[100px] overflow-hidden  p-2 border rounded-lg shadow-md bg-gray-50 mb-2"
            >
              <div className="flex flex-column items-center">
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="attachment"
                    className="w-full h-[50px] object-cover rounded border border-gray-300 shadow-md"
                  />
                ) : (
                  <FaUpload className="text-gray-500" />
                )}
                <span className="text-gray-700 truncate border-b-2 border-gray-300 pb-1 font-medium">
                  {file.name.length > 10 ? `${file.name.slice(0, 10)}...` : file.name}
                </span>
              </div>
              
            </div>
          ))
        ) : (
          <p className="text-gray-500">No attachments yet.</p>
        )}
      </div> */}
      {attachments.length > 0 ? (
          attachments.map((file, index) => {
            const isFileObject = file instanceof File || file instanceof Blob;
            const fileName = isFileObject ? file.name : file.name || `Attachment ${index + 1}`;
            const isImage = isFileObject && file.type.startsWith('image/');
            const previewURL = isImage ? URL.createObjectURL(file) : null;

            return (
              <div
  key={index}
  className="flex items-center justify-start  min-w-[100px] max-w-[200px] overflow-hidden p-3 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl shadow-sm hover:bg-gray-300 transition-all duration-300 ease-in-out animate-slideIn mb-2"
>
  <div className="flex flex-col items-center space-y-2">
    {isImage && previewURL ? (
      <img
        src={previewURL}
        alt={`Attachment ${fileName}`}
        className="w-10 h-10 object-cover rounded-md border border-gray-400 shadow-sm"
        onError={() => console.error(`Failed to load image: ${fileName}`)}
      />
    ) : (
      <FaFile className="text-gray-600 text-lg" />
    )}
    <span className="text-sm font-semibold text-gray-800 truncate max-w-[260px]">
      {fileName.length > 20 ? `${fileName.slice(0, 20)}...` : fileName}
    </span>
  </div>
</div>
            );
          })
        ) : (
          <p className="text-gray-500 text-base">No attachments yet.</p>
        )}
  </div>
);
}

export default AttachmentPreview;
