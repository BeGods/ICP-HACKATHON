import React from 'react';

const TopSelling = () => {
  const images = [
    { img1: "/image/nft.png" },
    { img1: "/image/nft.png" },
    { img1: "/image/nft.png" },
    { img1: "/image/nft.png" },
    { img1: "/image/nft.png" },
    { img1: "/image/nft.png" },
  ];

  return (
    <div className="h-[45vh] w-full">
      <h1 style={{fontFamily:"QuickSand"}} className="text-white text-2xl font-medium h-[5vh] w-full flex items-center justify-center mt-4">
        Top Selling
      </h1>
      <div className="flex gap-4 overflow-x-auto px-4 mt-4 pl-[8%] hide-scrollbar">
        {images.map((img, index) => (
          <div key={index} className="h-[40%] w-[15%] flex-shrink-0">
            <img src={img.img1} alt={`NFT ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSelling;
