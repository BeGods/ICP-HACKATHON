import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './nftcard.css';

const NftCard = ({ id, list }) => {
    return (
        <Link to={`/collection/collectionDetails/${id}/nft/${list.License_No}`} 
            className="flip-card border rounded-lg"
            style={{
              border: '5px solid transparent',
              borderImage: `url('/image/goldbg.png') 30`, // Adjust the number and method as per your requirements
              borderRadius:"5px"
            }}
          >
            <div className="flip-card-inner ">
              {/* Front Side */}
              <div className="flip-card-front flex items-center justify-center ">
                <img src={list.img} alt={`${list.NFTName}`} className="w-[98%] h-[98%] rounded-lg object-cover" />
              </div>
              {/* Back Side */}
              <div className="flip-card-back relative flex flex-col justify-center items-center text-white ">
                <img src={list.img} alt={`${list.NFTName}`} className="object-cover blur-sm w-[98%] h-[98%]" />
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-60 rounded-lg">
                  <h1 className="text-xl sm:text-3xl font-extrabold">{list.NFTName}</h1>
                  <h2 className="text-lg sm:text-xl mt-2">Sold: {list.Sold}/100</h2>
                  <h2 className="text-lg sm:text-xl mt-1">{list.License_No}</h2>
                  <button className="mt-4 w-[60%] h-[5vh] sm:w-[50%] sm:h-[3vh] bg-blue-400 text-black border-[1px] border-white shadow-lg transform transition-transform hover:scale-105">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Link>
    );
};

export default NftCard;
