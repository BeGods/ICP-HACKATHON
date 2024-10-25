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
import { useDispatch, useSelector } from 'react-redux';
import { BiCategory } from "react-icons/bi";
import { IoCheckmarkOutline } from "react-icons/io5";
import { CiDollar } from "react-icons/ci";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { HiArrowsUpDown } from "react-icons/hi2";
import { RiArrowUpDownFill } from "react-icons/ri";
import { LuFilter } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { GrPowerReset } from "react-icons/gr";
import toast from 'react-hot-toast';
import { updateCurrentIndex } from '../redux/infoSlice.js';


const cardTypeList = [
    {
        cardId :"ALL" ,
        displayText:"All"
    },
    {
        cardId : "COMMON",
        displayText : "Common"
    },
    {
        cardId : "MYTHIC" ,
        displayText:"Mythic"
    },
    {
        cardId : "RARE" ,
        displayText:"Rare"
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
        optionId : "Default",
        displayText : "Default"
    },
    {
        optionId : 'Recently Added',
        displayText : "Recently Added"
    },
    {
        optionId : "Low to High",
        displayText : "Price : Low to High"
    },
    {
        optionId : "High to Low",
        displayText : "Price : Hight to Low"
    }
]

const Hero = () => {
    const[mobileView,setMobileView]=useState(false);
    const currIndexFromStore = useSelector((state) => state.info.currentCollectionIndex);
    const [currentIndex, setCurrentIndex] = useState(currIndexFromStore);
    const [collections,setCollections] = useState([]);
    const [selectedCollectionNftCardsList , updateSelectedCollectionNftCardsList] = useState([]);
    
    const visibleButtons = 4; 
    let start = 0;
    if(currentIndex >= visibleButtons-1){
        start = currentIndex+2-visibleButtons
    } 
    const [startIndex,setStartIndex] = useState(start);

    // const allCollectionsList = useSelector((state)=>state.info.collectionList); 

   // console.log("collection List frist time",allCollectionsList);



    const [noCards , updateNoCardsStatus] = useState(false);
    const [noCollections , updateNoCollectionStatus] = useState(false);


    const [currentCardType,updateCardType] = useState(cardTypeList[0].cardId);
    const [fromPrice , updateFromPrice] = useState(undefined);
    const [toPrice,updateToPrice] = useState(undefined);
    const [currentDropDown,updateDropDown] = useState(dropdownItems.none);
    const [applyPriceRange,updateApplyPriceRange] = useState({isApply:false,from:NaN,to:NaN});
    const [currentFilterOption,updateCurrentFilterOption] = useState(filterListOptions[0].optionId);


      const onClickAnyFilter = (updatedFilter) => {

        console.log("updated filter", updatedFilter)
        if(updatedFilter === currentDropDown){
            updateDropDown(dropdownItems.none);
            return;
        }

        updateDropDown(updatedFilter);
        

    }
    const onClickFilterContainer = () => {
        updateDropDown(dropdownItems.none);
    }

    const onClickResetButton = () =>{
        updateCardType(cardTypeList[0].cardId);
        updateApplyPriceRange({isApply:false,from:NaN,to:NaN});
        updateCurrentFilterOption(filterListOptions[0].optionId);
    }
    

    const [isDisplayFiltersPopup,updateFiltersDisplayStatus] = useState(false);
   
  
    const dispatch = useDispatch();

    const handleCurrentIndex  = async(index) => {
        
        if(index >= visibleButtons-1 && index >= startIndex) {
            if(index != collections.length-1){
                setStartIndex(index+2 - visibleButtons);
            }else{
                setStartIndex(index+1 - visibleButtons);
            }
            
        }else if(index <= startIndex){
            if(index == 0){
                setStartIndex(0);
            }else{
                setStartIndex(index-1);
            }
        }
        if(index )
        console.log("index in handle click",index)
        
        const currentCollectionId = collections[index].collectionId;
        const color = collections[index].shadowColor;
        if(currentCollectionId === collections[currentIndex].collectionId) {
            return;
        }
        updateNoCardsStatus(false)
        updateSelectedCollectionNftCardsList([]);
        setCurrentIndex(index);
        const currList = await fetchCollectionNfts(currentCollectionId,color)
        if(currList.length > 0){
            updateFilteredList(currList);
            updateSelectedCollectionNftCardsList(currList);
        }else{
            updateSelectedCollectionNftCardsList([]);
            updateNoCardsStatus(true);
        }
       
         dispatch(updateCurrentIndex(index));
        
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
        const tempArray = [];
        if (result && Array.isArray(result)) {
          result.forEach((item) => {
            if (item && item.length > 1) {
              // console.log(item);
              item[1].forEach((value) => {
                // console.log(value);
                if (value && value.length > 1) {
                  tempArray.push(value);
                }
              });
            }
          });
        }
          console.log(tempArray);
       
        
        const collectionItems = tempArray
      
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
            collections.push(colItem);
        })
        
        setCollections(collections);
        
        const currentCollectionId = collections[currentIndex].collectionId;
        const color = collections[currentIndex].shadowColor;
        const currentCollectionNfts = await fetchCollectionNfts(currentCollectionId,color);
        if(currentCollectionNfts.length>0){
            updateFilteredList(currentCollectionNfts);
            updateSelectedCollectionNftCardsList(currentCollectionNfts);
        }
        
        // updateNoCardsStatus(true);
        //console.log(currentCollectionNfts)
};
let index = -1;
const fetchCollectionNfts = async (collectionId,color) => {
   try{
    const listedNfts = await backendActor?.listings(collectionId);
      console.log("listings resut",listedNfts);
    index  = -1;
    if(listedNfts.length === 0){
        updateSelectedCollectionNftCardsList([]);
        updateNoCardsStatus(true);
        return [];
    }
    const fetchedNfts = getCollectionNfts(listedNfts,collectionId,color);
    console.log("fetched nfts of a collection",fetchedNfts)
    return fetchedNfts;
   }catch{
    updateSelectedCollectionNftCardsList([]);
    updateNoCardsStatus(true);
    return;
   }

};

const getCollectionNfts = (collectionList, collectionId, color) => {
    return collectionList.map((eachItem) => {
      const { nonfungible } = eachItem[3];
      const { thumbnail: image, name } = nonfungible;
      const sold = eachItem[2].price;
      const ICP = parseInt(sold) / 100000000;
      const metadata = JSON.parse(nonfungible.metadata[0].json);
      const { nftType, nftcolor: borderColor } = metadata;
  
      const nftCard = {
        collectionId,
        index: eachItem[0],
        img1: image,
        name,
        sold,
        ICP,
        nftType,
        borderColor,
        collectionColor: color,
      };
    return nftCard
    });
  };
  

//  console.log("collection data", currentCollectionData)
// console.log("collection list" , collections)
function getScreenSize() {
    const width = window.innerWidth;
  
    if (width >= 1024) {
      return 'lg';
    } else if (width >= 768) {
      return 'md'; 
    } else if(width >=640){
      return 'sm'; 
    }else{
        return "xs"
    }
  }


const [filteredList, updateFilteredList] = useState(selectedCollectionNftCardsList);


useEffect(() => {
    let updatedList = [...selectedCollectionNftCardsList];

    if (currentCardType !== cardTypeList[0].cardId) {
        const currType = currentCardType.toLowerCase();
        updatedList = updatedList.filter((eachItem) => {
            const cardType = eachItem.nftType.toLowerCase();
            return currType === cardType;
        });
    }


    if (applyPriceRange.isApply) {
        updatedList = updatedList.filter((eachItem) => {
            return applyPriceRange.from <= eachItem.ICP && eachItem.ICP <= applyPriceRange.to;
        });
        
    }

    

    console.log("Updated list after all filters:", updatedList);
    const screenSize = getScreenSize();
   if(screenSize == "xs"){
    if(currentCardType != cardTypeList[0].cardId || applyPriceRange.isApply || currentFilterOption !== filterListOptions[0].optionId){
        if(updatedList.length>0){
            toast.success(`${updatedList.length} Card${updatedList.length === 1 ? "":"s"} Found`);
        }else{
            toast.error("No Cards Found");
        }
    }
   }
    
   if(currentFilterOption !== filterListOptions[0].optionId){
    filterAndSort(updatedList);
   }else{
    updateFilteredList(updatedList);
   }
    

}, [currentCardType, applyPriceRange, selectedCollectionNftCardsList]);

const [isRecentlyAdded,updateRecentlyAddedStatus] = useState(false);

const filterAndSort = (list)=>{
    if (currentFilterOption !== filterListOptions[0].optionId) {
        let updatedList = [...list];
        if (currentFilterOption === filterListOptions[1].optionId) {
            updatedList = updatedList.reverse();
            updateRecentlyAddedStatus(true);
        } else if (currentFilterOption === filterListOptions[2].optionId) {
            updatedList = updatedList.sort((a, b) => a.ICP - b.ICP);
            updateRecentlyAddedStatus(false);
        } else if (currentFilterOption === filterListOptions[3].optionId) {
            updatedList = updatedList.sort((a, b) => b.ICP - a.ICP);
            updateRecentlyAddedStatus(false);
        }
        console.log("updated list after filter change",updatedList)
        updateFilteredList(updatedList)
    }else if(isRecentlyAdded){
        updateFilteredList([...filteredList].reverse());
        updateRecentlyAddedStatus(false);
    }else{
        updateFilteredList([...filteredList]);
    }
    
}

useEffect(()=>{
    filterAndSort(selectedCollectionNftCardsList)
},[currentFilterOption])

console.log("filtered list after applying filters",filteredList)
    let count = 0;
    if(currentCardType !== cardTypeList[0].cardId){
        count++;
    }
    if(applyPriceRange.isApply){
        count++;
    }
    if(currentFilterOption !== filterListOptions[0].optionId){
        count++;
    }
    useEffect(() => {
        if (isDisplayFiltersPopup) {
          
          document.body.style.overflow = 'hidden';
        } else {
          
          document.body.style.overflow = 'auto';
        }
    
        
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, [isDisplayFiltersPopup]);
    
    return (
        // for medium devices width is 99.6% because in ipad air width is little overflowing
        <div className='w-[100%] md:w-[99.6%] lg:w-[100%] font-caslon isDisplayFiltersPopup ' onClick={onClickFilterContainer}>
            <div className='relative'>
                <HeroSlider />
                <div className=' absolute top-0 w-[100%] z-20'>
                    <Navbar mobileView={mobileViewHandler} landingPage={true} />
                </div>
                <div  className={`w-full flex items-center justify-center flex-col space-y-8 py-8 absolute top-60 ${mobileView?"z-0":"z-10"}`}>
                    <h1  className="text-[40px] md:text-[80px] xl:text-[100px] 2xl:text-[128px] flex items-center justify-center  leading-none font-[500] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] custom-text-border text-center">
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
                    <h1 className='text-[70px] sm:text-[96px] font-[500] leading-[115px] text-transparent bg-clip-text bg-gradient-to-r from-[#FBCEA0] via-[#FFF9F2] to-[#FBCEA0] custom-text-border'>
                        {t('collectionText')}
                        </h1>
                    <div className='w-[40%]'>
                        <img src="/Hero/frame.svg" alt="" />
                    </div>
                </div>
                {/* Collection details and its nfts part */}
                {noCollections ? (
                    <div className='w-full h-[50vh] flex items-center justify-center'>
                        <h1 className='text-[33px] md:text-[50px] text-[#FCD37B] text-center'>No Collections Found</h1>
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
                            <div className="hidden md:flex md:items-center md:gap-2 lg:hidden">
                                <Skeleton count={1} height={40} width={190} />
                                <Skeleton count={1} height={40} width={190} />
                            </div>

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
                                {/* <img src="/Hero/celtic_updated_coll_image.png" alt="" className='hidden sm:flex'/> */}
                                <img src="/Hero/celtic_hero.png" alt="" className='flex items-center justify-center w-full sm:hidden'  />
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
                                <h1 className='text-center text-[44px]  sm:ml-0 sm:text-start sm:text-[54] lg:text-[64]  font-[400] leading-[54px] custom-text-border'>{collections[currentIndex].name}</h1>
                                <h2 className='text-center sm:text-start w-[100%] lg:w-[70%]'>{[collections[currentIndex].description]}</h2>
                            </>
                         )}

                            </div>
                        </div>
                        <div className='hidden sm:flex items-center justify-between text-[12px] md:text-sm lg:text-base ml-2'>
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
                                    onClick={(e)=>{e.stopPropagation();onClickAnyFilter(dropdownItems.type)}}
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
                                    onClick={(e)=>{e.stopPropagation();onClickAnyFilter(dropdownItems.price)}}
                                    className={`rounded-full flex justify-center items-center gap-1 w-full
                                     p-2 bg-[#000] text-[#FCD378]  hover:border-[#FCD378] border-2 ${currentDropDown === dropdownItems.price ? "border-[#FCD378]" : " border-gray-800"}`}
                                >
                                    <CiDollar size={22} />
                                        Price
                                    (
                                        {`${
                                                !isNaN(applyPriceRange.from) && !isNaN(applyPriceRange.to)
                                                    ? `${applyPriceRange.from} - ${applyPriceRange.to} `
                                                    : ""
                                            }`} ICP)
                                </button>
                                    {currentDropDown === dropdownItems.price && (
                                      <div className='absolute top-10 -left-3 mt-2 bg-black text-[#FCD378] rounded shadow-lg  p-4 z-50 w-[120%] h-[150px] flex flex-col items-center justify-around'
                                        onClick={(e)=> e.stopPropagation()}
                                      >
                                            <h1>Price in ICP</h1>
                                            <div className='flex flex-col items-center md:flex-row'>
                                                <input value={fromPrice} onChange={(e)=>{
                                                updateFromPrice(parseInt(e.target.value));
                                                }}
                                                placeholder='From' type='number' className='w-20 mb:2 md:mb-0 md:mr-3 rounded-sm border text-[#FCD378] border-[#FCD378] bg-transparent outline-none p-1 text-sm'  />
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
                            <div className=' relative lg:ml-auto mr-2 lg:mr-20 w-[160px] h-[40px] md:w-[180px] bottom-6'>
                            <span className='relative top-3 text-xs bg-gray-800 text-[#FCD378] rounded-full px-2 z-10 left-5 '>Filter & Sort</span>
                            <button
                                    onClick={(e)=>{e.stopPropagation();onClickAnyFilter(dropdownItems.filter)}}
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
                      <div className='flex items-center  mt-5'>
                      <button
                            className={`rounded-full flex justify-center items-center w-[120px] h-[35px] gap-1 
                            p-2 bg-[#000] text-[#FCD378] border-2 border-gray-800 ml-5 mr-2 sm:hidden`}
                            onClick={()=>updateFiltersDisplayStatus(true)}
                        >
                            <LuFilter />
                            Filters 
                            {count >0 &&  <span className='size-5 border-none bg-gray-800 rounded-full flex justify-center items-center pt-0.5 '>{count}</span>}
                      </button>
                     {count > 0 && (
                         <button className='rounded-full flex justify-center items-center w-[120px] h-[35px] gap-1 
                         p-2 bg-[#000] text-[#FCD378] border-2 border-gray-800 mr-5 sm:hidden'
                         onClick={onClickResetButton}
                         >
                             <GrPowerReset />
                     Reset
                   </button>
                     )}
                      </div>
                        {filteredList.length >0? (
                            <NFTGallery currentCollection={filteredList}  />
                        ) : (
                            noCards || (selectedCollectionNftCardsList.length>0 && filteredList.length===0) ? (
                              <div className='w-[100%] h-[42vh] flex items-center justify-center'>
                                    <h1 className='text-[#FCD37B] text-4xl'>No cards found.</h1>
                              </div>
                           ):(
                            <div className="pb-10">
                            <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                              <div className="justify-around hidden gap-5 m-5 sm:grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                {Array.from({ length: 10 }).map((_, index) => (
                                  <Skeleton
                                    key={index}
                                    count={1}
                                    width={210}
                                    height={300}
                                  />
                                ))}
                              </div>
                              <div className='flex justify-center items-center mt-3 md:hidden'>
                                <Skeleton count={1} width={210} height={300} />
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
            {isDisplayFiltersPopup && (
                <div className='fixed top-0 bottom-0 left-0 right-0 z-20 w-screen h-screen md:hidden'>
                    <div className='w-screen h-screen top-0 bottom-0 right-0 left-0 fixed bg-[rgba(49,49,49,0.8)]'>
                            <div className='flex items-center justify-center h-screen w-screen '>
                                <div className={`h-[40vh] w-[90vw] bg-[#111] rounded-md p-5 overflow-auto `}>
                                    <div className="flex items-center justify-end">
                                        <button
                                            className="text-[#FCD378] bottom-1 z-10"
                                            onClick={() => updateFiltersDisplayStatus(false)}
                                            >
                                            <RxCross2 size={20} />
                                        </button>
                                    </div>
                                    <div className='flex flex-col items-center justify-around h-[80%] text-[16px]'>
                                        <div className="relative w-full flex justify-center">
                                        {currentDropDown === dropdownItems.type && (
                                                    <ul className="absolute top-10 left-0 mt-2 bg-black border border-[#FCD378] text-[#FCD378] rounded shadow-lg  p-0 list-none z-50 w-full h-[130px] overflow-y-auto ">
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
                                                onClick={(e)=>{e.stopPropagation();onClickAnyFilter(dropdownItems.type)}}
                                                className={`rounded-md flex justify-center items-center gap-1 
                                                w-full h-full p-2 bg-[#000]  text-[#FCD378]  hover:border-[#FCD378] border border-[#FCD378] ${currentDropDown === dropdownItems.filter && "opacity-10"} `}
                                            >
                                                <BiCategory />
                                                Category
                                                ({currentCardType.charAt(0)}{currentCardType.slice(1).toLowerCase()})
                                            </button>
                                                
                                        </div>
                                        <div className="relative w-full  flex justify-center">
                                            <button
                                                onClick={(e)=>{e.stopPropagation();onClickAnyFilter(dropdownItems.price)}}
                                                className={`rounded-md flex justify-center items-center gap-1 w-[100%]
                                                p-2 bg-[#000] text-[#FCD378]  border border-[#FCD378]`}
                                            >
                                                <CiDollar size={20} />
                                                    Price
                                                (
                                                    {`${
                                                            !isNaN(applyPriceRange.from) && !isNaN(applyPriceRange.to)
                                                                ? `${applyPriceRange.from} - ${applyPriceRange.to} `
                                                                : ""
                                                        }`} ICP)
                                            </button>
                                                {currentDropDown === dropdownItems.price && (
                                                <div className='absolute top-10  mt-2 border border-[#FCD378] bg-black text-[#FCD378] rounded shadow-lg  p-1 z-50 w-[100%] h-[120px] flex flex-col items-center justify-around'
                                                onClick={(e)=>e.stopPropagation()}
                                                >
                                                        <h1>Price in ICP</h1>
                                                        <div className='flex items-center'>
                                                            <input value={fromPrice} onChange={(e)=>{
                                                            updateFromPrice(parseInt(e.target.value));
                                                            }}
                                                            placeholder='From' type='number' className='w-20 mr-2 rounded-sm border text-[#FCD378] border-[#FCD378] bg-transparent outline-none p-1 text-sm'  />
                                                            <input value={toPrice} onChange={(e)=> { updateToPrice(parseInt(e.target.value))}} placeholder='to' type='number' className='w-20 rounded-sm border text-[#FCD378] border-[#FCD378] bg-transparent outline-none p-1 text-sm'/>
                                                        </div>
                                                        <div className=''>
                                                            <button className={`w-[80px] border-none bg-[#FCD378] text-black h-[24px] mr-3 rounded-full ${(isNaN(applyPriceRange.from)|| isNaN(applyPriceRange.to))?"opacity-20":"opacity-100"} `}
                                                                disabled={isNaN(applyPriceRange.from) || isNaN(applyPriceRange.to)}
                                                                onClick={()=>{onClickAnyFilter(dropdownItems.none);updateApplyPriceRange({isApply:false,from:NaN,to:NaN}); updateFromPrice(NaN); updateToPrice(NaN)}}
                                                            >Cancel</button>
                                                            <button className={`w-[80px] border-none bg-[#FCD378] text-black h-[24px] rounded-full ${(isNaN(fromPrice) || isNaN(toPrice)) ? "opacity-20":"opacity-100"}`}
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
                                        <div className='relative  h-[40px] w-full bottom-5 '>
                                        <span className='relative top-3 text-xs bg-gray-800 text-[#FCD378] rounded-full px-2 z-10 left-5 '>Filter & Sort</span>
                                        <button
                                                onClick={(e)=>{e.stopPropagation();onClickAnyFilter(dropdownItems.filter)}}
                                                className={` absolute rounded-md flex justify-center items-center gap-1 
                                                w-full h-full p-2 bg-[#000] text-[#FCD378]  border-[#FCD378] border ${currentDropDown === dropdownItems.type && "opacity-5"}  `}
                                            >
                                                < RiArrowUpDownFill />
                                                {currentFilterOption}
                                            </button>
                                            {currentDropDown === dropdownItems.filter && (
                                               
                                                    <ul className="absolute bottom-[30px] left-0 mt-2 border border-[#FCD378]  bg-black text-[#FCD378] rounded shadow-lg  p-0 list-none z-50 w-full h-[130px] overflow-y-auto ">
                                                        {filterListOptions.map((eachFilter,index)=>(
                                                            <>
                                                                <div key={eachFilter.optionId} className='flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-purple-900'
                                                                onClick={()=>{if(eachFilter.optionId != currentFilterOption){updateCurrentFilterOption(eachFilter.optionId); onClickAnyFilter(dropdownItems.filter)}}}>
                                                                    <li key={eachFilter.optionId} className='h-[30px]'>{eachFilter.displayText}</li>
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
                                </div>
                            </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Hero