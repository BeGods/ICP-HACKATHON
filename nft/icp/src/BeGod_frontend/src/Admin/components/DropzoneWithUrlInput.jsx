import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DropzoneWithUrlInput = () => {
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [inputType, setInputType] = useState(''); // 'file' or 'url'

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
        setUrl('');
        setInputType('file');
    };

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
        setFile(null);
        setInputType('url');
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
