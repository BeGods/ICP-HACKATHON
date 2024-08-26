import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DropzoneWithUrlInput = ({ onFileChange }) => {
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [inputType, setInputType] = useState(''); // 'file' or 'url'

    const onDrop = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0]; // Capture the accepted file
        setFile(selectedFile);
        setUrl('');
        setInputType('file');
        onFileChange(selectedFile); // Pass the selected file to the parent
    };

    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        setFile(null);
        setInputType('url');
        onFileChange(newUrl); // Pass the URL to the parent
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*', // Adjust the accepted file types as needed
        noClick: inputType === 'url', // Disable file click if URL input is active
    });

    return (
        <div className="w-full h-[130px] md:h-auto rounded-md flex flex-col items-center justify-center p-4 bg-[#29292C] text-white">
            <div
                {...getRootProps()}
                className={`w-full h-full flex items-center justify-center ${isDragActive ? 'bg-gray-700' : ''}`}
            >
                <input {...getInputProps()} />
                <p className="text-center">
                    {file
                        ? `Selected file: ${file.name}`
                        : 'Drag & drop an image here, or click to select one'}
                </p>
            </div>
            <p className="text-center my-2">OR</p>
            <input
                type="text"
                value={url}
                onChange={handleUrlChange}
                placeholder="Paste image URL here"
                className="w-full h-[40px] md:h-[50px] p-2 rounded-md bg-gray-700 placeholder-gray-400 text-white"
            />
            {url && <p className="text-sm mt-2">Using URL: {url}</p>}
        </div>
    );
};

export default DropzoneWithUrlInput;
