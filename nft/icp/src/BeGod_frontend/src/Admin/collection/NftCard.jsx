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
      className="nftcard-container"
      style={{
        border: "5px solid",
        borderColor: nftColor || "golden",
      }}
    >
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front flex items-center justify-center">
          <img
            src={list.nonfungible.thumbnail}
            alt={`${list.nonfungible.name}`}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
        {/* Back Side */}
        <div className="flip-card-back relative flex flex-col justify-center items-center text-white">
          <img
            src={list.nonfungible.thumbnail}
            alt={`${list.nonfungible.name}`}
            className="object-cover blur-sm w-full h-full"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-60 rounded-lg p-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-center">
              {list.nonfungible.name}
            </h1>
            <h2 className="text-xs sm:text-lg mt-1 text-center">{id}</h2>
            <Link
              to={`/Admin/collection/collectionDetails/${id}/nft/${id}`}
              className="w-[50%]"
              state={{ list }}
            >
              <button className=" mt-4 w-full sm:w-[100%] h-10 sm:h-12 bg-blue-400 text-black border border-white shadow-lg transform transition-transform hover:scale-105 flex items-center justify-center rounded">
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
