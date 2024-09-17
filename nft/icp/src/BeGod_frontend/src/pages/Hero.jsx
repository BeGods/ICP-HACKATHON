import React, { useEffect, useState } from 'react'
import Navbar from '../components/Landing Page Components/Navbar'
import YellowButton from '../components/button/YellowButton'
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import NFTGallery from '../components/Landing Page Components/NftGallery';
import HeroSlider from '../components/Landing Page Components/HeroSlider';
import Collections from '../components/Landing Page Components/CollectionType';
import { useTranslation } from 'react-i18next';
const collections = [
    { name: "Celtic", shadowColor: "#07632E" },
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
    const[mobileView,setMobileView]=useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentCollection, setCurrentCollection] = useState(collectionsData[collections[currentIndex].name] || []);

  

    const handleCurrentIndex  = (index) => {
        console.log("card Index" , index);
        setCurrentIndex(index);
    }


    const mobileViewHandler=()=>{
        setMobileView(!mobileView);
    }
    useEffect(() => {
        setCurrentCollection(collectionsData[collections[currentIndex].name] || []);
    }, [currentIndex])
    

    const {t} =  useTranslation(['translation']);
    const {mainHeading,description,button} = t("landingPage");
    console.log("mainheading ",mainHeading , "description : " , description , "button text" , button)

    

    return (
        // for medium devices width is 99.6% because in ipad air width is little overflowing
        <div className='w-[100%] md:w-[99.6%] lg:w-[100%] font-caslon'>
            <div className='relative'>
                <HeroSlider />
                <div className=' absolute top-0 w-[100%] z-20'>
                    <Navbar mobileView={mobileViewHandler}/>
                </div>
                <div  className={`w-full flex items-center justify-center flex-col space-y-8 py-8 absolute top-60 ${mobileView?"z-0":"z-10"}`}>
                    <h1 style={{fontFamily:'MyCustomFont'}} className="text-[40px] md:text-[80px] xl:text-[100px] 2xl:text-[128px] flex items-center justify-center h-[50px] md:h-[130px] xl:h-[160px] 2xl:h-[180px] leading-none font-[500] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] custom-text-border text-center">
                        {mainHeading}
                    </h1>
                    <h2 className='text-[16px] md:text-[24px] leading-tight font-[500] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] text-center'>
                      {description}
                    </h2>
                    <div className='p-2 border-[1px] border-[#FCD37B]'>
                        <a href='#collections'><YellowButton>{button}</YellowButton></a>
                    </div>
                </div>
            </div>

            <div id='collections' style={{ backgroundImage: `url('/Hero/smoke 1.png')`, backgroundRepeat: "no-repeat" }} className='h-auto w-[100%] bg-cover bg-center'>
                <div  className='max-w-[1920px] mx-auto pt-12 flex flex-col items-center justify-center'>
                    <div className='w-[40%]'>
                        <img src="/Hero/frame.svg" alt="" />
                    </div>
                    <h1 className='text-[70px] sm:text-[96px] font-[500] leading-[115px] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] custom-text-border'>{t('collectionText')}</h1>
                    <div className='w-[40%]'>
                        <img src="/Hero/frame.svg" alt="" />
                    </div>
                </div>
                {/* Collection details and its nfts part */}
                <div className='max-w-[1920px] mx-auto relative  flex flex-col lg:flex-row'>
                    <Collections collections={collections}  currentCollection={setCurrentCollection} collectionsData={collectionsData} handleCurrentIndex = {handleCurrentIndex} />
                    <div className='w-[100%] h-[100%] mt-12 sm:mt-20'>
                        <div className='w-[100%] flex flex-col sm:flex-row items-center justify-center'>
                            <div className='w-[70%]'>
                                <img src="/Hero/Mask group.png" alt="" className='hidden sm:flex'/>
                                <img src="/Hero/celtic_hero.png" alt="" className='sm:hidden w-full flex items-center justify-center' />
                            </div>
                            <div className='flex flex-col items-center justify-center md:items-start w-[100%] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] space-y-4'>
                                <h1 className='sm:ml-0 text-[64px] font-[400] leading-[54px] custom-text-border'>{collections[currentIndex].name}</h1>
                                <h2 className='text-center sm:text-start w-[90%] lg:w-[70%]'>Lorem ipsum dolor sit amet consectetur. Aliquam tortor rhoncus tristique facilisi imperdiet interdum elementum. Lectus posuere tempor sed purus enim tristique nulla. Adipiscing proin ut et pellentesque dui bibendum ut sapien. Laoreet risus feugiat sed viverra dolor cum lacinia duis volutpat.</h2>
                            </div>
                        </div>
                        <NFTGallery currentCollection={currentCollection} collections={collections} currentIndex={currentIndex} />
                    </div>
                </div>
            </div>
            <div style={{backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: "no-repeat" }} className=' relative bg-center bg-cover'>
                <Footer />
            </div>
        </div>
    )
}

export default Hero
