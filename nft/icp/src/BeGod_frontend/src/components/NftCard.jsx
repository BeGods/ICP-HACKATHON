import React from "react";

const NftCard = ({ list }) => {
  const asset = list.nonfungible.asset;
  const description = list.nonfungible.description;
  const metadata = list.nonfungible.metadata;
  const name = list.nonfungible.name;
  const thumbnail = list.nonfungible.thumbnail;
  console.log(asset, description, metadata, name, thumbnail);
  return (
    <div
      className="rounded-lg flip-card"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flip-card-inner ">
        {/* Front Side */}
        <div className="flex items-center justify-center flip-card-front ">
          <img
            src={thumbnail}
            alt={`NFT`}
            className="w-[98%] h-[98%] rounded-lg object-cover"
          />
        </div>
        {/* Back Side */}
        <div className="relative flex flex-col items-center justify-center text-white flip-card-back ">
          <img
            src=""
            alt={`NFT`}
            className="object-cover blur-sm w-[98%] h-[98%]"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-60 rounded-lg">
            <h1 className="text-xl sm:text-3xl lg:text-2xl font-extrabold">
              {name}
            </h1>
            <h2 className="text-lg sm:text-xl mt-2">Sold: /100</h2>
            <h2 className="text-lg sm:text-xl mt-1"> ICP</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
