import React, { useState } from 'react';
import Navbar from '../components/Landing Page Components/Navbar';
import Footer from '../components/Footer';
import NftCard from '../components/NftCard';

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
  { img1: "/image/nft.png", name: "TANNGIOST", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 25.png", name: "POSIDONE", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 27.png", name: "SET", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 28.png", name: "KARNAYAM", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 22.png", name: "MIDGARD", sold: "50", ICP: "0.56" },
];

const purchased = [
  { img1: "/image/nft.png", name: "TANNGIOST", sold: "50", ICP: "0.56" },
  { img1: "/image/Component 25.png", name: "POSIDONE", sold: "50", ICP: "0.56" },
];

const Profile = () => {
  const [category, setCategory] = useState("mycollection");

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

  return (
    <div style={{ fontFamily: "QuickSand" }}>
      <Navbar />
      <div className='ml-[4%] mt-[3%]'>
        <h1 className='text-[#FFFFFF] text-[48px] leading-[60px] font-[400]' style={{ fontFamily: "QuickSand" }}>My Profile</h1>
        <div className='flex gap-8 mt-[2%] ml-[2%]'>
          <div className=''>
            <img src="/image/Frame.png" alt="" />
          </div>
          <div>
            <h1 className='text-[32px] font-[400] text-[#FFFFFF] leading-[40px]'>Barry</h1>
            <h2 className='text-[22px] font-[400] text-[#FFFFFF] leading-[25px]'>Wallet ID: 581918156</h2>
            <h2 className='text-[22px] font-[400] text-[#FFFFFF] leading-[25px]'>Balance: 200 ICP</h2>
          </div>
        </div>

        <div className='mt-[3%] ml-[2%]'>
          <div className='flex gap-[10%]'>
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
            <div
              className={`text-[32px] font-[400] text-[#FFFFFF] leading-[40px] cursor-pointer ${category === "purchased" ? 'border-b-4 border-[#FFD700] pb-2' : ''}`}
              onClick={() => setCategory("purchased")}
            >
              Purchased
            </div>
            <div className='text-[32px] font-[400] text-[#FFFFFF] leading-[40px]'>
              Activity
            </div>
          </div>
        </div>
      </div>
      <div className='w-[1319px] ml-[8%] mt-[3%] grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6  gap-y-8'>
        {
          images.map((img, index) => (
            <NftCard img={img} key={index} />
          ))
        }
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
