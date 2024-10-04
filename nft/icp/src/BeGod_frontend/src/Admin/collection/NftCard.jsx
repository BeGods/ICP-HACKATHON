import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./nftcard.css";

const NftCard = ({ id, list }) => {
  const [nftColor, setNftColor] = useState("");

  useEffect(() => {
    if (list?.nonfungible?.metadata?.[0]?.json) {
      const metadataJson = list.nonfungible.metadata[0].json;
      const parsedMetadata = JSON.parse(metadataJson);
      const nftColor = parsedMetadata.nftcolor;
      setNftColor(nftColor);
    }
  }, [list]);

  return (
    <div
      className="rounded-lg flip-card"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}
    >
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front flex items-center justify-center">
          <img
            src={list.nonfungible.thumbnail}
            alt={`${list.nonfungible.name}`}
            className="w-[98%] h-[98%] rounded-lg object-cover"
          />
        </div>
        {/* Back Side */}
        <div className="relative flex flex-col items-center justify-center text-white flip-card-back">
          <img
            src={list.nonfungible.thumbnail}
            alt={`${list.nonfungible.name}`}
            className="object-cover blur-sm w-[98%] h-[98%]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black rounded-lg bg-opacity-60">
            <h1 className="text-xl font-extrabold sm:text-3xl lg:text-2xl">
              {list.nonfungible.name}
            </h1>
            <h2 className="text-xs sm:text-lg mt-1 text-center">{id}</h2>
            <Link
              to={`/Admin/collection/collectionDetails/${id}/nft/${id}`}
              className="w-full flex justify-center items-center"
              state={{ list }}
            >
              <button className="flex items-center justify-center mt-4 w-[60%] h-[30px] sm:w-[150px] sm:h-[32px] bg-blue-400 text-black border-3px border-gray-100 shadow-lg transform transition-transform hover:scale-105 font-caslon">
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
