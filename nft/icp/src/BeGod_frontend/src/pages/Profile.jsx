import React, { useEffect, useState } from 'react';
import Navbar from '../components/Landing Page Components/Navbar';
import Footer from '../components/Footer';
import NftCard from '../components/NftCard';
import { Link } from 'react-router-dom';
import YellowButton from '../components/button/YellowButton';
import { useAuth } from '../utils/useAuthClient';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import toast from 'react-hot-toast';
import NftCardProfile from '../components/NftCardProfile';




const mycollection = [

];


const favorite = [

];


const purchased = [

  { img1: "/image/nft.png", name: "TANNGIOST", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 25.png", name: "POSIDONE", sold: "50", ICP: "0.56" },

];





const Profile = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCardsLoading,setIsCardsLoading] = useState(true);
  const [noCards,updateNoCardsStatus] = useState(false);

  const [selectedList , updateSelectedList] = useState([]);
  const [currentOption,updateCurrentOption] = useState("mycollection");

  const [favIds,setFavIds] = useState(undefined);
  
  const { principal } = useAuth();


  const onOptionChange = async(updatedOption) => {
    updateCurrentOption(updatedOption)
    if(updatedOption !== currentOption){
      updateNoCardsStatus(false);
      setIsCardsLoading(true)
      if(updatedOption === "mycollection"){
        await fetchCollections();
      }else if(updatedOption === "favorite"){
        await fetchFavoriteCards();
      }
    }

  } 

  const fetchFavoriteCards = async() => {
    const result = await backendActor?.getFavorites(principal)
    console.log("resssssssult" , result);
    if(result.ok?.length>0){

      const favItems = result.ok;

      const favCardslist = favItems.map((eachFavToken)=>{
       for(let i=0;i<selectedList.length;i++){
        if(selectedList[i].tokenId === eachFavToken){
          return selectedList[i];
        }
       }
      })

      console.log("favList",favCardslist)

      setIsCardsLoading(false);

      updateSelectedList(favCardslist);


    }else{
      
      updateNoCardsStatus(true);
      
    }
    
  }

 

 

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? selectedList.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === selectedList.length - 1 ? 0 : prevIndex + 1));
  };

   const navigate = useNavigate(); 
   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
   
  //  console.log("is authenticated in profile section" , isAuthenticated);
  useEffect(()=>{
    if(!isAuthenticated){
      navigate('/')
     }else{
      console.log(principal,'principal')
     }
  },[isAuthenticated]);


  useEffect(() => {
    setCurrentIndex(0);

  },[selectedList])

const {t} = useTranslation();
const { backendActor } = useAuth({});

  const checkIsFavourite = async(tokenId) => {
      const ids = await backendActor?.getFavorites(principal);
      console.log("iddddddddds",ids.ok);
      if(ids.ok.length>0){
        console.log("inside if")
        for(let i=0;i<ids.ok.length;i++){
        console.log("fav token id",ids.ok[i]);
        if(ids.ok[i] == tokenId){
          return true;
        }
      }
      }
      
      return false;
  

  }

  const fetchCollections = async () => {
    const collectionList = [];
    setIsCardsLoading(true);  
  
    try {
      const result = await backendActor?.getAllCollections();
      const collectionItems = result[0][1];
  
      // console.log("collection id list", collectionItems);
  
      await Promise.all(
        collectionItems.map(async (eachItem) => {
          try {
            const resultOfUserNftCollections = await getDetails(eachItem[1]);
            if (Array.isArray(resultOfUserNftCollections.ok)) {
              const collectionDetails = resultOfUserNftCollections.ok;
              console.log("collection details", collectionDetails);
  
              // Process each NFT card in the collection
              await Promise.all(
                collectionDetails.map(async (eachDetail) => {
                  const cardDetails = eachDetail[1].nonfungible;
                  const metadata = JSON.parse(cardDetails.metadata[0].json);
  
                  // Check if the item is a favorite
                  const isFav = await checkIsFavourite(eachDetail[0]);
                  console.log("is fav after calling",isFav)
  
                  // Create the nftCard object
                  const nftCard = {
                    tokenId: eachDetail[0],
                    cardName: cardDetails?.name,
                    cardImageUrl: cardDetails?.thumbnail,
                    cardSold: "", // Placeholder, replace with actual data if necessary
                    isFavourite: isFav,
                  };
  
                  collectionList.push(nftCard);
                  // console.log("nft card", nftCard);
                })
              );
            }
          } catch (error) {
            console.error("Error fetching details for collection item", eachItem, error);
          }
        })
      );
  
      // console.log("collectionList", collectionList);
  
      
      if (collectionList.length === 0) {
        updateNoCardsStatus(true);
      } else {
        updateSelectedList(collectionList);
      }
  
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setIsCardsLoading(false); 
    }
  };
  

  const getDetails =  async(collectionId) => {
    console.log(collectionId,principal)
    const collectionDetailsResult = await backendActor.userNFTcollection(collectionId,principal)
    //  console.log("collection details in getDetails",collectionDetailsResult);
    return collectionDetailsResult

  }
   

   useEffect(()=>{
      fetchCollections()
   },[])


   console.log("selected List",selectedList);

const removeFromFavorites = async(tokenId) => {
  const removeFavResult = await backendActor?.removeFromFavorites(principal,tokenId);
  console.log("remove fav result",removeFavResult);
  toast.success(removeFavResult.ok);
  if(currentOption === "favorite"){
    fetchFavoriteCards();
  }else{
    const modifiedSelectedList = selectedList.map((eachItem)=>{
      if(eachItem.tokenId === tokenId){
        return {
          ...eachItem,
          isFavourite:false,
         }
      }
      return eachItem;
     })
     updateSelectedList(modifiedSelectedList)

  }
}

const addToFavorites = async(tokenId)=>{
  const result = await backendActor?.addToFavorites(principal,tokenId);
            console.log("add to fav result",result.ok);
            if(result.ok){
                // fetchCollections();
                
                const modifiedSelectedList = selectedList.map((eachItem)=>{
                  if(eachItem.tokenId === tokenId){
                    return {
                      ...eachItem,
                      isFavourite:true,
                     }
                  }
                  return eachItem;
                 })
                 updateSelectedList(modifiedSelectedList)
                 toast.success(result.ok)

            }else{
                toast.error(result.err.Other)
            }

            
    
}
 
  return (
    <div className='font-caslon'>
      <div style={{ backgroundImage: `url('/Hero/smoke 1.png')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", }}>
        <Navbar />
        <div className='max-w-[1920px] mx-auto pl-[3%] mt-[5%] sm:mt-[3%] flex flex-col lg:flex-row'>
          <div className='w-full lg:w-[30%]'>
            <h1 className='text-center lg:text-start text-[#FFFFFF] text-[32px] sm:text-[48px] leading-[60px] font-[400]'>{t('myProfile')}</h1>
            <div className='flex gap-8 mt-[5%] lg:mt-[2%] ml-[2%]'>
              <div>
                <img src="/image/Frame.png" alt="" />
              </div>
              <div>
                <h1 className='text-[20px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px]'>Barry</h1>
                <h2 className='ext-[20px] sm:text-[22px] font-[400] text-[#FFFFFF] leading-[25px]'>Wallet ID: 581918156</h2>
                <h2 className='ext-[20px] sm:text-[22px] font-[400] text-[#FFFFFF] leading-[25px]'>Balance: 200 ICP</h2>
              </div>
            </div>
          </div>

          <div className='w-full lg:w-[70%]'>
            <div className='flex items-center justify-center gap-[10%] mt-8 lg:mt-0'>
              <div
                className={`text-[25px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${currentOption === "mycollection" ? 'border-b-4 border-[#FFD700]' : ''}`}
                onClick={() => onOptionChange("mycollection")}
              >
                {t('myCollection')}
              </div>
              <div
                className={`text-[25px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${currentOption === "favorite" ? 'border-b-4 border-[#FFD700]' : ''}`}
                onClick={() => onOptionChange("favorite")}
              >
                {t('favorite')}
              </div>
              {/* <div
                className={`text-[25px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${category === "favorite" ? 'border-b-4 border-[#FFD700] pb-2' : ''}`}
              >
                My Achievements
              </div> */}
            </div>

            {/* Small screen view for single image display with prev and next buttons */}
            <div className='z-0 flex items-center justify-between mt-8 sm:hidden'>
              
              <button onClick={handlePrev}>
                <img src="/Hero/up.png" alt="Previous" className='w-10 h-10 -rotate-90' />
              </button>
              {isCardsLoading?(
                  <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                  <div className='mb-8'>
                      <Skeleton count={1} width={250} height={350} />
                  </div>
              </SkeletonTheme>
                  
                ):(
                  noCards ? (
                    <h1 className='text-[#FFD700] text-[22px] my-20'>No Cards Availalbe</h1>
                  ):(
                    <div>
                      <NftCard img={selectedList[currentIndex]} key={currentIndex} removeFromFavorites={removeFromFavorites} addToFavorites = {addToFavorites}/>
                    </div>
                  )
                  
                )}
              
              <button onClick={handleNext}>
                <img src="/Hero/down.png" alt="Next" className='w-10 h-10 -rotate-90' />
              </button>
            </div>
          
            {/* Grid view for larger screens */}
            {noCards ? (
                <div className='hidden w-[90%] h-[65vh] sm:flex justify-center items-center '>
                  <h1 className='text-[#FFD700] text-[40px]'>No Cards Available</h1>
                </div>
            ):(
              
               (isCardsLoading ? (
                        <div className="pb-10">
                        <SkeletonTheme baseColor="#161616" highlightColor="#202020">
                          <div className="hidden md:grid justify-around md:grid-cols-3 xl:grid-cols-4  gap-5 m-5">
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
                    ):(
                      <div className='hidden w-[90%] h-[65vh] sm:grid sm:grid-cols-3 2xl:grid-cols-4 gap-24 lg:gap-4 mt-8 sm:mx-10 mb-8'>
                      {selectedList.length > 0 && selectedList.map((img, index) => (
                        <div className='w-full  rounded-lg flip-card'>
                          <NftCard img={img} key={index} removeFromFavorites={removeFromFavorites} addToFavorites = {addToFavorites} />
                        </div>
                      ))}
                    </div>
                    ))
              
              
           
            )}
          </div>
        </div>
      </div>

      <div style={{backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: "no-repeat" }} className='relative overflow-hidden bg-center bg-cover'>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
