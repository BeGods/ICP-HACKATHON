import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [lang, setLang] = useState('en'); // Default to English

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const { i18n, t } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(lang); // Change language when `lang` changes
    }, [lang, i18n]);

    return (
        <div style={{fontFamily:"CaslonAntique"}} className='w-full h-[10vh] flex items-center justify-between text-white'>
            <div className='flex items-center gap-4'>
                <button onClick={toggleMenu} className='md:hidden'>
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
                <div className='flex sm:hidden pt-12'>
                    <img src="/Hero/logo.png" alt="" />
                </div>
            </div>
            <div className='w-full h-[10vh] hidden md:flex items-center justify-between text-white'>
                <div className='pt-12'>
                    <img src="/Hero/logo.png" alt="" />
                </div>
                <div className='w-[40%] flex justify-between'>
                    <Link to="" className='pt-4 text-[24px] font-[500] leading-[28.92px] text-[#FCD37B]'>Collection</Link>
                    <Link to="" className='pt-4 text-[24px] font-[500] leading-[28.92px] text-[#FCD37B]'>符 ENG</Link>
                    <div className='w-[35%] flex gap-8 mr-12 pt-2'>
                        <Link to="/profile" className='flex items-center bg-[#FCD37B] text-black font-[500] justify-center text-lg border-[2px] border-gray-200 w-[100%] h-[5vh]'>{t('button')}</Link>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className='absolute top-[10vh] left-0 w-full h-screen bg-black bg-opacity-70 backdrop-blur-lg text-white flex flex-col items-center gap-8 py-8 md:hidden z-10'>
                    <div className='text-[24px] font-[400] leading-[30px]'>
                        {t('nav1')}
                    </div>
                    <div className='text-[24px] font-[400] leading-[30px]'>
                        {t('nav2')}
                    </div>
                    <button className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md'>
                        {t('button')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
