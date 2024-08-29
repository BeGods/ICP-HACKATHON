import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div style={{ fontFamily: "QuickSand" }} className="w-full h-[400px] sm:h-[350px] md:h-[350px] text-[#FFFFFF]">
            <div className='h-[10vh]  sm:ml-[17%]'>
                <img src="/Hero/logo.png" alt="" />
            </div>
            <div className="flex flex-col lg:flex-row ml-[10%] sm:ml-[20%] mt-4">
                <p className="w-[90%] lg:w-[25%] text-sm sm:text-base">
                    Lorem ipsum dolor sit amet consectetur. Ac at adipiscing volutpat mi. Mauris faucibus sed justo aenean urna varius mauris magna ut. Donec sit sed nisi sed adipiscing dictum. Vel vel scelerisque diam eget netus aliquam cursus nunc.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-24 mt-4 sm:mt-0  md:ml-[10%]">
                    <div className="flex flex-col gap-2 sm:gap-4">
                        <div className='flex gap-8'>
                            <h1 className="text-lg sm:text-xl">Home</h1>
                            <h1 className="flex sm:hidden text-lg sm:text-xl">Collection</h1>
                        </div>
                        <Link to="#" className="flex items-center justify-start sm:justify-center gap-2 h-[8%] sm:-ml-[10vw] lg:ml-0">
                            <img src="/image/col1.png" alt="" className="h-6 sm:h-full" />
                            <h1 className="text-sm sm:text-base">Norse Collection</h1>
                        </Link>
                        <Link to="#" className="flex items-center justify-start sm:justify-center gap-2 h-[8%]  sm:-ml-[10vw] lg:ml-0">
                            <img src="/image/col4.png" alt="" className="h-6 sm:h-full" />
                            <h1 className="text-sm sm:text-base">Celtic Collection</h1>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-4">
                        <h1 className="hidden sm:flex text-lg sm:text-xl">Collection</h1>
                        <Link to="#" className="flex items-center justify-start sm:justify-center gap-2 h-[8%] pr-4  sm:-ml-[10vw] lg:ml-0">
                            <img src="/image/col3.png" alt="" className="h-6 sm:h-full" />
                            <h1 className="text-sm sm:text-base">Greece Collection</h1>
                        </Link>
                        <Link to="#" className="flex items-center justify-start sm:justify-center gap-2 h-[8%]  sm:-ml-[10vw] lg:ml-0">
                            <img src="/image/col2.png" alt="" className="h-6 sm:h-full" />
                            <h1 className="text-sm sm:text-base">Egyptan Collection</h1>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
