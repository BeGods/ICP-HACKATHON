import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Landing Page Components/Navbar';
import Footer from '../components/Footer';

const CollectionDetail = () => {
    const { collectionName } = useParams();
    const [nftData, setNftData] = useState([]);

    useEffect(() => {
        const loadNFTData = async () => {
            try {
                console.log("Loading data for collection:", collectionName);
                const data = await import(`../utils/collections/${collectionName}.json`);
                console.log("Data loaded:", data);
                setNftData(data.default);
            } catch (error) {
                console.error("Error loading the NFT data:", error);
            }
        };
        loadNFTData();
    }, [collectionName]);


    return (
        <div>
            <Navbar />
            <div className=''>
                <div className='flex gap-[4%]' style={{ background: `${nftData.bg1}` }}>
                    <div>
                        <img src={nftData.logo} alt={nftData.title} />
                    </div>
                    <div className='space-y-8 text-[#FFFFFF] mt-[2%]'>
                        <h1 className='text-[40px] font-[400] leading-[30.04px]'>{nftData.title}</h1>
                        <div>
                            <h2 className='w-[60%] text-[16px] font-[400] leading-[20.04px]'>{nftData.decription}</h2>
                            <Link to="">
                                Buy Collection
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between h-[80vh] ' style={{ background: `${nftData.bg2}` }}>
                    <div className='flex flex-col gap-[10%] pl-[8%] pt-[2%]'>
                        <div className="relative" style={{ width: '200px', height: '300px' }}>
                            <img
                                src="/Norse/img1.png"
                                alt=""
                                className="absolute top-0 left-0"
                                style={{ zIndex: 1, transform: 'translateX(80)' }}
                            />
                            <img
                                src="/Norse/img2.png"
                                alt=""
                                className="absolute top-0 left-0"
                                style={{ zIndex: 2, transform: 'translateX(60px)' }}
                            />
                            <img
                                src="/Norse/img3.png"
                                alt=""
                                className="absolute top-0 left-0"
                                style={{ zIndex: 3, transform: 'translateX(40px)' }}
                            />
                            <img
                                src="/Norse/img4.png"
                                alt=""
                                className="absolute top-0 left-0"
                                style={{ zIndex: 4, transform: 'translateX(2px)' }}
                            />
                        </div>
                        <div className="relative" style={{ width: '200px', height: '300px' }}>
                            <img
                                src="/Norse/img1.png"
                                alt=""
                                className="absolute top-0 left-0"
                                style={{ zIndex: 1, transform: 'translateX(80)' }}
                            />
                            <img
                                src="/Norse/img2.png"
                                alt=""
                                className="absolute top-0 left-0"
                                style={{ zIndex: 2, transform: 'translateX(60px)' }}
                            />
                            <img
                                src="/Norse/img3.png"
                                alt=""
                                className="absolute top-0 left-0"
                                style={{ zIndex: 3, transform: 'translateX(40px)' }}
                            />
                            <img
                                src="/Norse/img4.png"
                                alt=""
                                className="absolute top-0 left-0"
                                style={{ zIndex: 4, transform: 'translateX(2px)' }}
                            />
                        </div>
                    </div>



                    <div className='flex justify-end items-end'>
                        <img src={nftData.base} alt={nftData.title} className='w-full h-full' />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CollectionDetail;
