import React, { useState } from 'react';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    return (
        <div className='w-full h-[10vh] flex items-center justify-between text-white px-4 md:px-8'>
            <div className='flex items-center gap-4'>
                {/* Hamburger Menu */}
                <button onClick={toggleMenu} className='md:hidden'>
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                {/* Logo */}
                <h1 className='md:hidden text-2xl font-bold'>Logo</h1>
            </div>

            {/* Search Icon */}
            <div className='flex items-center gap-4'>
                <button onClick={toggleSearch} className='md:hidden'>
                    <FaSearch size={24} />
                </button>

                {/* Search Input (hidden by default on mobile) */}
                {showSearch && (
                    <input
                        type="text"
                        placeholder='Search'
                        className='fixed top-[12vh] right-4 w-[80vw] h-[4vh] pl-4 text-white bg-black bg-opacity-80 border-[2px] border-gray-200 rounded-md'
                    />
                )}

                {/* Search Input for Desktop */}

            </div>

            {/* Desktop Menu */}
            <div className='w-full h-[10vh] hidden md:flex items-center justify-between text-white'>
                <div className='flex gap-[20vw] pt-8'>
                    <div style={{ fontFamily: 'MyCustomFont' }} className='text-[24px] font-[400] leading-[30px] text-[#FFFFFF] pl-20'>
                        Logo
                    </div>
                    <div className='flex items-center gap-[5vw] -ml-40'>
                        <div style={{ fontFamily: 'MyCustomFont' }} className='text-[24px] font-[400] leading-[30px] text-[#FFFFFF]'>
                            Home
                        </div>
                        <div style={{ fontFamily: 'MyCustomFont' }} className='text-[24px] font-[400] leading-[30px] text-[#FFFFFF]'>
                            Collection
                        </div>
                    </div>
                </div>
                <div className='flex gap-8 mr-12 pt-8'>
                    <input type="text" placeholder='Search' className='w-[20vw] h-[5vh] pl-4 text-white bg-inherit border-[2px] border-gray-200' />
                    <button style={{ fontFamily: 'MyCustomFont' }} className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[20vw] h-[5vh]'>Connect Wallet</button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className='absolute top-[10vh] left-0 w-full h-screen bg-black bg-opacity-70 backdrop-blur-lg text-white flex flex-col items-center gap-8 py-8 md:hidden z-10'>
                    <div style={{ fontFamily: 'MyCustomFont' }} className='text-[24px] font-[400] leading-[30px]'>
                        Home
                    </div>
                    <div style={{ fontFamily: 'MyCustomFont' }} className='text-[24px] font-[400] leading-[30px]'>
                        Collection
                    </div>
                    <button
                        style={{ fontFamily: 'MyCustomFont' }}
                        className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md'
                    >
                        Connect Wallet
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
