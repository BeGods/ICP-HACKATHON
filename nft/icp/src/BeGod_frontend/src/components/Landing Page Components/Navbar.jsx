import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';

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
        <div className='w-full h-[10vh] flex items-center justify-between text-white px-4 md:px-8'>
            <div className='flex items-center gap-4'>
                <button onClick={toggleMenu} className='md:hidden'>
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
                <h1 className='md:hidden text-2xl font-bold'>Logo</h1>
            </div>
            <div className='flex items-center gap-4'>
                <button onClick={toggleSearch} className='md:hidden'>
                    <FaSearch size={24} />
                </button>
                {showSearch && (
                    <input
                        type="text"
                        placeholder={t('input')}
                        className='fixed top-[12vh] right-4 w-[80vw] h-[4vh] pl-4 text-white bg-black bg-opacity-80 border-[2px] border-gray-200 rounded-md'
                    />
                )}
            </div>
            <div className='w-full h-[10vh] hidden md:flex items-center justify-between text-white'>
                <div className='flex gap-[20vw] pt-8'>
                    <div className='text-[24px] font-[400] leading-[30px] text-[#FFFFFF] pl-20'>
                        {t('title')}
                    </div>
                    <div className='flex items-center gap-[5vw] -ml-40'>
                        <div className='text-[24px] font-[400] leading-[30px] text-[#FFFFFF]'>
                            {t('nav1')}
                        </div>
                        <div className='text-[24px] font-[400] leading-[30px] text-[#FFFFFF]'>
                            {t('nav2')}
                        </div>
                    </div>
                </div>
                <div className='flex gap-8 mr-12 pt-8'>
                    <input type="text" placeholder={t('input')} className='w-[20vw] h-[5vh] pl-4 text-white bg-inherit border-[2px] border-gray-200' />
                    <button className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[20vw] h-[5vh]'>{t('button')}</button>
                </div>
                <select onChange={(e) => setLang(e.target.value)} className='bg-inherit flex items-center justify-center text-lg border-[2px] border-gray-200 w-[5vw] h-[5vh] mt-8'>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="fr">French</option>
                    <option value="ar">Arabic</option>
                    <option value="es">Spanish</option>
                </select>
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
