import React, { useEffect, useState } from 'react'
import Navbar from '../components/Landing Page Components/Navbar'
import YellowButton from '../components/button/YellowButton'
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import NFTGallery from '../components/Landing Page Components/NftGallery';
const collections = [
    { name: "Celtic", shadowColor: "#32CD32" },
    { name: "Norse", shadowColor: "#00bfff" },
    { name: "Greek", shadowColor: "#FFD700" },
    { name: "Egyptian", shadowColor: "#FF4500" }
];


const collectionsData = {
    Celtic: [
        { img1: "/image/nft.png", name: "TANNGIOST", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 25.png", name: "POSIDONE", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 27.png", name: "SET", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 28.png", name: "KARNAYAM", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 22.png", name: "MIDGARD", sold: "50", ICP: "0.56" },
        { img1: "/image/Front.png", name: "CERBERVES", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 43.png", name: "RA", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 45.png", name: "DANU", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 22.png", name: "MIDGARD", sold: "50", ICP: "0.56" },
        { img1: "/image/Front.png", name: "CERBERVES", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 43.png", name: "RA", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 45.png", name: "DANU", sold: "50", ICP: "0.56" },
        
    ],

    Norse: [

        { img1: "/image/Component 28.png", name: "KARNAYAM", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 22.png", name: "MIDGARD", sold: "50", ICP: "0.56" },
        { img1: "/image/Front.png", name: "CERBERVES", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 43.png", name: "RA", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 45.png", name: "DANU", sold: "50", ICP: "0.56" },
    ],
    Egyptian: [

        { img1: "/image/Component 28.png", name: "KARNAYAM", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 22.png", name: "MIDGARD", sold: "50", ICP: "0.56" },
        { img1: "/image/Front.png", name: "CERBERVES", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 43.png", name: "RA", sold: "50", ICP: "0.56" },
    ],
    Greek: [

        { img1: "/image/Component 28.png", name: "KARNAYAM", sold: "50", ICP: "0.56" },
        { img1: "/image/Component 22.png", name: "MIDGARD", sold: "50", ICP: "0.56" },
        { img1: "/image/Front.png", name: "CERBERVES", sold: "50", ICP: "0.56" },

    ]
}

const Hero = () => {
    const [isActive, setIsActive] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentCollection, setCurrentCollection] = useState(collectionsData[collections[currentIndex].name] || []);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8; // Show 8 images per page

    // Calculate the range of images to show on the current page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = currentCollection.slice(startIndex, endIndex);

    // Handlers for pagination
    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < currentCollection.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const upHandler = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }
    const downHandler = () => {
        if (currentIndex < 3) {
            setCurrentIndex(currentIndex + 1);
        }
    }
    useEffect(() => {
        setCurrentCollection(collectionsData[collections[currentIndex].name] || []);
    }, [currentIndex])
    return (
        <div className='max-w-[1920px] mx-auto w-[100%]'>
            <div className="relative flex h-[100%]">
                {/* Container for each image */}
                <div className="w-1/4 h-[120vh]">
                    <img
                        src="/Hero/img1.png"
                        alt="Image1"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="w-1/4 h-[120vh]">
                    <img
                        src="/Hero/img2.png"
                        alt="Image2"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="w-1/4 h-[120vh]">
                    <img
                        src="/Hero/img3.png"
                        alt="Image3"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="w-1/4 h-[120vh]">
                    <img
                        src="/Hero/img4.png"
                        alt="Image4"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className='absolute top-0 w-[100%]'>
                <Navbar />
            </div>
            <div style={{ fontFamily: "CaslonAntique" }} className='absolute top-64 left-[23%] flex items-center justify-center flex-col space-y-8'>
                <h1 className="text-[128px] leading-[154px] font-[500] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] custom-text-border">BATTLE OF GODS</h1>
                <h2 className='text-[24px] leading-[28.92px] font-[500] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] '>Unleash the Divine: Collect and Own NFT Cards of the Gods!</h2>
                <div className='p-2 border-[1px] border-[#FCD37B]'>
                    <YellowButton>Explore Collection</YellowButton>
                </div>
            </div>

            <div style={{ fontFamily: "CaslonAntique", backgroundImage: `url('/Hero/smoke 1.png')`, backgroundRepeat: "no-repeat" }} className='h-auto w-[100%] bg-cover bg-center'>
                <div style={{ fontFamily: "CaslonAntique" }} className='pt-12 flex flex-col items-center justify-center'>
                    <div className='w-[40%]'>
                        <img src="/Hero/frame.svg" alt="" />
                    </div>
                    <h1 className='text-[96px] font-[500] leading-[115px] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] custom-text-border'>Collection</h1>
                    <div className='w-[40%]'>
                        <img src="/Hero/frame.svg" alt="" />
                    </div>
                </div>
                {/* Collection details and its nfts part */}
                <div className='ml-12 flex '>
                    <div className='w-[35%] h-[100%] flex flex-col gap-12 items-center justify-center mt-20'>
                        <img src="/Hero/up.png" alt="" onClick={upHandler} className='hover:cursor-pointer' />
                        {collections.map((collection, index) => (
                            <div
                                onClick={() => setCurrentIndex(index)}
                                key={index}
                                className='cursor-pointer relative w-[50%]  h-[6vh] bg-[#4A4A4A] flex items-center justify-center gap-4 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-transparent'
                                style={{
                                    backgroundColor: currentIndex === index ? collection.shadowColor : "inherit",
                                    boxShadow: currentIndex === index ? `0 0 30px 10px ${collection.shadowColor}` : "",
                                }}
                            >
                                <div className='absolute h-[90%] top-0 left-0'>
                                    <img src="/Hero/corner-small-left-bottom 1.png" alt="" className='h-full object-cover' />
                                </div>
                                <div className='absolute h-[90%] top-0 right-0'>
                                    <img src="/Hero/corner-small-left-bottom 2.png" alt="" className='h-full object-cover' />
                                </div>
                                <div className='absolute h-[90%] bottom-0 left-0'>
                                    <img src="/Hero/corner-small-left-bottom 3.png" alt="" className='h-full object-cover' />
                                </div>
                                <div className='absolute h-[90%] bottom-0 right-0'>
                                    <img src="/Hero/corner-small-left-bottom 4.png" alt="" className='h-full object-cover' />
                                </div>
                                <h1 className='text-lg font-[400] text-white z-10'>{collection.name}</h1>
                            </div>
                        ))}
                        <img src="/Hero/down.png" alt="" onClick={downHandler} className='hover:cursor-pointer' />
                    </div>
                    <div className='w-[100%] h-[100%] mt-20'>
                        <div className='w-[100%] flex'>
                            <div className='w-[70%]'>
                                <img src="/Hero/Mask group.png" alt="" />
                            </div>
                            <div className='w-[100%] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] space-y-4'>
                                <h1 className='text-[64px] font-[400] leading-[54px] custom-text-border'>{collections[currentIndex].name}</h1>
                                <h2 className='w-[70%]'>Lorem ipsum dolor sit amet consectetur. Aliquam tortor rhoncus tristique facilisi imperdiet interdum elementum. Lectus posuere tempor sed purus enim tristique nulla. Adipiscing proin ut et pellentesque dui bibendum ut sapien. Laoreet risus feugiat sed viverra dolor cum lacinia duis volutpat.</h2>
                                <div className='w-[23%] p-2 border-[1px] border-[#FCD37B]'>
                                    <YellowButton>Buy <span>Celtic</span> Collection</YellowButton>
                                </div>
                            </div>
                        </div>
                        <NFTGallery currentCollection={currentCollection} collections={collections} currentIndex={currentIndex} />
                    </div>
                </div>
            </div>
            <div style={{ fontFamily: "CaslonAntique", backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: "no-repeat" }} className='relative h-[40vh] bg-center bg-cover'>
                <div className='absolute top-0 overflow-hidden'>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default Hero
