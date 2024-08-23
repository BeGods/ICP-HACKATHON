import React, { useState } from 'react';
import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import DropzoneWithUrlInput from '../components/DropzoneWithUrlInput';

const CreateCollection = () => {
    const navigate = useNavigate();
    const [nftRows, setNftRows] = useState([
        { id: '', description: '' } // Initial row
    ]);
    const[isChecked,setIsChecked]=useState(false);
    const addRow = () => {
        setNftRows([...nftRows, { id: '', description: '' }]);
    };

    return (
        <div>
            <div className='flex flex-row gap-4 justify-start mx-auto w-11/12 pt-9 hover:cursor-pointer 2xl:pt-[5vh] 2xl:ml-[10%]'>
                <ArrowBackIcon onClick={() => navigate(-1)} color='white' />
                <h1 className='text-2xl text-white -mt-2'>Create Collection</h1>
            </div>
            <form className='ml-[10%] sm:ml-[10%] md:ml-[85px] 2xl:ml-[10%] w-9/12 space-y-4 mt-4'>
                {/* Collection Name and Max Limit */}
                <div className='flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-[100%]'>
                    <label className='w-full sm:w-1/2 h-16 md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        Collection Name:
                        <input type="text" className='rounded-md  md:h-[86px] bg-[#29292C]' />
                    </label>
                    <label className='w-full sm:w-1/2 md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        Max Limit:
                        <input type="text" className='rounded-md md:h-[86px] bg-[#29292C]' />
                    </label>
                </div>
                {/* Description */}
                <label className='mt-[20px] w-[100%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Description:
                    <input type="text" className='w-[100%] h-[60px] md:h-[47px] bg-[#29292C] rounded-md' />
                </label>
                {/* Logo */}
                <label className='mt-[20px] w-[100%] h-[150px] md:h-auto flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Logo
                    <DropzoneWithUrlInput />
                </label>
                {/* No. of NFTs */}
                <label className='mt-[20px] w-[100%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    No. of NFT's:
                    <input type="text" className='w-[100%] h-[60px] md:h-[47px] bg-[#29292C] rounded-md' />
                </label>
                <label className='mt-[20px] w-[100%] h-[60px] md:h-[46px] flex flex-row text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    No. of NFT's:
                    <div className='items-center pt-[5px]'>
                        <input
                            type="checkbox"
                            id="toggleSwitch"
                            className="toggle-input hidden"
                            checked={isChecked}
                            onChange={()=>setIsChecked(!isChecked)}
                        />
                        <label
                            htmlFor="toggleSwitch"
                            className="toggle-label relative block w-10 h-6 bg-blue-500 rounded-full cursor-pointer transition-colors duration-300"
                        >
                            <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 transform"></span>
                        </label>
                    </div>
                </label>
                {/* Dynamic NFT Rows */}
                {nftRows.map((row, index) => (
                    <div key={index} className='flex flex-col sm:flex-row md:flex-row gap-4 mt-[20px] w-[100%]'>
                        <label className='w-full sm:w-[43%] md:w-[46%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                            NFT's ID:
                            <input type="text" className='w-[100%] h-[47px] bg-[#29292C] rounded-md' />
                        </label>
                        <label className='w-full sm:w-[43%] md:w-[46%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                            NFT's DESCRIPTION:
                            <input type="text" className='w-[100%] h-[47px] bg-[#29292C] rounded-md' />
                        </label>
                        {/* Show Add Button only on the last row */}
                        {index === nftRows.length - 1 && (
                            <div
                                onClick={addRow}
                                className='w-[20%] sm:w-[8%] md:w-[43px] h-[43px] rounded-full bg-[#FCD37B] ml-20 sm:-ml-2 md:-ml-3 sm:mt-[25px] md:mt-[42px] font-bold text-xl flex items-center justify-center cursor-pointer'
                            >
                                <AddIcon />
                            </div>
                        )}
                    </div>
                ))}
                {/* Form Buttons */}
                <div className='flex justify-start sm:justify-end md:justify-end gap-4 w-[100%] mt-[10px] pb-8 sm:mb-0'>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className='w-[30%] sm:w-[25%] md:w-[15%] h-[43px] bg-black text-[#FFFFFF] rounded-md'
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className='w-[60%] sm:w-[30%] md:w-[30%] lg:w-[25%] 2xl:w-[15%] h-[43px] bg-[#FCD37B] text-[#000000] rounded-md'
                    >
                        Create Collection
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCollection;
