import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes } from 'react-icons/fa';
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuthClient';
import { FaUserLarge } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const Navbar = ({ mobileView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [connectWalletDropdown, setConnectWalletDropdown] = useState(false);
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { logout, login } = useAuth();

  const [currentLanguage, setLanguage] = useState(t('langText'));

  const languages = [
    { code: "en", lang: "English" },
    { code: "fr", lang: "français" },
    { code: "hi", lang: "हिन्दी" }
  ];

  const selectedLanguage = i18n.language;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    mobileView();
  };

  const changeLanguage = (newLang, newLangText) => {
    i18n.changeLanguage(newLang);
    setLanguage(newLangText);
    setDropdownOpen(false);
  };

  const onClickLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className='max-w-[1920px] mx-auto w-full h-[10vh] flex items-center justify-between text-white relative'>
      {/* Mobile View */}
      <div className='relative flex items-center justify-between w-full gap-4 md:hidden'>
        <Link to="/" className='flex pt-7'>
          <img src="/Hero/logo.png" alt="Logo" className='h-24 w-28' />
        </Link>
        <div className='flex items-center justify-between'>
          <div className='relative w-[130px] flex justify-center'>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              className="text-[20px] font-[500] leading-[28.92px] text-[#FCD37B] flex justify-center items-center"
            >
              {currentLanguage} <span className="ml-2 text-sm">▼</span>
            </button>
            {dropdownOpen && (
              <ul className="absolute left-0 mt-10 bg-slate-900 text-[#FCD378] rounded shadow-lg w-36 p-0 list-none">
                {languages.map((eachLang) => (
                  <li
                    key={eachLang.code}
                    className={`px-4 py-2 hover:bg-purple-800 cursor-pointer ${selectedLanguage === eachLang.code ? 'bg-purple-950' : ''}`}
                    onClick={() => changeLanguage(eachLang.code, eachLang.lang)}
                  >
                    {eachLang.lang}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={toggleMenu} className='z-30 mr-4'>
            {isOpen ? <FaTimes size={36} /> : <img src='/Hero/hamburger.png' className='h-8' alt="Menu" />}
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className='py-4 max-w-[1920px] mx-auto w-full h-full hidden md:flex items-center justify-between text-white'>
        <Link to="/" className='pt-20'>
          <img src="/Hero/logo.png" alt="Logo" />
        </Link>
        <div className='flex items-center p-5 space-x-5'>
          <Link to="/" className='text-[20px] font-[500] text-[#FCD37B]'>{t('collectionNavItem')}</Link>

          {/* Language Dropdown */}
          <div className='relative w-[130px] flex justify-center'>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              className="text-[20px] font-[500] text-[#FCD37B] flex justify-center items-center"
            >
              {currentLanguage} <span className="ml-2 text-sm">{dropdownOpen ? "▲" : "▼"}</span>
            </button>
            {dropdownOpen && (
              <ul className="absolute left-0 mt-10 bg-slate-900 text-[#FCD378] rounded shadow-lg w-36 p-0 list-none">
                {languages.map((eachLang) => (
                  <li
                    key={eachLang.code}
                    className={`px-4 py-2 hover:bg-purple-800 cursor-pointer ${selectedLanguage === eachLang.code ? 'bg-purple-950' : ''}`}
                    onClick={() => changeLanguage(eachLang.code, eachLang.lang)}
                  >
                    {eachLang.lang}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* User Profile / Connect Wallet */}
          {isAuthenticated ? (
            <div className='relative w-[180px] flex justify-center'>
              <button
                onClick={() => setProfileDropDown(!profileDropDown)}
                aria-expanded={profileDropDown}
                className="flex justify-center items-center w-full h-full bg-[#000] text-white rounded-sm border border-white"
              >
                <FaUserLarge size={15} className="mr-1" /> Dcd4-744
              </button>
              {profileDropDown && (
                <ul className="absolute top-4 left-2 mt-10 bg-black text-[#FCD378] rounded shadow-lg w-36 p-0 list-none">
                  <li className="px-4 py-2 cursor-pointer hover:bg-purple-900" onClick={() => navigate("/profile")}>Profile</li>
                  <hr className="my-1 border-t border-[#FCD378]" />
                  <li className="px-4 py-2 cursor-pointer hover:bg-purple-900">Activity</li>
                  <hr className="my-1 border-t border-[#FCD378]" />
                  <li className="px-4 py-2 cursor-pointer hover:bg-purple-900" onClick={onClickLogout}>Logout</li>
                </ul>
              )}
            </div>
          ) : (
            <div className='relative min-w-[180px] flex'>
              <button
                onClick={() => setConnectWalletDropdown(!connectWalletDropdown)}
                className='bg-[#FCD37B] font-bold text-black w-full h-full rounded-sm p-2 text-md hover:bg-[#000] hover:text-[#FCD37B]'
              >
                {t('connectWallet')}
              </button>
              {connectWalletDropdown && (
                <ul className="absolute top-4 right-0 mt-10 bg-black text-[#FCD378] rounded shadow-lg w-[180px] p-0 list-none">
                  <li className="flex items-center p-3 cursor-pointer hover:bg-purple-900" onClick={() => login("ii")}>
                    <img src="https://i.ibb.co/8gNN3v1/icp.png" alt="Internet Identity" className="mr-4 rounded-full size-6" /> Internet Identity
                  </li>
                  <hr className="my-1 border-t border-[#FCD378]" />
                  <li className="flex items-center p-3 cursor-pointer hover:bg-purple-900" onClick={() => login("nffid")}>
                    <img src="https://i.ibb.co/Y8ZMXhn/image.png" alt="Nfid" className="mr-4 rounded-full size-6" /> Nfid
                  </li>
                  <hr className="my-1 border-t border-[#FCD378]" />
                  <li className="flex items-center p-3 cursor-pointer hover:bg-purple-900" onClick={() => login("stoic")}>
                    <img src="https://i.ibb.co/sm6rrPD/image.png" alt="Stoic" className="mr-4 rounded-full size-6" /> Stoic
                  </li>
                  <hr className="my-1 border-t border-[#FCD378]" />
                  <li className="flex items-center p-3 cursor-pointer hover:bg-purple-900" onClick={() => login("plug")}>
                    <img src="https://docs.plugwallet.ooo/imgs/logo.png" alt="Plug" className="mr-4 rounded-full size-6" /> Plug
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
          <Link to="/" className='text-[20px] font-[400] leading-[30px]'>Home</Link>
          <div className='text-[20px] font-[400] leading-[30px]'>{t('collectionNavItem')}</div>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md'>Profile</Link>
              <div onClick={onClickLogout} className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md'>Logout</div>
            </>
          ) : (
            <div onClick={() => setModal(true)} className='flex items-center justify-center text-lg border-[2px] border-gray-200 w-[60vw] h-[4vh] rounded-md'>{t('connectWallet')}</div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className='fixed top-0 left-0 z-40 w-full h-screen bg-[rgba(49,49,49,0.8)] sm:hidden'>
          <div className='flex items-center justify-center h-screen'>
            <div className='w-[80vw] h-[40vh] bg-gray-800 rounded-md'>
              <div className="flex justify-end p-2">
                <button onClick={() => setModal(false)} className="text-white">
                  <RxCross2 size={25} />
                </button>
              </div>
              <h1 className='text-center text-[25px] text-white'>Connect Wallet</h1>
              <div className='flex flex-col p-4'>
                <button className='pl-3 mt-5 h-[40px] bg-gray-700 rounded-lg flex items-center text-[16px] sm:text-[20px] hover:text-slate-200' onClick={() => login("ii")}>
                  <img src="https://i.ibb.co/8gNN3v1/icp.png" alt="Internet Identity" className='mr-4 rounded-full size-8' /> Internet Identity
                </button>
                <button className='pl-3 mt-5 h-[40px] bg-gray-700 rounded-lg flex items-center text-[16px] sm:text-[20px] hover:text-slate-200' onClick={() => login("nfid")}>
                  <img src="https://i.ibb.co/Y8ZMXhn/image.png" alt="Nfid" className='mr-4 rounded-full size-8' /> Nfid
                </button>
                <button className='pl-3 mt-5 h-[40px] bg-gray-700 rounded-lg flex items-center text-[16px] sm:text-[20px] hover:text-slate-200' onClick={() => login("stoic")}>
                  <img src="https://i.ibb.co/sm6rrPD/image.png" alt="Stoic" className='mr-4 rounded-full size-8' /> Stoic
                </button>
                <button className='pl-3 mt-5 h-[40px] bg-gray-700 rounded-lg flex items-center text-[16px] sm:text-[20px] hover:text-slate-200' onClick={() => login("plug")}>
                  <img src="https://docs.plugwallet.ooo/imgs/logo.png" alt="Plug" className='mr-4 rounded-full size-8' /> Plug
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
