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
import { BiCategory } from "react-icons/bi";
import { IoCheckmarkOutline } from "react-icons/io5";
import { CiDollar } from "react-icons/ci";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { HiArrowsUpDown } from "react-icons/hi2";
import { RiArrowUpDownFill } from "react-icons/ri";


const shadowColors = ['#07632E',"#00bfff","#FFD700","#FF4500"]

let shadowColorIndex = 0;

const cardTypeList = [
    {
        cardId :"ALL" ,
        displayText:"All"
    },
    {
        cardId : "COMMAN",
        displayText : "Comman"
    },
    {
        cardId : "MYTHIC" ,
        displayText:"Mythic"
    },
    {
        cardId : "REAR" ,
        displayText:"Rear"
    },
    {
        cardId : "UNCOMMON",
        displayText:"Uncommon"
    },
]
const dropdownItems = {
    none : "NONE",
    type : "TYPE",
    price : "PRICE",
    filter : "FILTER"
}

const filterListOptions = [
    {
        optionId : "DEFAULT",
        displayText : "Default"
    },
    {
        optionId : 'RecentlyAdded',
        displayText : "Recently Added"
    },
    {
        optionId : "LowToHigh",
        displayText : "Price : Low to High"
    },
    {
        optionId : "HighToLow",
        displayText : "Price : Hight to Low"
    }
]

const Hero = () => {
    const[mobileView,setMobileView]=useState(false);
    const currIndexFromStore = useSelector((state) => state.info.currentCollectionIndex);
    const [currentIndex, setCurrentIndex] = useState(currIndexFromStore);
    const [collections,setCollections] = useState([]);
    const [selectedCollectionNftCardsList , updateSelectedCollectionNftCardsList] = useState([]);
    
    const visibleButtons = 3; 
    let start = 0;
    if(currentIndex >= visibleButtons){
        start = currentIndex+1-visibleButtons
    }
    const [startIndex,setStartIndex] = useState(start);

    const allCollectionsList = useSelector((state)=>state.info.collectionList); 

   // console.log("collection List frist time",allCollectionsList);



    const [noCards , updateNoCardsStatus] = useState(false);
    const [noCollections , updateNoCollectionStatus] = useState(false);


    const [currentCardType,updateCardType] = useState(cardTypeList[0].cardId);
    const [fromPrice , updateFromPrice] = useState(undefined);
    const [toPrice,updateToPrice] = useState(undefined);
    const [currentDropDown,updateDropDown] = useState(dropdownItems.none);
    const [applyPriceRange,updateApplyPriceRange] = useState({isApply:false,from:NaN,to:NaN});
    const [currentFilterOption,updateCurrentFilterOption] = useState(filterListOptions[0].optionId)

    const onClickAnyFilter = (updatedFilter) => {

        console.log("updated filter", updatedFilter)
        if(updatedFilter === currentDropDown){
            updateDropDown(dropdownItems.none);
            return;
        }

        updateDropDown(updatedFilter);
        

    }
   
  
    

    const handleCurrentIndex  = async(index) => {

        // if(index === startIndex+visibleButtons-1 && index != collections.length-1){
        //     setStartIndex(startIndex+1);
        // }
     
        // if(index === startIndex && index != 0){
        //     setStartIndex(startIndex-1);
        // }

        if(index >= visibleButtons-1 && index >= startIndex) {
            if(index != collections.length-1){
                setStartIndex(index+2 - visibleButtons);
            }else{
                setStartIndex(index+1 - visibleButtons);
            }
            
        }else if(index < startIndex){
            if(index == 0){
                setStartIndex(0);
            }else{
                setStartIndex(index-1);
            }
        }
        if(index )
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
      
        console.log("collection items" , collectionItems);
        const collections = [] 
        
        let i  = 0;
        
        collectionItems.map((eachItem) =>{
           // console.log("each card ---------- item",eachItem)
            const jsonData = JSON.parse(eachItem[4]);

           // console.log("json -------------- data",jsonData)
            const colItem = {
                index : i,
                collectionId : eachItem[1],
                name : eachItem[2],
                shadowColor : jsonData.collColor,
                description:jsonData.description
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
        
        // updateNoCardsStatus(true);
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
    console.log("fetched nfts of a collection",fetchedNfts)
    return fetchedNfts;
   

};

const getCollectionNfts = (collectionList,collectionId) => {
    const tempList = [];
    let tempIndex = 0;
    for(let i=0;i<collectionList.length;i++){
        const eachItem = collectionList[i];
        const nftDetails = eachItem[3].nonfungible;
        const image = nftDetails.thumbnail;
        const name = nftDetails.name;
        const sold = eachItem[2].price;
        const ICP = parseInt(sold)/100000000;
        const metadata = JSON.parse(nftDetails.metadata[0].json);
        // console.log(metadata,'metadata');
        const nftType = metadata.nfttype;
        const borderColor = metadata.nftcolor;
        const nftCard= {
            collectionId,
            index:eachItem[0],
            img1: image,
            name,
            sold,
            ICP,
            nftType,
            borderColor
        };
        if(tempIndex === 0){
            tempList.push([nftCard]);
            tempIndex++;
        }else if(tempList[tempIndex-1][0].name === nftCard.name){
            tempList[tempIndex-1].push(nftCard);
        }else{
            tempList.push([nftCard]);
            tempIndex++;
        }
    }
    return tempList;
};

const onClickFilterContainer = () => {
    if(currentDropDown != dropdownItems.none){
        onClickAnyFilter(dropdownItems.none)
    }
}

//  console.log("collection data", currentCollectionData)
// console.log("collection list" , collections)

console.log("current collection list",selectedCollectionNftCardsList)

let filteredList = selectedCollectionNftCardsList
    
if(currentCardType !== cardTypeList[0].cardId){
    filteredList = filteredList.filter((eachItem=>{
        if(eachItem[0].nftType.toLowerCase() === currentCardType.toLowerCase()){
            return true;
        }
        return false;

    }))
}

if (applyPriceRange.isApply) {
    filteredList = filteredList.filter((eachItem) => {
        console.log("from price", applyPriceRange.from, "card price", eachItem.ICP, "to price", applyPriceRange.to);
        if (applyPriceRange.from <= eachItem[0].ICP && eachItem.ICP <= applyPriceRange.to) {
            return true;
        }
        return false;
    });
    
}

if(currentFilterOption != filterListOptions[0].optionId){
    if(currentFilterOption === filterListOptions[1].optionId){
        filteredList = filteredList.slice().reverse();
    }else if(currentFilterOption === filterListOptions[2].optionId){
        filteredList = [...filteredList].sort((a,b)=>a[0].ICP - b[0].ICP);
    }else if(currentFilterOption === filterListOptions[3].optionId){
        filteredList = [...filteredList].sort((a,b)=> b[0].ICP - a[0].ICP);
    }
}


console.log("filtered list after applying filters",filteredList)
    return (
        // for medium devices width is 99.6% because in ipad air width is little overflowing
        // onClick={onClickFilterContainer}
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
                        {/* style={{ boxShadow: "0px 0px 94px 36px orange" }} */}
                            <div className='w-[70%] '>
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
                        <div className='flex items-center justify-between text-[12px] md:text-sm lg:text-base ml-2'>
                            <div className="relative w-[160px] md:w-[180px] flex justify-center lg:mr-5">
                            {currentDropDown === dropdownItems.type && (
                                        <ul className="absolute top-10 left-0 mt-2 bg-black text-[#FCD378] rounded shadow-lg  p-0 list-none z-50 w-full h-[160px] overflow-y-auto ">
                                            {cardTypeList.map((eachType,index)=>(
                                                <>
                                                    <div key={eachType.cardId} className='flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-purple-900'
                                                    onClick={()=>{if(eachType.cardId != currentCardType){updateCardType(eachType.cardId); onClickAnyFilter(dropdownItems.type)}}}>
                                                        <li key={eachType.cardId}>{eachType.displayText}</li>
                                                        {currentCardType === eachType.cardId && (
                                                        <IoCheckmarkOutline />
                                                        )}
                                                    </div>
                                                    {index != cardTypeList.length-1 && ( <hr className="my-1 border-t border-[#FCD378]" />)}
                                                </>
                                            ))}
                                        </ul>
                                    )}
                                <button
                                    onClick={()=>onClickAnyFilter(dropdownItems.type)}
                                    className={`rounded-full flex justify-center items-center gap-1 
                                    w-full h-full p-2 bg-[#000] text-[#FCD378]  hover:border-[#FCD378] border-2 ${currentDropDown === dropdownItems.type ? "border-[#FCD378]" : " border-gray-800"}`}
                                >
                                    <BiCategory />
                                    Category
                                    ({currentCardType.charAt(0)}{currentCardType.slice(1).toLowerCase()})
                                </button>
                                    
                            </div>
                            <div className="relative w-[160px] md:w-[180px]  flex justify-center">
                                <button
                                    onClick={()=>onClickAnyFilter(dropdownItems.price)}
                                    className={`rounded-full flex justify-center items-center gap-1 
                                     p-2 bg-[#000] text-[#FCD378]  hover:border-[#FCD378] border-2 ${currentDropDown === dropdownItems.price ? "border-[#FCD378]" : " border-gray-800"}`}
                                >
                                    <CiDollar size={20} />
                                        Price
                                    (
                                        {`${
                                                !isNaN(applyPriceRange.from) && !isNaN(applyPriceRange.to)
                                                    ? `${applyPriceRange.from} - ${applyPriceRange.to} `
                                                    : ""
                                            }`} ICP
                                        )
                                </button>
                                    {currentDropDown === dropdownItems.price && (
                                      <div className='absolute top-10 -left-3 mt-2 bg-black text-[#FCD378] rounded shadow-lg  p-4 z-50 w-[120%] h-[150px] flex flex-col items-center justify-around'>
                                            <h1>Price in ICP</h1>
                                            <div className='flex flex-col items-center lg:flex-row'>
                                                <input value={fromPrice} onChange={(e)=>{
                                                updateFromPrice(parseInt(e.target.value));
                                                }}
                                                placeholder='From' type='number' className='w-20 mb:2 lg:mb-0 lg:mr-3 rounded-sm border text-[#FCD378] border-[#FCD378] bg-transparent outline-none p-1 text-sm'  />
                                                <input value={toPrice} onChange={(e)=> { updateToPrice(parseInt(e.target.value))}} placeholder='to' type='number' className='w-20 rounded-sm border text-[#FCD378] border-[#FCD378] bg-transparent outline-none p-1 text-sm'/>
                                            </div>
                                            <div className=''>
                                                <button className={`w-20 border-none bg-[#FCD378] text-black h-6 mr-3 rounded-full ${(isNaN(applyPriceRange.from)|| isNaN(applyPriceRange.to))?"opacity-20":"opacity-100"} `}
                                                    disabled={isNaN(applyPriceRange.from) || isNaN(applyPriceRange.to)}
                                                    onClick={()=>{onClickAnyFilter(dropdownItems.none);updateApplyPriceRange({isApply:false,from:NaN,to:NaN}); updateFromPrice(NaN); updateToPrice(NaN)}}
                                                >Cancel</button>
                                                <button className={`w-20 border-none bg-[#FCD378] text-black h-6 rounded-full ${(isNaN(fromPrice) || isNaN(toPrice)) ? "opacity-20":"opacity-100"}`}
                                                onClick={()=>{
                                                    onClickAnyFilter(dropdownItems.price);
                                                    updateApplyPriceRange({isApply:true,from:fromPrice,to:toPrice});
                                                }}
                                                
                                               
                                                disabled={isNaN(fromPrice) || isNaN(toPrice)}
                                                >Apply</button>
                                            </div>
                                      </div>
                                    )}
                            </div>
                            <div className=' relative lg:ml-auto mr-2 lg:mr-20 w-[160px] h-[40px] md:w-[180px] '>
                            <span className='relative top-3 text-xs bg-gray-800 text-[#FCD378] rounded-full px-2 z-10 left-5 '>Filter & Sort</span>
                            <button
                                    onClick={()=>onClickAnyFilter(dropdownItems.filter)}
                                    className={` absolute rounded-full flex justify-center items-center gap-1 
                                    w-full h-full p-2 bg-[#000] text-[#FCD378]  hover:border-[#FCD378] border-2 ${currentDropDown === dropdownItems.filter ? "border-[#FCD378]" : " border-gray-800"}`}
                                >
                                     < RiArrowUpDownFill />
                                    {currentFilterOption}
                                </button>
                                {currentDropDown === dropdownItems.filter && (
                                        <ul className="absolute top-[60px] left-0 mt-2 bg-black text-[#FCD378] rounded shadow-lg  p-0 list-none z-50 w-full h-[160px] overflow-y-auto ">
                                            {filterListOptions.map((eachFilter,index)=>(
                                                <>
                                                    <div key={eachFilter.optionId} className='flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-purple-900'
                                                    onClick={()=>{if(eachFilter.optionId != currentFilterOption){updateCurrentFilterOption(eachFilter.optionId); onClickAnyFilter(dropdownItems.filter)}}}>
                                                        <li key={eachFilter.optionId}>{eachFilter.displayText}</li>
                                                        {currentFilterOption === eachFilter.optionId && (
                                                        <IoCheckmarkOutline />
                                                        )}
                                                    </div>
                                                    {index != filterListOptions.length-1 && ( <hr className="my-1 border-t border-[#FCD378]" />)}
                                                </>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                        </div>
                        {filteredList.length >0? (
                            <NFTGallery currentCollection={filteredList}  />
                            // <h1 className='text-white'>Nft Gallery</h1>
                        ) : (
                           noCards || (selectedCollectionNftCardsList.length>0 && filteredList.length===0) ? (
                              <div className='w-[100%] h-[220px] flex items-center justify-center'>
                                    <h1 className='text-[#FCD37B] text-6xl'>No cards found.</h1>
                              </div>
                           ):(
                            <div className="pb-10">
                            <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                              <div className="justify-around hidden gap-5 m-5 md:grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                {Array.from({ length: 10 }).map((_, index) => (
                                  <Skeleton
                                    key={index}
                                    count={1}
                                    width={210}
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
                <Footer handleCurrentIndex ={handleCurrentIndex} />
            </div>
        </div>
    )
}

export default Hero