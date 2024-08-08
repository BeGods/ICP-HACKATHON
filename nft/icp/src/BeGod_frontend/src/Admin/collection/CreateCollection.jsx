import React from 'react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import YellowButton from '../../components/button/YellowButton';
import { Button } from '@chakra-ui/react';

const CreateCollection = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className='flex flex-row gap-4 justify-start mx-auto w-11/12 pt-9 hover:cursor-pointer'>
                <ArrowBackIcon onClick={() => navigate(-1)} color='white' />
                <h1 className='text-2xl text-white -mt-2'>Create Collection</h1>
            </div>
            <form className='sm:ml-[10%] md:ml-[85px] mt-[30px] space-y-2'>
                <div className='flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4'>
                    <label htmlFor="" className='w-60 md:w-[50%] lg:w-[37%] h-16 md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        Collection Name:
                        <input type="text" className='w-60 md:w-[100%] lg:w-[100%]  md:h-[86px] bg-[#29292C]' />
                    </label>
                    <label htmlFor="" className='w-60 md:w-[438px] h-16 md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        Max Limit:
                        <input type="text" className='w-60 md:w-[438px] md:h-[86px] bg-[#29292C]' />
                    </label>
                </div>
                <label htmlFor="" className='mt-[20px] w-60 sm:w-[50%] md:w-[438px] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Description:
                    <input type="text" className='w-60 sm:w-[162%] md:w-[894px] h-[60px] md:h-[47px] bg-[#29292C]' />
                </label>
                <label htmlFor="" className='mt-[20px] w-60 sm:w-[50%] md:w-[438px] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Logo IMG:
                    <input type="text" className='w-60 sm:w-[162%] md:w-[894px] h-[60px] md:h-[47px] bg-[#29292C]' />
                </label>
                <label htmlFor="" className='mt-[20px] w-60 sm:w-[50%] md:w-[438px] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    No. of NFT's:
                    <input type="text" className='w-60 sm:w-[162%] md:w-[894px] h-[60px] md:h-[47px] bg-[#29292C]' />
                </label>

                <label htmlFor="" className='mt-[20px] w-60 sm:w-[50%] md:w-[438px] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Description:
                    <input type="text" className='w-60 sm:w-[162%] md:w-[894px] h-[47px] bg-[#29292C]' />
                </label>
                <div className='flex flex-col sm:flex-row md:flex-row gap-4 mt-[20px]'>
                    <label htmlFor="" className='w-60  md:w-[50%] lg:w-[37%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        NFT's ID:
                        <input type="text" className='w-60 sm:w-[100%] md:w-[415px] h-[47px] bg-[#29292C]' />
                    </label>
                    <label htmlFor="" className='w-60 md:w-[50%] lg:w-[37%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        NFT's DESCRIPTION:
                        <input type="text" className='w-60 sm:w-[85%] md:w-[415px] h-[47px] bg-[#29292C]' />
                    </label>
                    <div className='w-[43px] h-[43px] rounded-full bg-[#FCD37B] ml-24 sm:-ml-12 md:-ml-3 sm:mt-[25px] md:mt-[42px] font-bold text-xl flex items-center justify-center'>
                        +
                    </div>
                </div>
                <div className='flex justify-start md:justify-end gap-4 md:mr-[285px] mt-[10px]'>
                    <button onClick={() => navigate(-1)} className='w-32 md:w-[160px] h-[33px] bg-black text-[#FFFFFF]'>
                        Cancel
                    </button>
                    <button className='w-32 md:w-[160px] h-[33px] bg-[#FCD37B] text-[#000000] '>
                        Create Collection
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateCollection
