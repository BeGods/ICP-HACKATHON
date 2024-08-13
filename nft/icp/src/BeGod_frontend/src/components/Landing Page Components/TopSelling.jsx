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
    <div style={{ fontFamily: "QuickSand" }} className="h-[45vh] w-full mt-[23vh] sm:mt-0">
      <h1 className="text-white text-2xl font-medium h-[5vh] w-full flex items-center justify-center mt-4">
        Top Selling
      </h1>
      <div className="flex items-center justify-center gap-4 overflow-x-auto px-4 mt-4 hide-scrollbar">
        {images.map((img, index) => (
          <div className="flip-card" key={index}>
            <div className="flip-card-inner">
              {/* Front Side */}
              <div className="flip-card-front">
                <img src={img.img1} alt={`NFT ${index + 1}`} className="w-full h-full object-cover" />
              </div>
              {/* Back Side */}
              <div className="flip-card-back relative flex flex-col justify-center items-center text-white p-4">
                <img src={img.img1} alt={`NFT ${index + 1}`} className="w-full h-full object-cover blur-sm" />
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-60 rounded-lg">
                  <h1 className="text-xl sm:text-3xl font-extrabold">TANNGIOST</h1>
                  <h2 className="text-lg sm:text-xl mt-2">Sold: 50/100</h2>
                  <h2 className="text-lg sm:text-xl mt-1">0.56 ICP</h2>
                  <button className="mt-4 w-[60%] h-[5vh] sm:w-[40%] sm:h-[3vh] bg-[#FCD37B] text-black shadow-lg transform transition-transform hover:scale-105">
                    Buy Now
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSelling;
