import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Landing Page Components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const CollectionDetail = () => {
    const { collectionName } = useParams();
    const [nftData, setNftData] = useState([]);
    const [isHovered1, setIsHovered1] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [vwValues, setVwValues] = useState({ img2: '15vw', img3: '30vw', img4: '45vw' });

    useEffect(() => {
        const updateVwValues = () => {
            const width = window.innerWidth;

            if (width >= 1280) {
                // xl screens
                setVwValues({ img2: '15vw', img3: '30vw', img4: '45vw' });
            } else if (width >= 1024) {
                // md screens
                setVwValues({ img2: '18vw', img3: '37vw', img4: '55vw' });
            }
            else if (width >= 768) {
                // md screens
                setVwValues({ img2: '22vw', img3: '45vw', img4: '67vw' });
            } else if(width>=650) {
                // sm screens
                setVwValues({ img2: '25vw', img3: '50vw', img4: '75vw' });
            }
            else{
                setVwValues({ img2: '25vw', img3: '50vw', img4: '75vw' });
            }
        };

        updateVwValues();
        window.addEventListener('resize', updateVwValues);

        return () => {
            window.removeEventListener('resize', updateVwValues);
        };
    }, []);

    useEffect(() => {
        const loadNFTData = async () => {
            try {
                const data = await import(`../utils/collections/${collectionName}.json`);
                setNftData(data.default);
            } catch (error) {
                console.error("Error loading the NFT data:", error);
            }
        };
        loadNFTData();
    }, [collectionName]);

    return (
        <div className='max-w-[1920px] mx-auto'>
            <Navbar />
            <div className='w-screen max-w-[1920px] mx-auto'>
                <div className='h-[30vh] w-full flex' style={{ background: `${nftData.bg1}` }}>
                    <div className='h-[130%] w-[20vw] md:w-[20vw] lg:w-[10vw]'>
                        <img src={nftData.logo} alt={nftData.title} className='h-full w-full -mt-12' />
                    </div>
                    <div className='w-[80vw] space-y-8 text-[#FFFFFF] mt-[3%]'>
                        <h1 style={{ fontFamily: "MyCustomFont" }} className='text-[40px] font-[400] leading-[30.04px]'>{nftData.title}</h1>
                        <div className='flex flex-col sm:flex-row'>
                            <h2 className='w-[70vw] sm:w-[80vw] md:w-[40vw] lg:w-[65%] xl:w-[45%] text-[12px] lg:text-[16px] font-[400] leading-[20.04px]' >{nftData.decription}</h2>
                            <Link to="" className="md:ml-[30%] lg:ml-[40%] sm:mt-[17%] md:mt-[7%] h-[10%] w-[50%] sm:w-[35%] md:w-[25%] lg:w-[13%] border-[1px] border-white bg-[#1E62AC] text-center">
                                Buy Collection
                            </Link>
                        </div>
                    </div>
                </div>
                <div className=' max-w-[1920px] mx-auto flex justify-between h-[80vh]' style={{ background: `${nftData.bg2}` }}>
                    <div className='flex flex-col gap-[10%] md:pl-[8%] pt-[2%]'>
                        {/* First image set with Framer Motion */}
                        <div
                            className="max-w-[1920px] mx-auto image-container relative w-[125px] h-[200px] sm:w-[150px] sm:h-[250px] lg:w-[200px] lg:h-[300px]"
                            onMouseEnter={() => setIsHovered1(true)}
                        >
                            <motion.img
                                src="/Norse/img1.png"
                                alt=""
                                style={{ zIndex: 4, position: 'absolute', top: 0, left: 0 }}
                                animate={{ x: isHovered1 ? 0 : -80 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            />
                            <motion.img
                                src="/Norse/img2.png"
                                alt=""
                                style={{ zIndex: 3, position: 'absolute', top: 0, left: 0 }}
                                animate={{ x: isHovered1 ? vwValues.img2 : -60 }}
                                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}
                            />
                            <motion.img
                                src="/Norse/img3.png"
                                alt=""
                                style={{ zIndex: 2, position: 'absolute', top: 0, left: 0 }}
                                animate={{ x: isHovered1 ? vwValues.img3 : -40 }}
                                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
                            />
                            <motion.img
                                src="/Norse/img4.png"
                                alt=""
                                style={{ zIndex: 1, position: 'absolute', top: 0, left: 0 }}
                                animate={{ x: isHovered1 ? vwValues.img4 : -20 }}
                                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
                            />
                        </div>

                        {/* Second image set with Framer Motion */}
                        <div
                            className="image-container relative w-[125px] h-[200px]  sm:w-[150px] sm:h-[250px] lg:w-[200px] lg:h-[300px]"
                            onMouseEnter={() => setIsHovered2(true)}
                        >
                            <motion.img
                                src="/Norse/img1.png"
                                alt=""
                                style={{ zIndex: 4, position: 'absolute', top: 0, left: 0 }}
                                animate={{ x: isHovered2 ? 0 : -80 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                            />
                            <motion.img
                                src="/Norse/img2.png"
                                alt=""
                                style={{ zIndex: 3, position: 'absolute', top: 0, left: 0 }}
                                animate={{ x: isHovered2 ? vwValues.img2 : -60 }}
                                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}
                            />
                            <motion.img
                                src="/Norse/img3.png"
                                alt=""
                                style={{ zIndex: 2, position: 'absolute', top: 0, left: 0 }}
                                animate={{ x: isHovered2 ? vwValues.img3 : -40 }}
                                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
                            />
                            <motion.img
                                src="/Norse/img4.png"
                                alt=""
                                style={{ zIndex: 1, position: 'absolute', top: 0, left: 0 }}
                                animate={{ x: isHovered2 ? vwValues.img4 : -20 }}
                                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
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
