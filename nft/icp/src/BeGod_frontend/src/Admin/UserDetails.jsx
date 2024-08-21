import React from 'react'
import { collection } from '../TextData'
const UserDetails = () => {
    const filteredNft = collection.collections[0].CollectionDetails.NftList[0];
    console.log(filteredNft.img)
    return (
        <div className='text-white mt-[20%] md:mt-24 md:ml-[5%] 2xl:ml-[10%] '>
            <div className=' mt-[5%]'>
                <input type="text"
                    placeholder='Search'
                    className='w-[90%] md:w-[80%] lg:w-[97%] h-[35px] border-[1px] border-[#FFFFFF] bg-[#000000] p-4' />
            </div>
            <div className='w-[90%] md:w-[80%] lg:w-[97%] h-auto md:h-[40%] lg:h-[370px] bg-[#29292C] mt-[15%] sm:mt-[8%] md:mt-[5%]  flex flex-col sm:flex-row'>
                <div className='h-1/2 md:h-full md:w-[30%] lg:w-[1/2] flex items-center justify-center md:mt-[5vh] lg:mt-0 md:mb-[5vh] lg:mb-0'>
                    <div className='w-[30%] w-[30%] md:w-[60%] md:w-[100%] flex items-center justify-center 2xl:h-[80%]'>
                        <img src={filteredNft.img} alt="" className='ml-[13%] md:ml-[20%] mt-[10%] lg:mt-[5vh] w-full h-full ' />
                    </div>
                </div>
                <div className='h-1/2 sm:h-full sm:w-1/2 md:w-[70%] lg:w-[60%] flex flex-col gap-[10px] pl-[5%] sm:mt-8 sm:mb-8 md:mt-[5vh] lg:mt-0 md:mb-0 sm:justify-center md:justify-center '>
                    <p className='text-[#FFFFFF] text-[14px] lg:text-[20px]'>
                        Name <span className='text-gray-400 font-[700] pl-[8%]'>Barry</span>
                    </p>
                    <p className='text-[#FFFFFF] text-[14px] lg:text-[20px]'>
                        Email <span className='text-gray-400 font-[700] pl-[9%]'>Tonya_Barrows@yahoo.com</span>
                    </p>
                    <p className='text-[#FFFFFF] text-[14px] lg:text-[20px]'>
                        Prinicipal <span className='text-gray-400 font-[700] pl-[4%]'>1951982</span>
                    </p>
                    <p className='text-[#FFFFFF] text-[14px] lg:text-[20px]'>
                        Telegram <span className='text-gray-400 font-[700] pl-[4%]'>1951982</span>
                    </p>
                    <p className='text-[#FFFFFF] text-[14px] lg:text-[20px]'>
                        <span className='text-gray-400 font-[700] pl-[25%] md:pl-[23%] lg:pl-[110px]'>1951982</span>
                    </p>
                </div>
            </div>
            <h1 className='text-[20px] font-[700] leading-[25px] text-[#FFFFFF] md:ml-[10%] mt-[2%]'>
                NFT Owned by 84fer-gg19
            </h1>
            <div className='flex items-center justify-center text-white mt-[5%]'>
                <h1>User doesn't own any NFT</h1>
            </div>
        </div>
    )
}

export default UserDetails
