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
const mycollection = [
  { img1: "/image/nft.png", name: "TANNGIOST", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 25.png", name: "POSIDONE", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 27.png", name: "SET", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 28.png", name: "KARNAYAM", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 22.png", name: "MIDGARD", sold: "50", ICP: "0.56" },
  { img1: "/image/Front.png", name: "CERBERVES", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 43.png", name: "RA", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 45.png", name: "DANU", sold: "50", ICP: "0.56" },
];

const favorite = [

  { img1: "/image/Component 27.png", name: "SET", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 28.png", name: "KARNAYAM", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 22.png", name: "MIDGARD", sold: "50", ICP: "0.56" },
  { img1: "/image/nft.png", name: "TANNGIOST", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 25.png", name: "POSIDONE", sold: "50", ICP: "0.56" },
];

const purchased = [
  { img1: "/image/nft.png", name: "TANNGIOST", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 25.png", name: "POSIDONE", sold: "50", ICP: "0.56" },
];

const Profile = () => {
  const [category, setCategory] = useState("mycollection");
  const [currentIndex, setCurrentIndex] = useState(0);

  const getCategoryData = () => {
    switch (category) {
      case "mycollection":
        return mycollection;
      case "favorite":
        return favorite;
      case "purchased":
        return purchased;
      default:
        return [];
    }
  };

  const images = getCategoryData();

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
//   const { reloadLogin, isAuthenticated } = useAuth();
   const navigate = useNavigate(); 
   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
   
  console.log("is authenticated in profile section" , isAuthenticated);
  useEffect(()=>{
    if(!isAuthenticated){
      navigate('/')
     }
  },[isAuthenticated]);

//   useEffect(() => {
//     // Reload login and set login status when the component mounts
//     const checkLoginStatus = async () => {
//         await reloadLogin(); // Ensure that login status is refreshed
//          // Update state based on authentication
//          console.log("reload check")
//     };

//     checkLoginStatus();
//     console.log("is Authenticated in Profile Section outside condition" , isAuthenticated);

//     if(!isAuthenticated) {
//       console.log("is Authenticated in Profile Section in side condition" , isAuthenticated);
//         navigate('/')
//     }
// }, [isAuthenticated, reloadLogin]); 
 

  useEffect(() => {
    setCurrentIndex(0);

  },[category])

const {t} = useTranslation();


 
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
                className={`text-[25px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${category === "mycollection" ? 'border-b-4 border-[#FFD700] pb-2' : ''}`}
                onClick={() => setCategory("mycollection")}
              >
                {t('myCollection')}
              </div>
              <div
                className={`text-[25px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${category === "favorite" ? 'border-b-4 border-[#FFD700] pb-2' : ''}`}
                onClick={() => setCategory("favorite")}
              >
                {t('favorite')}
              </div>
              <div
                className={`text-[25px] sm:text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${category === "favorite" ? 'border-b-4 border-[#FFD700] pb-2' : ''}`}
              >
                My Achievements
              </div>
            </div>

            {/* Small screen view for single image display with prev and next buttons */}
            <div className='sm:hidden flex items-center justify-between mt-8 z-0'>
              <button onClick={handlePrev}>
                <img src="/Hero/up.png" alt="Previous" className='w-10 h-10 -rotate-90' />
              </button>
              <div>
                <NftCard img={images[currentIndex]} key={currentIndex} />
              </div>
              <button onClick={handleNext}>
                <img src="/Hero/down.png" alt="Next" className='w-10 h-10 -rotate-90' />
              </button>
            </div>
          
            {/* Grid view for larger screens */}
            <div className='hidden w-[90%] sm:grid sm:grid-cols-3 2xl:grid-cols-4 gap-24 lg:gap-4 mt-8 sm:mx-10 mb-8'>
             
              {images.map((img, index) => (
                 <div className='flip-card rounded-lg w-full'>
                  <NftCard img={img} key={index} />
                 </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: "no-repeat" }} className='overflow-hidden relative bg-center bg-cover'>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
