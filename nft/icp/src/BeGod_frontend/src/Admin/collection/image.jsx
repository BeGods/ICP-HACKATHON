import React, { useState } from 'react';
import { RiFolder6Line, RiDeleteBinLine } from 'react-icons/ri'; // Importing file and delete icons from react-icons

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = React.createRef();
  const [hideUpload, setHideUpload] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setHideUpload(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setHideUpload(false);
  };

  return (
    <div>
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        style={{ display: 'none' }} 
      />
      
      {/* Custom File Upload Button */}
      <div 
        className="image_upload_container pl-4 w-[100%] h-[20px] md:h-[30px] bg-[#29292C] rounded-md flex items-center justify-center"
        hidden={hideUpload}
      >
        <RiFolder6Line className="cursor-pointer" onClick={handleIconClick} />
      </div>

      {/* Display Selected Image with Delete Button */}
      {selectedImage && (
        <div className="relative w-[70px] h-[100px] mt-3 mb-3">
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 bg-white rounded-full w-6 h-6 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
          >
            <RiDeleteBinLine className="text-black" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
