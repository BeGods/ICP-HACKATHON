import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { useEffect } from "react";
import { collection } from "../../TextData";
import { useLocation, useParams } from "react-router-dom";
import YellowButton from "../../components/button/YellowButton";
import BackButton from "./BackButton";
import NftCard from "../../components/NftCard";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../../utils/useAuthClient.jsx";

function CollectionDetails() {
  const { backendActor } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const { nft } = location.state || {};
  console.log(nft[1]);
  // var pricID = Principal.toText(nft[1]);
  // console.log(pricID);

  if (!nft) {
    return <p>No NFT data available</p>; // if no data is passed
  }

  console.log(nft);

  // // getAllCollectionNFTs
  // var princi = nft[1];
  // const getAllCollectionNFT = async (princi) => {
  //   // console.log("in function",nft[1]);
  //   const principalString = princi;
  //   const principal = Principal.toText(principalString);
  //   try {
  //     const result = await backendActor?.getAllCollectionNFTs(princi);

  //     console.log("NFT collection:", result);
  //   } catch (error) {
  //     console.error("Error fetching get all collection NFT:", error);
  //   }
  // };

  // useEffect(() => {
  //   getAllCollectionNFT(princi);
  // }, []);

  return (
    <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar  no-scroll 2xl:ml-[7%] md:w-full lg:w-[90%] lg:pt-20">
      <div className="w-full">
        {/* Back button and action buttons */}
        <div className="flex items-center justify-between w-full pt-9">
          <BackButton />
          <div className="flex justify-end w-full ml-auto lg:-ml-12 gap-x-6 md:ml-0 sm:ml-auto">
            <YellowButton>Remove Collection</YellowButton>
          </div>
        </div>

        {/* Collection details section */}
        <div className="flex flex-col md:flex-row gap-x-8 items-center bg-[#414141] w-full  p-10 text-[#FFFFFF]  rounded-md my-10 justify-between">
          <img className="w-32 h-32" src={nft[3]} alt={nft[2]} />
          <div className="space-y-4">
            <div className="flex justify-between">
              <h1 className="text-sm font-semibold md:text-3xl">{nft[2]}</h1>
              <p className="font-semibold text-md">Created on - Date</p>
            </div>
            <p className="text-sm font-normal font-Quicksand md:text-xl">
              details backend me store nhi ki hai
            </p>
            <h3 className="text-sm font-bold font-Quicksand md:text-xl">
              Collection ID - {id}
            </h3>
          </div>
        </div>

        {/* NFT list section */}
        <div className="w-full pb-12 text-white">
          <h1 className="text-2xl">List of all NFT Collection - {nft[0]}</h1>
          <div className="flex flex-row justify-between gap-5 mt-8 overflow-x-auto overflow-y-hidden sm:flex-wrap md:gap-8 xl:gap-5">
            {/* {NftList?.map((list, index) => (
              <NftCard id={id} list={list} img={list} key={index} />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectionDetails;
