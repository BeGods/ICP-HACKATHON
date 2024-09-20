import React, { useEffect, useState } from 'react'
import Navbar from '../components/Landing Page Components/Navbar'
import YellowButton from '../components/button/YellowButton'
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import NFTGallery from '../components/Landing Page Components/NftGallery';
import HeroSlider from '../components/Landing Page Components/HeroSlider';
import Collections from '../components/Landing Page Components/CollectionType';
import { useTranslation } from 'react-i18next';
import { useAuth } from "../utils/useAuthClient.jsx";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const collections = [
    { name: "Celtic", shadowColor: "#07632E" },
    { name: "Norse", shadowColor: "#00bfff" },
    { name: "Greek", shadowColor: "#FFD700" },
    { name: "Egyptian", shadowColor: "#FF4500" }
];



const collectionsData = {
    Celtic: [],
    Norse: [],
    Egyptian: [],
    Greek: []
}
const initialCollectionDescription = {
    Celtic:"",
    Norse:"",
    Egyptian:"",
    Greek:"",
}

const Hero = () => {
    const[mobileView,setMobileView]=useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentCollectionData,setCollectionData] = useState(collectionsData);
    const [currentCollection, setCurrentCollection] = useState(currentCollectionData[collections[currentIndex].name] || []);
    const [loading, setLoading] = useState({
        Celtic: true,
        Norse: true,
        Greek: true,
        Egyptian: true
    });
    const [collectionDetailsLoading,setCollectionLoadingDetails] = useState(true);

    const [collectionDescription,setCollectionDescription] = useState(initialCollectionDescription);
   

  

    const handleCurrentIndex  = (index) => {
        setCurrentIndex(index);
    }


    const mobileViewHandler=()=>{
        setMobileView(!mobileView);
    }
    useEffect(() => {
        setCurrentCollection(currentCollectionData[collections[currentIndex].name] || []);
    }, [currentIndex,currentCollectionData])
    

    const {t} =  useTranslation();
    const {mainHeading,description,button} = t("landingPage");

    const { backendActor } = useAuth();


    useEffect(() => {
        getCollections();
    },[])
    const getCollections = async() => {
        const result = await backendActor?.getAllCollections();
        const collectionItems = result[0][1];
        let celticId ;
        let norseId;
        let greekId;
        let egyptianId;
        collectionItems.map((eachItem)=>{
            if(eachItem[2] === "Celtic"){
                celticId = eachItem[1]
                setCollectionDescription((prevData)=>({
                    ...prevData,
                    ["Celtic"]:eachItem[4]
                }))
                setCollectionLoadingDetails(false)
            }else if(eachItem[2] === "Norse"){
                norseId = eachItem[1];
                setCollectionDescription((prevData)=>({
                    ...prevData,
                    ["Norse"]:eachItem[4]
                }))
                setCollectionLoadingDetails(false)
            }else if(eachItem[2] === "Greek"){
                greekId = eachItem[1];
                setCollectionDescription((prevData)=>({
                    ...prevData,
                    ["Greek"]:eachItem[4]
                }))
                setCollectionLoadingDetails(false)

            }else if(eachItem[2] === "Egyptian"){
                egyptianId = eachItem[1]
                setCollectionDescription((prevData)=>({
                    ...prevData,
                    ["Egyptian"]:eachItem[4]
                }))
                setCollectionLoadingDetails(false)
            }
        });

    console.log(celticId,norseId,greekId,egyptianId)

    await fetchCollectionNfts(celticId, "Celtic");
    await fetchCollectionNfts(norseId, "Norse");
    await fetchCollectionNfts(greekId, "Greek");
    await fetchCollectionNfts(egyptianId, "Egyptian");
};
let index = -1;
const fetchCollectionNfts = async (collectionId, collectionName) => {
    const listedNfts = await backendActor?.listings(collectionId);
    index  = -1;
    const fetchedNfts = getCollectionNfts(listedNfts,collectionId);


    setCollectionData((prevData) => ({
        ...prevData,
        [collectionName]: fetchedNfts
    }));

    setLoading((prevLoading) => ({
        ...prevLoading,
        [collectionName]: false
    }));
};

const getCollectionNfts = (collectionList,collectionId) => {
    return collectionList.map((eachItem) => {
        console.log("list item",eachItem)
        index = index+1;
        const nftDetails = eachItem[2].nonfungible;
        const image = nftDetails.thumbnail;
        const name = nftDetails.asset;
        const sold = eachItem[1].price;
        const ICP = "0.56";
        return {
            collectionId,
            index,
            img1: image,
            name,
            sold,
            ICP
        };
    });
};


 console.log("collection data", currentCollectionData)


    return (
        // for medium devices width is 99.6% because in ipad air width is little overflowing
        <div className='w-[100%] md:w-[99.6%] lg:w-[100%] font-caslon'>
            <div className='relative'>
                <HeroSlider />
                <div className=' absolute top-0 w-[100%] z-20'>
                    <Navbar mobileView={mobileViewHandler}/>
                </div>
                <div  className={`w-full flex items-center justify-center flex-col space-y-8 py-8 absolute top-60 ${mobileView?"z-0":"z-10"}`}>
                    <h1  className="text-[40px] md:text-[80px] xl:text-[100px] 2xl:text-[128px] flex items-center justify-center h-[50px] md:h-[130px] xl:h-[160px] 2xl:h-[180px] leading-none font-[500] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] custom-text-border text-center">
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
                            {collectionDetailsLoading ? (
                            <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                <Skeleton count={1} height={80} width={150}  />
                                <Skeleton count={3} width={600} height={20}/>
                            </SkeletonTheme>
                         ):(
                            <>
                                <h1 className='sm:ml-0 text-[64px] font-[400] leading-[54px] custom-text-border'>{collections[currentIndex].name}</h1>
                                <h2 className='text-center sm:text-start w-[90%] lg:w-[70%]'>{collectionDescription[collections[currentIndex].name]}</h2>
                            </>
                         )}

                            </div>
                        </div>
                        {!loading[collections[currentIndex].name] && currentCollection.length > 0 ? (
                            <NFTGallery currentCollection={currentCollection} collections={collections} currentIndex={currentIndex} />
                        ) : (
                            <SkeletonTheme baseColor="#202020" highlightColor="#444">
                                <div className='flex justify-around mr-10'>
                                    <Skeleton count={1} width={200} height={310} />
                                    <Skeleton count={1} width={200} height={310} />
                                    <Skeleton count={1} width={200} height={310} />
                                    <Skeleton count={1} width={200} height={310} />
                                </div>
                            </SkeletonTheme>
                        )}
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
