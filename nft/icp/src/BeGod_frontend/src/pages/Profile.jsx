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
  const [currentOption,updateCurrentOption] = useState("mycollection")
  


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
    const result = await backendActor?.getFavorites("4vjzx-uecpg-txgb6-n5dpd-blies-iofpf-q27ye-lqa6i-b5mth-dyind-eqe")
    console.log("resssssssult" , result);
    updateNoCardsStatus(true);
    setIsCardsLoading(false);
    
  }

 

 

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? selectedList.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === selectedList.length - 1 ? 0 : prevIndex + 1));
  };
//   const { reloadLogin, isAuthenticated } = useAuth();
   const navigate = useNavigate(); 
   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
   
  // console.log("is authenticated in profile section" , isAuthenticated);
  useEffect(()=>{
    if(!isAuthenticated){
      navigate('/')
     }
  },[isAuthenticated]);


  useEffect(() => {
    setCurrentIndex(0);

  },[selectedList])

const {t} = useTranslation();
const { backendActor } = useAuth({});


  const fetchCollections = async() => {
    const collectionList = [];
    const result = await backendActor?.getAllCollections();
    console.log("result",result)
    const collectionItems = result[0][1];

    console.log("collection id list" , collectionItems)

   await Promise.all(
    collectionItems.map(async(eachItem) => {
      const resultOfUserNftCollections = await getDetails(eachItem[1]);
      if(typeof(resultOfUserNftCollections.ok) === typeof([])){
         const collectionDetails = resultOfUserNftCollections.ok;
         console.log(collectionDetails)
         collectionDetails.map((eachItem)=>{
          const cardDetails = eachItem[1].nonfungible;
          
           const metadata = JSON.parse(cardDetails.metadata[0].json)
           console.log("cardDetails",cardDetails);
          // console.log(metadata);
          const nftCard = {
            collectionId:eachItem[0],
            cardName : metadata[0].name,
            cardImageUrl : cardDetails.thumbnail,
            cardSold : "",
          }
           console.log("cardDetails after nft card",nftCard.collectionId);
          collectionList.push(nftCard);
         })
      }
  })
   )
   console.log("collectionList" , collectionList)
   setIsCardsLoading(false)
   if(collectionList.length === 0) {
     updateNoCardsStatus(true);
   }else{
    updateSelectedList(collectionList);
   }
    
  }

  const getDetails =  async(collectionId) => {

    const collectionDetailsResult = await backendActor.userNFTcollection(collectionId,"4vjzx-uecpg-txgb6-n5dpd-blies-iofpf-q27ye-lqa6i-b5mth-dyind-eqe")
    console.log("collection details",collectionDetailsResult);
    return collectionDetailsResult

  }
   

   useEffect(()=>{
      fetchCollections()
   },[])


 
  return (
    <div className='font-caslon'>
      <div style={{ backgroundImage: `url('/Hero/smoke 1.png')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", }}>
        <Navbar />
        <div className='max-w-[1920px] mx-auto pl-[3%] mt-[5%] sm:mt-[3%] flex flex-col lg:flex-row'>
          <div className='w-full lg:w-[30%]'>
            <h1 className='text-center lg:text-start text-[#FFFFFF] text-[32px] sm:text-[36px] leading-[60px] font-[400]'>{t('myProfile')}</h1>
            <div className='flex gap-8 mt-[5%] lg:mt-[2%] ml-[2%]'>
              <div className='w-24'>
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
                className={`text-[25px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${currentOption === "mycollection" ? 'border-b-4 border-[#FFD700] pb-2' : ''}`}
                onClick={() => onOptionChange("mycollection")}
              >
                {t('myCollection')}
              </div>
              <div
                className={`text-[25px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${currentOption === "favorite" ? 'border-b-4 border-[#FFD700] pb-2' : ''}`}
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
            <div className='sm:hidden flex items-center justify-between mt-8 z-0'>
              
              <button onClick={handlePrev}>
                <img src="/Hero/up.png" alt="Previous" className='w-10 h-10 -rotate-90' />
              </button>
              {isCardsLoading?(
                  <SkeletonTheme baseColor="#202020" highlightColor="#444">
                  <div className='mb-8'>
                      <Skeleton count={1} width={250} height={350} />
                  </div>
              </SkeletonTheme>
                  
                ):(
                  noCards ? (
                    <h1 className='text-[#FFD700] text-[22px]'>No Cards Availalbe</h1>
                  ):(
                    <div>
                      <NftCard img={selectedList[currentIndex]} key={currentIndex} />
                    </div>
                  )
                  
                )}
              
              <button onClick={handleNext}>
                <img src="/Hero/down.png" alt="Next" className='w-10 h-10 -rotate-90' />
              </button>
            </div>
          
            {/* Grid view for larger screens */}
            {noCards ? (
                <div className='hidden w-[90%] h-[380px] sm:flex justify-center items-center '>
                  <h1 className='text-[#FFD700] text-[40px]'>No Cards Available</h1>
                </div>
            ):(
              <div className='hidden w-[90%] sm:grid sm:grid-cols-3 2xl:grid-cols-4 gap-24 lg:gap-4 mt-8 sm:mx-10 mb-8'>
             
                    {isCardsLoading ? (
                        <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <div className='flex justify-between  w-full'>
                            <Skeleton count={1} width={200} height={310} />
                        </div>
                        <div>
                        <Skeleton count={1} width={200} height={310} />
                        </div>
                        <div>
                        <Skeleton count={1} width={200} height={310} />
                        </div>
                        <div>
                        <Skeleton count={1} width={200} height={310} />
                        </div>
                    </SkeletonTheme>
                    ):(
                      selectedList.map((img, index) => (
                        <div className='flip-card rounded-lg w-full'>
                          <NftCard img={img} key={index} />
                        </div>
                      ))
                    )}
              
              
            </div>
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
