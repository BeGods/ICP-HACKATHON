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
import { useSelector } from 'react-redux';


const shadowColors = ['#07632E',"#00bfff","#FFD700","#FF4500"]

let shadowColorIndex = 0;



const Hero = () => {
    const[mobileView,setMobileView]=useState(false);
    const currIndexFromStore = useSelector((state) => state.info.currentCollectionIndex);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [collections,setCollections] = useState([]);
    const [selectedCollectionNftCardsList , updateSelectedCollectionNftCardsList] = useState([]);
    const [startIndex,setStartIndex] = useState(0);
    const visibleButtons = 4;



    const [noCards , updateNoCardsStatus] = useState(false);
    const [noCollections , updateNoCollectionStatus] = useState(false);


    
   

    

    const handleCurrentIndex  = async(index) => {

        if(index === startIndex+visibleButtons-1 && index != collections.length-1){
            setStartIndex(startIndex+1);
        }
        if(index === startIndex && index != 0){
            setStartIndex(startIndex-1);
        }

        console.log("index in handle click",index)
        
        const currentCollectionId = collections[index].collectionId;
        if(currentCollectionId === collections[currentIndex].collectionId) {
            return;
        }
        updateNoCardsStatus(false)
        updateSelectedCollectionNftCardsList([]);
        setCurrentIndex(index);
        const currList = await fetchCollectionNfts(currentCollectionId)
        if(currList.length > 0){
            updateSelectedCollectionNftCardsList(currList);
        }else{
            updateNoCardsStatus(true);
        }
    }

  
    const mobileViewHandler=()=>{
        setMobileView(!mobileView);
    }

    const {t} =  useTranslation();
    const {mainHeading,description,button} = t("landingPage");

    const { backendActor } = useAuth();


    useEffect(() => {
            getCollections();
    },[])
    const getCollections = async() => {
        const result = await backendActor?.getAllCollections();
        if(result.length === 0){
            updateNoCollectionStatus(true);
            return; 
        }
        const collectionItems = result[0][1];
      
      //  console.log("collection items" , collectionItems);
        const collections = []
        let i  = 0;
        collectionItems.map((eachItem) =>{
            const colItem = {
                index : i,
                collectionId : eachItem[1],
                name : eachItem[2],
                shadowColor : shadowColors[shadowColorIndex],
                description:eachItem[4]
            }
            i++;
            shadowColorIndex = shadowColorIndex+1;
            if(shadowColorIndex > 3){
                shadowColorIndex = 0;
            }

            collections.push(colItem);
        })
        
        setCollections(collections);
        
        const currentCollectionId = collections[currentIndex].collectionId;
        const currentCollectionNfts = await fetchCollectionNfts(currentCollectionId);
        if(currentCollectionNfts.length>0){
            updateSelectedCollectionNftCardsList(currentCollectionNfts);
        }
        //console.log(currentCollectionNfts)
};
let index = -1;
const fetchCollectionNfts = async (collectionId) => {
    const listedNfts = await backendActor?.listings(collectionId);
    index  = -1;
    if(listedNfts.length === 0){
        updateNoCardsStatus(true);
        return [];
    }
    const fetchedNfts = getCollectionNfts(listedNfts,collectionId);
    // console.log("fetched nfts of a collection",fetchedNfts)
    return fetchedNfts;
   

};

const getCollectionNfts = (collectionList,collectionId) => {
    return collectionList.map((eachItem) => {
       // console.log("list item",eachItem)
        index = index+1;
        const nftDetails = eachItem[3].nonfungible;
        const image = nftDetails.thumbnail;
        const name = nftDetails.asset;
        const sold = eachItem[2].price;
        const ICP = parseInt(sold)/100000000;
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


//  console.log("collection data", currentCollectionData)
// console.log("collection list" , collections)

console.log("current collection list",selectedCollectionNftCardsList)
if(currIndexFromStore != currentIndex){
    console.log("in side if condition", currIndexFromStore)
    handleCurrentIndex(currIndexFromStore);
   }

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
                {noCollections ? (
                    <div className='w-full h-[50vh] flex items-center justify-center'>
                        <h1 className='text-[50px] text-[#FCD37B]'>No Collections Found</h1>
                    </div>
                ):(
                    <div className='max-w-[1920px] mx-auto relative  flex flex-col lg:flex-row'>
                     {collections.length > 0 ? (
                         <Collections collections={collections}    handleCurrentIndex = {handleCurrentIndex} startIndex={startIndex} visibleButtons={visibleButtons} currIndex={currentIndex} />
                        // <h1>Collection Data</h1>
                     ):(
                        <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                            <div className='lg:sticky top-0 w-[100%] sm:w-[100%] lg:w-[35%] h-[100%] flex flex-row lg:flex-col md:gap-8  items-center justify-center mt-20'>
                            <div className='pt-2 lg:pr-4 lg:pb-2'>
                                <img
                                    src="/Hero/up.png"
                                    alt="Up"
                                    className={`hover:cursor-pointer ${true ? 'opacity-50 cursor-not-allowed' : ''} -rotate-90 lg:rotate-0`}
                                />
                            </div>
                            <div className="flex items-center gap-2 sm:hidden">
                                <Skeleton count={1} height={40} width={90} />
                                <Skeleton count={1} height={40} width={90} />
                            </div>
                            {/* <div className="md:flex md:items-center md:gap-2 lg:hidden">
                                <Skeleton count={1} height={40} width={190} />
                                <Skeleton count={1} height={40} width={190} />
                            </div> */}

                            <div className="hidden lg:sticky top-0 w-[100%] lg:w-[45%] h-[100%] lg:flex lg:flex-col md:gap-8 items-center justify-center mr-2">
                                <Skeleton count={1} height={60} width={220} />
                                <Skeleton count={1} height={60} width={220} />
                                <Skeleton count={1} height={60} width={220} />
                                <Skeleton count={1} height={60} width={220} />
                            </div>


                            <div>
                                <img
                                    src="/Hero/down.png"
                                    alt="Down"
                                    className={`hover:cursor-pointer ${true ? 'opacity-50 cursor-not-allowed' : ''} -rotate-90 lg:rotate-0`}
                                />
                            </div>
                            </div>
                        </SkeletonTheme>

                     )}
                    <div className='w-[100%] h-[100%] mt-12 sm:mt-20'>
                        <div className='w-[100%] flex flex-col sm:flex-row items-center justify-center'>
                            <div className='w-[70%]'>
                                <img src="/Hero/Mask group.png" alt="" className='hidden sm:flex'/>
                                <img src="/Hero/celtic_hero.png" alt="" className='flex items-center justify-center w-full sm:hidden' />
                            </div>
                            
                            <div className='flex flex-col items-center justify-center md:items-start w-[100%] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] space-y-4'>
                            {collections.length === 0 ? (
                                
                                     <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                                        <div className='flex flex-col items-center justify-center mb-5 sm:items-start lg:hidden'>
                                            <Skeleton count={1} height={50} width={150} />
                                            <Skeleton count={3} width={350} height={20}/>
                                        </div>
                                        <div className='flex-col hidden lg:flex lg:mb-5'>
                                            <Skeleton count={1} height={80} width={150} />
                                            <Skeleton count={3} width={600} height={20}/>
                                        </div>
                                    </SkeletonTheme>
                                
                         ):(
                            <>
                                <h1 className='sm:ml-0 text-[64px] font-[400] leading-[54px] custom-text-border'>{collections[currentIndex].name}</h1>
                                <h2 className='text-center sm:text-start w-[90%] lg:w-[70%]'>{[collections[currentIndex].description]}</h2>
                            </>
                         )}

                            </div>
                        </div>
                        {selectedCollectionNftCardsList.length >0? (
                            <NFTGallery currentCollection={selectedCollectionNftCardsList}  />
                            // <h1 className='text-white'>Nft Gallery</h1>
                        ) : (
                           noCards ? (
                              <div className='w-[100%] h-[220px] flex items-center justify-center'>
                                    <h1 className='text-[#FCD37B] text-6xl'>No cards found.</h1>
                              </div>
                           ):(
                            <div className="pb-10">
                            <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                              <div className="grid justify-around grid-cols-5 gap-5 m-5">
                                {Array.from({ length: 10 }).map((_, index) => (
                                  <Skeleton
                                    key={index}
                                    count={1}
                                    width={195}
                                    height={300}
                                  />
                                ))}
                              </div>
                            </SkeletonTheme>
                          </div>
                           )
                        )}
                    </div>
                </div>
                )}
            </div>
            <div style={{backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: "no-repeat" }} className='relative bg-center bg-cover '>
                <Footer />
            </div>
        </div>
    )
}

export default Hero