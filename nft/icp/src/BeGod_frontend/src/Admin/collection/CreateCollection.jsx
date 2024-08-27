import React, { useState } from 'react';
import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import DropzoneWithUrlInput from '../components/DropzoneWithUrlInput';
import { Switch } from '@chakra-ui/react'
import { idlFactory } from "../../../../declarations/BeGod_backend/BeGod_backend.did.js"
import { canisterId } from '../../../../declarations/BeGod_backend';
import { Actor, HttpAgent } from '@dfinity/agent';
import { useSelector } from 'react-redux';

const CreateCollection = () => {
    console.log(idlFactory, canisterId)
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [limit, setLimit] = useState(0);
    const [logo, setLogo] = useState(null | "");
    const [nfts, setNfts] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [nftRows, setNftRows] = useState([
        { id: '', description: '' } // Initial row
    ]);
    const handleAddRow = () => {
        setNftRows([...nftRows, { id: '', description: '' }]); // Ensure you're spreading an array
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...nftRows]; // Copy the current array
        updatedRows[index][field] = value; // Modify the specific row
        setNftRows(updatedRows); // Set the new state with the modified array
    };

    const handleLogoChange = (file) => {
        setLogo(file);
    };

    const createActor = () => {
        const agent = new HttpAgent();
        return Actor.createActor(idlFactory, { agent, canisterId });
    };
    const { user } = useSelector((state) => state.auth);
    const principal_id=`ztrxb-fiosz-cy6zv-ugwdw-tcmmm-hg5cy-fzfw2-wlcme-4kbky-sorey-2ae`;
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Form submission logic here
        const actor = createActor();
        try {
            const collectionResponse = await actor.add_collection_to_map(principal_id);
            console.log('Collection created successfully:', collectionResponse);
            for (const nft of nftRows) {
                const nftResponse = await actor.addNFT({
                    id: nft.id,
                    description: nft.description,
                    collectionId: collectionResponse.collectionId
                });
                console.log('NFT created successfully:', nftResponse);
            }
            navigate('/success');
        } catch (error) {
            console.error('Error creating collection or NFTs:', error);
        }
        // Add form validation and API call here
    };
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    return (
        <div>
            <div className='flex flex-row gap-4 justify-start mx-auto w-11/12 pt-9 hover:cursor-pointer 2xl:pt-[5vh] 2xl:ml-[10%]'>
                <ArrowBackIcon onClick={() => navigate(-1)} color='white' />
                <h1 className='text-2xl text-white -mt-2'>Create Collection</h1>
            </div>
            <form onSubmit={handleFormSubmit} className='ml-[10%] sm:ml-[10%] md:ml-[85px] 2xl:ml-[10%] w-9/12 space-y-4 mt-4'>
                {/* Collection Name and Max Limit */}
                <div className='flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-[100%]'>
                    <label className='w-full sm:w-1/2 h-16 md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        Collection Name:
                        <input onChange={(e) => setName(e.target.value)} type="text" className='pl-4 rounded-md  md:h-[86px] bg-[#29292C]' />
                    </label>
                    <label className='w-full sm:w-1/2 md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                        Max Limit:
                        <input onChange={(e) => setLimit(e.target.value)} type="text" className='pl-4 rounded-md md:h-[86px] bg-[#29292C]' />
                    </label>
                </div>
                {/* Description */}
                <label className='mt-[20px] w-[100%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Description:
                    <input onChange={(e) => setDescription(e.target.value)} type="text" className='pl-4 w-[100%] h-[60px] md:h-[47px] bg-[#29292C] rounded-md' />
                </label>
                {/* Logo */}
                <label className='mt-[20px] w-[100%] h-[150px] md:h-auto flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Logo
                    <DropzoneWithUrlInput onFileChange={handleLogoChange} />
                </label>
                {/* No. of NFTs */}
                <label className='mt-[20px] w-[100%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    No. of NFT's:
                    <input onChange={(e) => setNfts(e.target.value)} type="text" className='pl-4 w-[100%] h-[60px] md:h-[47px] bg-[#29292C] rounded-md' />
                </label>
                <label className='mt-[20px] w-[100%] h-[60px] md:h-[46px] flex flex-row text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    No. of NFT's:
                    <Switch id='isChecked' onChange={() => setIsChecked(!isChecked)} className='pt-1' />
                </label>
                {/* Dynamic NFT Rows */}
                {nftRows.map((row, index) => (
                    <div key={index} className='flex flex-col sm:flex-row md:flex-row gap-4 mt-[20px] w-[100%]'>
                        <label className='w-full sm:w-[43%] md:w-[46%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                            NFT's ID:
                            <input
                                onChange={(e) => handleInputChange(index, 'id', e.target.value)}
                                type="text"
                                className='pl-4 w-[100%] h-[47px] bg-[#29292C] rounded-md' />
                        </label>
                        <label className='w-full sm:w-[43%] md:w-[46%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                            NFT's DESCRIPTION:
                            <input
                                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                type="text"
                                className='pl-4 w-[100%] h-[47px] bg-[#29292C] rounded-md' />
                        </label>
                        {/* Show Add Button only on the last row */}
                        {index === nftRows.length - 1 && (
                            <div
                                onClick={handleAddRow}
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
