import React from 'react';
import { Link } from 'react-router-dom';
import { BiLogoTelegram } from "react-icons/bi";
import { GrInstagram } from "react-icons/gr";
import { GrGamepad } from "react-icons/gr";
import { IoLogoTwitter } from "react-icons/io";
import { CiTwitter } from 'react-icons/ci';
import { useTranslation } from 'react-i18next';
const Footer = () => {
    const {t} = useTranslation(['footer']);
     const {horseCollection,greeceCollection,celticCollection,egyptanCollection} = t('categories'); 
    return (
        <div className="max-w-[1920px]  flex flex-col justify-center   w-full  text-[#FFFFFF]">
            <Link to="/" className='h-[80px] ml-[-5%] sm:ml-[3%] mt-8'>
                <img src="/Hero/logo.png" alt="" />
            </Link>
            <div className="flex flex-col lg:flex-row ml-[10%] sm:ml-[7%] mt-8">
                <p className="w-[90%] lg:w-[35%] xl:w-[35%] text-sm sm:text-base fon">
                    {t('footerDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-[40%] mt-4 sm:-mt-16 md:ml-0 lg:ml-[10%]">
                    <div className="flex flex-col gap-2 sm:gap-4 sm:mt-16 lg:mt-0">
                        <div className='flex gap-40 sm:gap-50'>
                            <h1 className="text-lg sm:text-xl underline">{t('home')}</h1>
                            <h1 className="flex  text-lg sm:text-xl underline">{t('collection')}</h1>
                        </div>
                        <h1 className=''>{t('categoriesText')}</h1>
                        <div className='flex flex-row gap-4 sm:gap-x-12'>
                            <Link to="#" className="flex items-center justify-start sm:justify-center gap-2">
                                <img src="/image/col1.png" alt="" className="h-5 sm:h-6" />
                                <h1 className="text-md sm:text-base underline">{horseCollection}</h1>
                            </Link>
                            <Link to="#" className="flex items-center justify-start sm:justify-center gap-2">
                                <img src="/image/col3.png" alt="" className="h-6 sm:h-6" />
                                <h1 className="text-md sm:text-base underline">{greeceCollection}</h1>
                            </Link>
                            <Link to="#" className="flex items-center justify-start sm:justify-center gap-2 ">
                                <img src="/image/col4.png" alt="" className="h-6 sm:h-6" />
                                <h1 className="text-md sm:text-base underline">{celticCollection}</h1>
                            </Link>
                            <Link to="#" className="flex items-center justify-start sm:justify-center gap-2">
                                <img src="/image/col2.png" alt="" className="h-6 sm:h-6" />
                                <h1 className="text-md sm:text-base underline">{egyptanCollection}</h1>
                            </Link>
                        </div> 
                        <div className='w-[70%] flex  items-center  justify-around  m-8'>
                            <a href="">
                                <BiLogoTelegram className='text-2xl text-white' />
                            </a>
                            <a href="">
                                <GrInstagram className='text-2xl text-white' />
                            </a>
                            <a href="">
                                <GrGamepad className='text-2xl text-white' />
                            </a>
                            <a href="">
                                <IoLogoTwitter className='text-2xl text-white' />
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Footer;
