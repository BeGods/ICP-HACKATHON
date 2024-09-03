import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = ({ mobileView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [lang, setLang] = useState('en'); // Default to English

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        mobileView();
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const { i18n, t } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(lang); // Change language when `lang` changes
    }, [lang, i18n]);

    return (
        <div style={{ fontFamily: "CaslonAntique" }} className='max-w-[1920px] mx-auto w-full h-[10vh] flex items-center justify-between text-white relative'>
            {/* Mobile View */}
            <div className='md:hidden w-full flex items-center justify-between gap-4 relative'>
                <Link to="/" className='flex md:hidden pt-20'>
                    <img src="/Hero/logo.png" alt="" />
                </Link>
                <button onClick={toggleMenu} className='mr-8 z-50'>
                    {isOpen ? <FaTimes size={36} /> :<img src='/Hero/hamburger.png' className='h-12'/>}
                </button>

            </div>

            {/* Desktop View */}
            <div className='max-w-[1920px] mx-auto w-full h-[10vh] hidden md:flex items-center justify-between text-white'>
                <Link to="/" className='pt-20'>
                    <img src="/Hero/logo.png" alt="" />
                </Link>
                <div className='w-[60%] lg:w-[35%] flex justify-between'>
                    <Link to="" className='pt-4 text-[24px] font-[500] leading-[28.92px] text-[#FCD37B]'>Collection</Link>
                    <Link to="" className='pt-4 text-[24px] font-[500] leading-[28.92px] text-[#FCD37B]'>符 ENG</Link>
                    <div className='w-[35%] flex gap-8 mr-12 pt-2'>
                        <Link to="/profile" className='flex items-center bg-[#FCD37B] text-black font-[500] justify-center text-lg border-[2px] border-gray-200 w-[100%] h-[5vh]'>{t('button')}</Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className='absolute pt-24 top-0 left-0 w-full h-screen bg-black bg-opacity-70 backdrop-blur-lg text-white flex flex-col items-center gap-8 py-8 z-40 md:hidden'>
                    <Link to="/" className='text-[24px] font-[400] leading-[30px]'>
                        {t('nav1')}
                    </Link>
                    <div className='text-[24px] font-[400] leading-[30px]'>
                        {t('nav2')}
                    </div>
                    <Link to="/profile" className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md'>
                        {t('button')}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Navbar;
