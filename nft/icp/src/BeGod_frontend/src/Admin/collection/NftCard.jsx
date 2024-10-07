import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./nftcard.css";

const NftCard = ({ id, list, collectiondata,quantity }) => {
  const name = list[2]?.nonfungible?.name ?? "Name not found";
  const priceBigInt = list[3]?.[0]?.toString() ?? "Price not found";
  const price = Number(priceBigInt) / 100000000;
  const image = list[2]?.nonfungible?.thumbnail ?? "Image not found";
  const metadataJson = list[2]?.nonfungible?.metadata?.[0]?.json;
  const metadata = metadataJson ? JSON.parse(metadataJson) : null;
  const nftColor = metadata?.nftcolor ?? "Color not found";
  const nftType = metadata?.nfttype ?? "Type not found";

  return (
    <div
      className="rounded-lg flip-card"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={`flip-card-inner border-3} ${
          nftColor === "Golden"
            ? "border-golden"
            : nftColor === "silver"
            ? "border-silver"
            : nftColor === "bronze"
            ? "border-bronze"
            : "border-gray-100"
        }`}
      >
        {/* Front Side */}
        <div className="flip-card-front flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-[98%] h-[98%] rounded-lg object-cover"
          />
        </div>
        {/* Back Side */}
        <div className="relative flex flex-col items-center justify-center text-white flip-card-back">
          <img
            src={image}
            alt={name}
            className="object-cover blur-sm w-[98%] h-[98%]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black rounded-lg bg-opacity-60">
            <h1 className="text-xl font-extrabold sm:text-3xl lg:text-2xl">
              Name: {name}
            </h1>
            <h2 className="text-xs sm:text-lg mt-1 text-center">
              Price: {price} ICP
            </h2>
            <h2 className="text-xs sm:text-lg mt-1 text-center">
              Type: {nftType}
            </h2>

            <h2 className="text-xs sm:text-lg mt-1 text-center">
              Quantity: {quantity}
            </h2>
            <Link
              to={`/Admin/collection/collectionDetails/${id}/nft/${id}`}
              className="w-full flex justify-center items-center"
              state={{ list, collectiondata }}
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
