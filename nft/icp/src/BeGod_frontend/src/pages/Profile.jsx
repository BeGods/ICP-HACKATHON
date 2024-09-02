import React, { useEffect, useState } from 'react';
import Navbar from '../components/Landing Page Components/Navbar';
import Footer from '../components/Footer';
import NftCard from '../components/NftCard';
import { Link } from 'react-router-dom';
import YellowButton from '../components/button/YellowButton';
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

  useEffect(() => {
    setCurrentIndex(0);

  },[category])

  return (
    <div className='' style={{ fontFamily: "QuickSand" }}>
      <div style={{ backgroundImage: `url('/Hero/smoke 1.png')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", }}>
        <Navbar />
        <div style={{ fontFamily: "QuickSand" }} className='max-w-[1920px] mx-auto pl-[3%] mt-[3%] flex flex-col lg:flex-row'>
          <div className='w-full lg:w-[30%]'>
            <h1 className='text-center lg:text-start text-[#FFFFFF] text-[48px] leading-[60px] font-[400]' style={{ fontFamily: "QuickSand" }}>My Profile</h1>
            <div className='flex gap-8 mt-[5%] lg:mt-[2%] ml-[2%]'>
              <div>
                <img src="/image/Frame.png" alt="" />
              </div>
              <div>
                <h1 className='text-[32px] font-[400] text-[#FFFFFF] leading-[40px]'>Barry</h1>
                <h2 className='text-[22px] font-[400] text-[#FFFFFF] leading-[25px]'>Wallet ID: 581918156</h2>
                <h2 className='text-[22px] font-[400] text-[#FFFFFF] leading-[25px]'>Balance: 200 ICP</h2>
              </div>
            </div>
          </div>

          <div className='w-full lg:w-[70%]'>
            <div className='flex items-center justify-center gap-[10%] mt-8 lg:mt-0'>
              <div
                className={`text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${category === "mycollection" ? 'border-b-4 border-[#FFD700] pb-2' : ''}`}
                onClick={() => setCategory("mycollection")}
              >
                My Collection
              </div>
              <div
                className={`text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${category === "favorite" ? 'border-b-4 border-[#FFD700] pb-2' : ''}`}
                onClick={() => setCategory("favorite")}
              >
                Favorite
              </div>
            </div>

            {/* Small screen view for single image display with prev and next buttons */}
            <div className='sm:hidden flex items-center justify-between mt-8'>
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
            <div className='mt-8 flex sm:hidden items-center justify-center'>
              <Link to="" className='mb-8 sm:hidden w-[219px] lg:w-[20%] p-2 border-[1px] border-[#FCD37B]'>
                <YellowButton>Explore <span>Celtic</span> Collection</YellowButton>
              </Link>
            </div>
            {/* Grid view for larger screens */}
            <div className='hidden sm:grid mt-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-8 sm:mb-8'>
              {images.map((img, index) => (
                <NftCard img={img} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontFamily: "CaslonAntique", backgroundImage: `url('/Hero/footer 1.png')`, backgroundRepeat: "no-repeat" }} className='overflow-hidden relative bg-center bg-cover'>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
