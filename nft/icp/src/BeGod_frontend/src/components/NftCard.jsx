import { Principal } from "@dfinity/principal";
import { useAuth } from "../utils/useAuthClient";
import React from "react";

const NftCard = ({ img }) => {
  const { nonfungible } = img;
  const { backendActor } = useAuth();
  const onClickAddToFavorite = async () => {
    const tokenId = await backendActor?.getNftTokenId(
      Principal.fromText(img.collectionId),
      0
    );
    console.log("token identifier", tokenId);
  };
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
            src={nonfungible.thumbnail}
            alt={`NFT`}
            className="w-[98%] h-[98%] rounded-lg object-cover"
          />
        </div>
        {/* Back Side */}
        <div className="relative flex flex-col items-center justify-center text-white flip-card-back ">
          <img
            src={nonfungible.thumbnail}
            alt={`NFT`}
            className="object-cover blur-sm w-[98%] h-[98%]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black rounded-lg bg-opacity-60">
            <h1 className="text-xl font-extrabold sm:text-3xl lg:text-2xl">
              {nonfungible.cardName}
            </h1>
            <h2 className="mt-2 text-lg sm:text-xl">
              Sold: {nonfungible.sold}/100
            </h2>
            <h2 className="mt-1 text-lg sm:text-xl">1 ICP</h2>
            <button
              onClick={onClickAddToFavorite}
              className="flex items-center justify-center mt-4 w-[60%] h-[30px] sm:w-[150px] sm:h-[32px] bg-blue-400 text-black border-3px border-gray-100 shadow-lg transform transition-transform hover:scale-105 font-caslon"
            >
              Add to Favorite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
