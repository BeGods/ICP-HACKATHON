import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes } from 'react-icons/fa';
import { RxCross2 } from "react-icons/rx";
import { Link , useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuthClient';
import { FaUserLarge } from "react-icons/fa6";

import { useSelector } from 'react-redux';

const Navbar = ({ mobileView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [modal , setModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileDropDown , setProfileDropDown] = useState(false);
    const [connectWalletDropdown , setConnectWalletDropdown] = useState(false);

    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        mobileView();
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const toggleModal = () => {
        setModal(!modal);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    const toggleProfileDropDown = () => {
        setProfileDropDown(!profileDropDown);
    }
    const { i18n, t } = useTranslation();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const {logout ,login } = useAuth();

    const onClickLogout = async() => {
        await logout();
        navigate("/")
        
    }

    const toggleConnectWalletDropdown = () => {
        setConnectWalletDropdown(!connectWalletDropdown);
    }

    const changeLanguage = (newLang,newLangText) => {
        i18n.changeLanguage(newLang);
        setLanguage(newLangText)
      toggleDropdown();
    }
    
    
    // console.log("is Authenticated in Navbar Section" , isAuthenticated);

    const [currentLanguage,setLanguage] = useState(t('langText'));

    const languages = [
      { code: "en", lang: "English" },
      { code: "fr", lang: "français" },
      { code: "hi", lang: "हिन्दी" }
    ]; 

    const selectedLanguage  = i18n.language;

    console.log("selected language" ,selectedLanguage);


    return (
        <div  className='max-w-[1920px] mx-auto w-full h-[10vh] flex items-center justify-between text-white relative'>
            {/* Mobile View */}
            <div className='relative flex items-center justify-between w-full gap-4 md:hidden'>
                <Link to="/" className='flex pt-7 md:hidden'>
                    <img src="/Hero/logo.png" alt="" className='h-24 w-28' />
                </Link>
               <div className='flex items-center justify-between'>
                  <div className='relative  w-[130px] flex justify-center '>
                  <button
                          onClick={toggleDropdown}
                          className="text-[20px] font-[500] leading-[28.92px] pt-0.5 text-[#FCD37B] flex justify-center items-center mr-4"
                        >
                          {currentLanguage} <span className="ml-2 text-sm ">▼</span>
                        </button>
                        {dropdownOpen && (
                          <ul className="absolute left-0 mt-10 bg-slate-900 text-[#FCD378]  rounded shadow-lg w-36 p-0 list-none">
                              {languages.map((eachLang) => (
                                <li 
                                  key={eachLang.code} 
                                  className= {`px-4 py-2 hover:bg-purple-800 cursor-pointer ${selectedLanguage === eachLang.code && 'bg-purple-950'}`} 
                                  onClick={() =>changeLanguage(eachLang.code,eachLang.lang)}
                                 >
                                    {eachLang.lang}
                                  </li>
                                ))}
                          </ul>
                        )}
                  </div>
                      
                <button onClick={toggleMenu} className='z-30 mr-4'>
                    {isOpen ? <FaTimes size={36} /> :<img src='/Hero/hamburger.png' className='h-8'/>}
                </button>
               </div>

            </div>

            {/* Desktop View */}
            <div className='max-w-[1920px] mx-auto w-full h-[10vh] hidden md:flex items-center justify-between text-white font-caslon' >
                <Link to="/" className='pt-20'>
                    <img src="/Hero/logo.png" alt="" />
                </Link>
                <div className='p-5  flex space-x-5 items-center'>
                    <Link to="" className='pt-4 text-[24px] font-[500] leading-[28.92px] text-[#FCD37B]'>{t('collection')}</Link>

                    <li className='relative list-none pt-4 w-[130px] flex justify-center '>
                         <button
                          onClick={toggleDropdown}
                          className="text-[24px] font-[500] leading-[28.92px] pt-0.5 text-[#FCD37B] flex justify-center items-center"
                        >
                          {/* <span className='text-sm mr-1'>( {t('langText')} )</span>  */}
                          {currentLanguage} <span className="ml-2 text-sm ">▼</span>
                        </button>
                        {dropdownOpen && (
                          <ul className="absolute left-0 mt-10 bg-slate-900 text-[#FCD378]  rounded shadow-lg w-36 p-0 list-none">
                              {languages.map((eachLang) => (
                                <li 
                                  key={eachLang.code} 
                                  className= {`px-4 py-2 hover:bg-purple-800 cursor-pointer ${selectedLanguage === eachLang.code && 'bg-purple-950'}`} 
                                  onClick={() => {
                                    changeLanguage(eachLang.code)
                                    setLanguage(eachLang.lang)
                                  }}
                                 >
                                    {eachLang.lang}
                                  </li>
                                ))}
                          </ul>
                        )}
                    </li> 
                      {isAuthenticated ?  (
                       <nav className='relative list-none pt-4 w-[180px] h-[50px] flex justify-center items-center'>
                       <button
                        onClick={toggleProfileDropDown}
                        className="text-[24px] font-[500] leading-[28.92px] pt-0.5 h-full w-full rounded-sm text-white   flex justify-center items-center  bg-[#000000] border border-solid border-white"
                      >
                     <span className="mr-1"><FaUserLarge size={15} /></span> Dcd4-744
                      </button>
                      {profileDropDown && (
                        <ul className="absolute top-4 left-2 mt-10 bg-black text-[#FCD378]  rounded shadow-lg w-36 p-0 list-none">
                          <li to="/profile" className="px-4 py-2 cursor-pointer hover:bg-purple-900" onClick={() => navigate("/profile")}>
                            Profile
                          </li>
                          <hr style={{ backgroundColor: '#FCD378', height: '0.5px', border: 'none', width: '100%' }} />
                          <li className="px-4 py-2 cursor-pointer hover:bg-purple-900">
                            Activity
                          </li>
                          <hr style={{ backgroundColor: '#FCD378', height: '0.5px', border: 'none', width: '100%' }} />
                          <li className="px-4 py-2 cursor-pointer hover:bg-purple-900" onClick={onClickLogout}>
                            Logout
                          </li>
                        </ul>
                      )}
                  </nav> 
                        
                      ):(

                        <div className='relative min-w-[180px] h-[50px] flex gap-8 mr-12 pt-2 '>
                        <button className='flex items-center bg-[#FCD37B] text-black  justify-center text-xl border-0 p-2  w-[100%] h-[100%] rounded-sm font-medium font-caslon hover:bg-[#000000] hover:text-[#FCD37B] ' onClick={toggleConnectWalletDropdown}>{t('connectWallet')}</button>
                        {connectWalletDropdown && (
                        <ul className="absolute top-4 mr-1  mt-10 bg-black text-[#FCD378]  rounded shadow-lg w-[180px] p-0 list-none">
                          <li  className="p-3 hover:bg-purple-900 cursor-pointer flex items-center" onClick={() => login("ii")}>
                          <span className='mr-4'><img src="https://i.ibb.co/8gNN3v1/icp.png" className='size-6 rounded-full' /></span> Internet Identity
                          </li>
                          <hr style={{ backgroundColor: '#FCD378', height: '0.5px', border: 'none', width: '100%' }} />
                          <li  className="p-3 hover:bg-purple-900 cursor-pointer flex items-center" onClick={() => login("nffid")}>
                          <span className='mr-4'><img src="https://i.ibb.co/Y8ZMXhn/image.png" className='size-6 rounded-full' /></span>Nfid
                          </li>
                          <hr style={{ backgroundColor: '#FCD378', height: '0.5px', border: 'none', width: '100%' }} />
                          <li  className="p-3 hover:bg-purple-900 cursor-pointer flex items-center" onClick={()=> login("stoic")}>
                          <span className='mr-4'><img src="https://i.ibb.co/sm6rrPD/image.png" className='size-6 rounded-full' /></span> Stoic
                          </li>
                          <hr style={{ backgroundColor: '#FCD378', height: '0.5px', border: 'none', width: '100%' }} />
                          <li  className="p-3 hover:bg-purple-900 cursor-pointer flex items-center" onClick={()=>login("plug")}>
                          <span className='mr-4'><img src="https://docs.plugwallet.ooo/imgs/logo.png" className='size-6 rounded-full' /></span>Plug
                          </li>
                        </ul>
                        
                      )}
                    </div>
                    

                      )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className='absolute top-0 bottom-0 left-0 z-10 flex flex-col items-center w-full h-screen gap-8 py-8 pt-24 text-white bg-black bg-opacity-70 backdrop-blur-lg md:hidden'>
                    <Link to="/" className='text-[24px] font-[400] leading-[30px]'>
                        Home
                    </Link>
                    <div className='text-[24px] font-[400] leading-[30px]'>
                        {t('collection')}
                    </div>
                 
                        {isAuthenticated ?  (
                        <>
                       
                    <Link to="/profile" className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md' >
                            Profile
                        </Link>
                     
                    <div  className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md' onClick={onClickLogout}>
                            Logout
                        </div>
                        </>
                        
                      ):(

                        <div  className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md' onClick={toggleModal}>
                        {t('connectWallet')}
                    </div>
                      )}
                </div>
            )}

            {modal && (
                <div className='fixed top-0 bottom-0 left-0 right-0 z-40 w-screen h-screen'>
                    <div className='w-screen h-screen top-0 bottom-0 left-0 right-0 fixed bg-[rgba(49,49,49,0.8)]'>
                        <div className='flex items-center justify-center h-screen'>
                            <div className='w-[80vw] h-[40vh] md:h-[35vh] lg:h-[33vh] xl:h-[55vh] sm:w-[50vw] lg:w-[35vw] 2xl:w-[25vw] bg-gray-800 rounded-mdp-[20px] font-Roboto   md:p=[30px] overflow-auto'>
                                <div className="flex items-center justify-end">
                                    <button className="text-[#ffffff]" onClick={() => toggleModal()}>
                                        <RxCross2 size={25} />
                                    </button>
                                </div>
                                <h1 className='text-center text-[25px] md:text-[30px] m-0 font-Roboto'>Connect Wallet</h1>
                                <div className='flex flex-col h-[70%] overflow-y-auto'>
                                    <button className='pl-3 mt-5 h-[40px] w-full bg-gray-700 rounded-lg flex justify-start items-center text-[16px] sm:text-[20px] hover:text-slate-200 ' onClick={()=>login("ii")}><span className='mr-4'><img src="https://i.ibb.co/8gNN3v1/icp.png" className='rounded-full size-8' /></span> Internet Identity</button>
                                    <button className='pl-3 mt-5 h-[40px] w-full bg-gray-700 rounded-lg flex justify-start items-center text-[16px] sm:text-[20px]  hover:text-slate-200  ' onClick={()=>login("nfid")}><span className='mr-4'><img src="https://i.ibb.co/Y8ZMXhn/image.png" className='rounded-full size-8' /></span>Nfid</button>
                                    <button className='pl-3 mt-5 h-[40px] w-full bg-gray-700 rounded-lg flex justify-start items-center text-[16px] sm:text-[20px]  hover:text-slate-200  ' onClick={()=>login("stoic")}><span className='mr-4'><img src="https://i.ibb.co/sm6rrPD/image.png" className='rounded-full size-8' /></span>Stoic</button>
                                    <button className='pl-3 mt-5 h-[40px] w-full bg-gray-700 rounded-lg flex justify-start items-center text-[16px] sm:text-[20px]  hover:text-slate-200 ' onClick={()=>login("plug")}><span className='mr-4'><img src="https://docs.plugwallet.ooo/imgs/logo.png" className='rounded-full size-8' /></span>Plug</button>
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
