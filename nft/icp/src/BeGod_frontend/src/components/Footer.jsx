import React from 'react';
import { Link } from 'react-router-dom';
import { BiLogoTelegram } from "react-icons/bi";
import { GrInstagram } from "react-icons/gr";
import { GrGamepad } from "react-icons/gr";
import { IoLogoTwitter } from "react-icons/io";
import { CiTwitter } from 'react-icons/ci';
const Footer = () => {
    return (
        <div style={{ fontFamily: "QuickSand" }} className="max-w-[1920px] mx-auto flex flex-col justify-center   w-full  text-[#FFFFFF]">
            <Link to="/" className='h-[10vh]  sm:ml-[1%] xl:ml-[4%] '>
                <img src="/Hero/logo.png" alt="" />
            </Link>
            <div className="flex flex-col lg:flex-row ml-[10%] sm:ml-[7%] mt-8">
                <p className="w-[90%] lg:w-[35%] xl:w-[35%] text-sm sm:text-base">
                    Lorem ipsum dolor sit amet consectetur. Ac at adipiscing volutpat mi. Mauris faucibus sed justo aenean urna varius mauris magna ut. Donec sit sed nisi sed adipiscing dictum. Vel vel scelerisque diam eget netus aliquam cursus nunc.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-[40%] mt-4 sm:-mt-16 md:ml-0 lg:ml-[10%]">
                    <div className="flex flex-col gap-2 sm:gap-4 sm:mt-16 lg:mt-0">
                        <div className='flex gap-56 sm:gap-80'>
                            <h1 className="text-lg sm:text-xl">Home</h1>
                            <h1 className="flex  text-lg sm:text-xl">Collection</h1>
                        </div>
                        <h1 className='underline'>categories</h1>
                        <div className='flex flex-row gap-12 sm:gap-56'>
                            <Link to="#" className="flex items-center justify-start sm:justify-center gap-2">
                                <img src="/image/col1.png" alt="" className="h-6 sm:h-8" />
                                <h1 className="text-sm sm:text-base">Norse Collection</h1>
                            </Link>
                            <Link to="#" className="flex items-center justify-start sm:justify-center gap-2">
                                <img src="/image/col3.png" alt="" className="h-6 sm:h-8" />
                                <h1 className="text-sm sm:text-base">Greece Collection</h1>
                            </Link>
                        </div> 
                        <div className='flex flex-row gap-12 sm:gap-56'>
                            <Link to="#" className="flex items-center justify-start sm:justify-center gap-2 ">
                                <img src="/image/col4.png" alt="" className="h-6 sm:h-8" />
                                <h1 className="text-sm sm:text-base">Celtic Collection</h1>
                            </Link>
                            <Link to="#" className="flex items-center justify-start sm:justify-center gap-2">
                                <img src="/image/col2.png" alt="" className="h-6 sm:h-8" />
                                <h1 className="text-sm sm:text-base">Egyptan Collection</h1>
                            </Link>
                        </div>
                        <div className='flex gap-12 sm:gap-24 mb-8'>
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
