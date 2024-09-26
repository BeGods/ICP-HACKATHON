import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { collection } from "../../TextData";
import { useLocation, useParams } from "react-router-dom";
import YellowButton from "../../components/button/YellowButton";
import BackButton from "./BackButton";
import NftCard from "../../components/NftCard";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../../utils/useAuthClient.jsx";

function CollectionDetails() {
  const [nftList, setnftList] = useState([]);
  const { backendActor } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const { collectiondata } = location.state || {};

  // var pricID = Principal.toText(nft[1]);
  // console.log(pricID);

  if (!collectiondata) {
    return <p>No NFT data available</p>; // if no data is passed
  }

  console.log(collectiondata?.[1].toString());

  // // getAllCollectionNFTs
  const principal = collectiondata?.[1]; // Optional chaining in case `nft` is undefined

  const getAllCollectionNFT = async (principal) => {
    try {
      const userPrincipalArray = principal;

      const principalString = Principal.fromUint8Array(userPrincipalArray._arr);

      const result = await backendActor?.getAllCollectionNFTs(principalString);
      console.log("NFT collection:", result);
      setnftList(result);
    } catch (error) {
      console.error("Error fetching get all collection NFT:", error);
    }
  };

  useEffect(() => {
    getAllCollectionNFT(principal);
  }, []);

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
          <img
            className="w-32 h-32"
            src={collectiondata[3]}
            alt={collectiondata[2]}
          />
          <div className="space-y-4">
            <div className="flex justify-between">
              <h1 className="text-sm font-semibold md:text-3xl">
                {collectiondata[2]}
              </h1>
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
          <h1 className="text-2xl">List of all NFT Collection - {id}</h1>
          <div className="flex flex-row justify-between gap-5 mt-8 overflow-x-auto overflow-y-hidden sm:flex-wrap md:gap-8 xl:gap-5">
            {nftList?.map((list, index) => (
              <>
                <p> {console.log(list[2])}</p>
                <NftCard id={id} list={list[2]} img={list[2]} key={index} />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectionDetails;
