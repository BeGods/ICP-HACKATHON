import React, { useState } from 'react';
import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import DropzoneWithUrlInput from '../components/DropzoneWithUrlInput';
import { Switch } from '@chakra-ui/react'
import { idlFactory } from "../../../../declarations/BeGod_backend/BeGod_backend.did.js"
import { canisterId } from '../../../../declarations/BeGod_backend';
import { Actor, HttpAgent } from '@dfinity/agent';
import { useSelector } from 'react-redux';
import "./temp.css"
import Modal from '../modal.jsx';
import NftCardItem from './NftCardItem.jsx';
import ImageUploader from './ImageUploader.jsx';
import LogoImageUploader from './LogoImageUploader.jsx';

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
    const [modal , setModal] = useState(false);
    
    const toggleModal = () => {
        setModal(!modal);
    }

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
    
    const [nftCardsList , setNftCardsList] = useState([]);
    const getAddedNftDetails = (nftDetails) => {
            nftCardsList.push(nftDetails);
            setNftCardsList(nftCardsList);
    }
    const deleteNft = (nftId) => {
        const updatedNFtList = nftCardsList.filter((eachNft) => (eachNft.nftId != nftId));
        setNftCardsList(updatedNFtList);
    }
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
                    <LogoImageUploader  />
                </label>
                {/* No. of NFTs */}
                <label className='mt-[20px] w-[100%] h-[60px] md:h-[86px] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    No. of NFT's:
                    <input onChange={(e) => setNfts(e.target.value)} type="text" className='pl-4 w-[100%] h-[60px] md:h-[47px] bg-[#29292C] rounded-md' />
                </label>
                <label className='mt-[20px] w-[100%] h-[60px] md:h-[46px] flex flex-row text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]'>
                    Featured:
                    <Switch id='isChecked' onChange={() => setIsChecked(!isChecked)} className='pt-1' />
                </label>
                {/* Add new NFT Section */}
                <div className={`${nftCardsList.length > 0 && "flex justify-end items-center"}`}>
                    <label className='mt-[20px] w-[100%]  md:h-[46px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px] mb-[0px]'>
                        NFT Cards
                    </label>
                    <br />
                    <div className="relative inline-block mt-2">
  <button className='add_new_button flex items-center justify-center px-6 py-2 bg-transperent text-white border border-[#d1b471] rounded-l-full rounded-r-none h-8 w-100'  onClick={toggleModal}>
    Add New
  </button>
  <div className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 bg-[#f0c96a] w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-900">
    <span className="text-black text-lg font-bold text-[25px]">+</span>
  </div>
</div>



                    {modal && (
                        <div className="modal">
                            <div className='overlay'>
                            <div className="popup_bg_container">
                                <Modal toggleModal={toggleModal} getAddedNftDetails = {getAddedNftDetails} />
                            </div>

                        </div>

                             

                        {/* Close modal button */}
                        <button type="button" className="" onClick={toggleModal}>
                                Close
                            </button>
                           
                        </div>
                    )}
                </div>

                <div className='flex'>
                        {nftCardsList.map((eachNftItem) => (
                            <NftCardItem nftDetails = {eachNftItem} key={eachNftItem.nftId} deleteNft={deleteNft}/>
                        ))}
                    </div>

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
