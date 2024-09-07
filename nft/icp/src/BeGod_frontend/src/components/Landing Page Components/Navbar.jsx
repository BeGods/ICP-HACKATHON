import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes } from 'react-icons/fa';
import { RxCross2 } from "react-icons/rx";
import { Link } from 'react-router-dom';

const Navbar = ({ mobileView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [lang, setLang] = useState('en'); // Default to English
    const [modal , setModal] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        mobileView();
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const toggleModal = () => {
        setModal(!modal);
    }

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
                <button onClick={toggleMenu} className='mr-8 z-30'>
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
                    {/* <div className='w-[35%] flex gap-8 mr-12 pt-2'>
                        <Link to="/profile" className='flex items-center bg-[#FCD37B] text-black font-[500] justify-center text-lg border-[2px] border-gray-200 w-[100%] h-[5vh]'>{t('button')}</Link>
                    </div> */}
                      <div className='w-[35%] h-[50px] flex gap-8 mr-12 pt-2'>
                        <button  className='flex items-center bg-[#FCD37B] text-black font-[500] justify-center text-lg border-[2px] border-gray-200 w-[100%] h-[100%]' onClick={toggleModal}>{t('button')}</button>
                    </div>
                </div>
            </div>

            

            {/* Mobile Menu */}
            {isOpen && (
                <div className='absolute pt-24 top-0 left-0 bottom-0 w-full h-screen bg-black bg-opacity-70 backdrop-blur-lg text-white flex flex-col items-center gap-8 py-8 z-0 md:hidden'>
                    <Link to="/" className='text-[24px] font-[400] leading-[30px]'>
                        {t('nav1')}
                    </Link>
                    <div className='text-[24px] font-[400] leading-[30px]'>
                        {t('nav2')}
                    </div>
                    {/* <Link to="/profile" className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md'>
                        {t('button')}
                    </Link> */}
                      <div  className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md' onClick={toggleModal}>
                        {t('button')}
                    </div>
                </div>
            )}

            
            {modal && (
                        <div className='w-screen h-screen top-0 bottom-0 left-0 right-0 fixed'>
                            <div className='w-screen h-screen top-0 bottom-0 left-0 right-0 fixed bg-[rgba(49,49,49,0.8)]'>
                                    <div className='h-screen flex justify-center items-center'>
                                         <div className='w-[80vw] h-[50vh] md:h-[35vh] lg:h-[33vh] xl:h-[55vh] sm:w-[50vw] lg:w-[35vw] 2xl:w-[25vw] bg-gray-800 rounded-md border-2 border-[white] p-[20px] font-Roboto   md:p=[30px] overflow-auto  '> 
                                         <div className="flex justify-end items-center">
                                            <button className="text-[#ffffff]" onClick={() => toggleModal()}>
                                                <RxCross2 size={25} />
                                            </button>
                                         </div>
                                            <h1 className='text-center text-[25px] md:text-[30px] m-0 font-Roboto'>Connect Wallet</h1>
                                            <div className='flex flex-col h-[70%] overflow-y-auto'> 
                                                <button className='pl-3 mt-5 h-[40px] w-full bg-gray-700 rounded-lg flex justify-start items-center text-[16px] sm:text-[20px] hover:text-slate-200 '><span className='mr-4'><img src="https://i.ibb.co/8gNN3v1/icp.png" className='size-8 rounded-full' /></span> Internet Identity</button>
                                                <button className='pl-3 mt-5 h-[40px] w-full bg-gray-700 rounded-lg flex justify-start items-center text-[16px] sm:text-[20px]  hover:text-slate-200  '><span className='mr-4'><img src="https://i.ibb.co/Y8ZMXhn/image.png" className='size-8 rounded-full' /></span>Nfid</button>
                                                <button className='pl-3 mt-5 h-[40px] w-full bg-gray-700 rounded-lg flex justify-start items-center text-[16px] sm:text-[20px]  hover:text-slate-200  '><span className='mr-4'><img src="https://i.ibb.co/sm6rrPD/image.png" className='size-8 rounded-full' /></span>Bifinity</button>
                                                <button className='pl-3 mt-5 h-[40px] w-full bg-gray-700 rounded-lg flex justify-start items-center text-[16px] sm:text-[20px]  hover:text-slate-200 '><span className='mr-4'><img src="https://docs.plugwallet.ooo/imgs/logo.png" className='size-8 rounded-full' /></span>Plug</button>
                                            </div> 

                                         </div>
                                    </div>
                            </div>      

                        </div>
                    )}
            
          
            
        </div>
    );
};

export default Navbar;
