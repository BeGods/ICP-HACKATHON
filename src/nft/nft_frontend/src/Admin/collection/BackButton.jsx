import React from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();
    
    return (
        <div>
            <MdOutlineKeyboardBackspace 
                onClick={() => navigate(-1)}  // Pass a function that calls navigate
                className='w-16 h-8 cursor-pointer text-[#f1f1f1] z-1 relative' 
            />
        </div>
    );
}

export default BackButton;
