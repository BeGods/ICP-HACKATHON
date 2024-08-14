import React from 'react'
import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons'
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
            <form className='ml-[10%] sm:ml-[10%] md:ml-[85px] w-9/12 space-y-4 mt-4'>
                <div className='flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-[100%]'>
                    <label htmlFor="" className='w-full sm:w-1/2 h-16 md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        Collection Name:
                        <input type="text" className='rounded-md  md:h-[86px] bg-[#29292C]' />
                    </label>
                    <label htmlFor="" className='w-full sm:w-1/2 md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        Max Limit:
                        <input type="text" className='rounded-md md:h-[86px] bg-[#29292C]' />
                    </label>
                </div>
                <label htmlFor="" className='mt-[20px] w-[100%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Description:
                    <input type="text" className='w-[100%] h-[60px] md:h-[47px] bg-[#29292C] rounded-md' />
                </label>
                <label htmlFor="" className='mt-[20px] w-[100%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Logo IMG:
                    <input type="file" className='w-[100%] h-[60px] md:h-[47px] bg-[#29292C] rounded-md' />
                </label>
                <label htmlFor="" className='mt-[20px] w-[100%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    No. of NFT's:
                    <input type="text" className='w-[100%] h-[60px] md:h-[47px] bg-[#29292C] rounded-md' />
                </label>

                <label htmlFor="" className='mt-[20px] w-[100%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Description:
                    <input type="text" className='w-[100%] h-[47px] bg-[#29292C] rounded-md' />
                </label>
                <div className='flex flex-col sm:flex-row md:flex-row gap-4 mt-[20px] w-[100%]'>
                    <label htmlFor="" className='w-full sm:w-[43%] md:w-[46%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        NFT's ID:
                        <input type="text" className='w-[100%] h-[47px] bg-[#29292C] rounded-md' />
                    </label>
                    <label htmlFor="" className='w-full sm:w-[43%] md:w-[46%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        NFT's DESCRIPTION:
                        <input type="text" className='w-[100%] h-[47px] bg-[#29292C] rounded-md' />
                    </label>
                    <div className='w-[20%] sm:w-[8%] md:w-[43px] h-[43px] rounded-full bg-[#FCD37B] ml-20 sm:-ml-2 md:-ml-3 sm:mt-[25px] md:mt-[42px] font-bold text-xl flex items-center justify-center'>
                        <AddIcon />
                    </div>
                </div>
                <div className='flex justify-start sm:justify-end md:justify-end gap-4 w-[100%] mt-[10px] pb-8 sm:mb-0'>
                    <button onClick={() => navigate(-1)} className='w-[30%] sm:w-[25%] md:w-[15%] h-[43px] bg-black text-[#FFFFFF] rounded-md'>
                        Cancel
                    </button>
                    <button className='w-[60%] sm:w-[25%] md:w-[15%] h-[43px] bg-[#FCD37B] text-[#000000] rounded-md'>
                        Create Collection
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateCollection
