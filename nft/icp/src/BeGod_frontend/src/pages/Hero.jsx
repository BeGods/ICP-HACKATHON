import React, { useEffect, useState } from 'react'
import Navbar from '../components/Landing Page Components/Navbar'
import YellowButton from '../components/button/YellowButton'
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import NFTGallery from '../components/Landing Page Components/NftGallery';
import HeroSlider from '../components/Landing Page Components/HeroSlider';
import Collections from '../components/Landing Page Components/CollectionType';
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentCollection, setCurrentCollection] = useState(collectionsData[collections[currentIndex].name] || []);

    const nextHandler = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }

    const prevHandler = () => {
        if (currentIndex < 3) {
            setCurrentIndex(currentIndex + 1);
        }
    }

    useEffect(() => {
        setCurrentCollection(collectionsData[collections[currentIndex].name] || []);
    }, [currentIndex])

    return (
        <div className='w-[100%]'>
            <HeroSlider />
            <div className=' absolute top-0 w-[100%]'>
                <Navbar />
            </div>
            <div style={{ fontFamily: "CaslonAntique" }} className=' w-full flex items-center justify-center flex-col space-y-8 py-8 absolute top-60'>
                <h1 className="text-[40px] md:text-[80px] xl:text-[100px] 2xl:text-[128px] leading-none font-[500] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] custom-text-border text-center">
                    BATTLE OF GODS
                </h1>
                <h2 className='text-[16px] md:text-[24px] leading-tight font-[500] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] text-center'>
                    Unleash the Divine: Collect and Own NFT Cards of the Gods!
                </h2>
                <div className='p-2 border-[1px] border-[#FCD37B]'>
                    <YellowButton>Explore Collection</YellowButton>
                </div>
            </div>
            <div style={{ fontFamily: "CaslonAntique", backgroundImage: `url('/Hero/smoke 1.png')`, backgroundRepeat: "no-repeat" }} className='h-auto w-[100%] bg-cover bg-center'>
                <div style={{ fontFamily: "CaslonAntique" }} className='max-w-[1920px] mx-auto pt-12 flex flex-col items-center justify-center'>
                    <div className='w-[40%]'>
                        <img src="/Hero/frame.svg" alt="" />
                    </div>
                    <h1 className='text-[96px] font-[500] leading-[115px] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] custom-text-border'>Collection</h1>
                    <div className='w-[40%]'>
                        <img src="/Hero/frame.svg" alt="" />
                    </div>
                </div>
                {/* Collection details and its nfts part */}
                    <div className='max-w-[1920px] mx-auto relative  flex flex-col lg:flex-row'>
                        <Collections collections={collections} next={nextHandler} prev={prevHandler} currentCollection={setCurrentCollection} collectionsData={collectionsData} />
                        <div className='w-[100%] h-[100%] mt-20'>
                            <div className='w-[100%] flex flex-col pl-[100px] sm:pl-0 sm:flex-row'>
                                <div className='w-[70%]'>
                                    <img src="/Hero/Mask group.png" alt="" />
                                </div>
                                <div className='w-[100%] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] space-y-4'>
                                    <h1 className='ml-28 sm:ml-0 text-[64px] font-[400] leading-[54px] custom-text-border'>{collections[currentIndex].name}</h1>
                                    <h2 className='-pl-8 text-center sm:text-start w-[90%] lg:w-[70%]'>Lorem ipsum dolor sit amet consectetur. Aliquam tortor rhoncus tristique facilisi imperdiet interdum elementum. Lectus posuere tempor sed purus enim tristique nulla. Adipiscing proin ut et pellentesque dui bibendum ut sapien. Laoreet risus feugiat sed viverra dolor cum lacinia duis volutpat.</h2>
                                    <div className='ml-24 sm:ml-0 w-[190px] lg:w-[190px] p-2 border-[1px] border-[#FCD37B]'>
                                        <YellowButton>Buy <span>Celtic</span> Collection</YellowButton>
                                    </div>
                                </div>
                            </div>
                            <NFTGallery currentCollection={currentCollection} collections={collections} currentIndex={currentIndex} />
                        </div>
                    </div>
            </div>
            <div style={{ fontFamily: "CaslonAntique", backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: "no-repeat" }} className='relative h-[50vh] sm:h-[50vh] md:h-[50vh] lg:h-[40vh] bg-center bg-cover'>
                <div className='absolute top-0 overflow-hidden'>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default Hero
