import { ArrowBackIcon } from "@chakra-ui/icons";
import React from "react";
import { collection } from "../../TextData";
import { useParams } from "react-router-dom";
import YellowButton from "../../components/button/YellowButton";
import BackButton from "./BackButton";
import NftCard from "../../components/NftCard";

function CollectionDetails() {
  const { id } = useParams();
  const filteredCollection = collection.collections.find(
    (col) => col.CollectionDetails?.collectionId === id
  );

  if (!filteredCollection) {
    return <p>No Collection found</p>; // Proper return when no collection is found
  }

  const { heading, img, detail, collectionId, heading2, NftList } =
    filteredCollection.CollectionDetails;

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
          <img className="w-32 h-32" src={img} alt={heading} />
          <div className="space-y-4">
            <div className="flex justify-between">
              <h1 className="text-sm font-semibold md:text-3xl">{heading}</h1>
              <p className="font-semibold text-md">Created on - 25 May, 2078</p>
            </div>
            <p className="text-sm font-normal font-Quicksand md:text-xl">
              {detail}
            </p>
            <h3 className="text-sm font-bold font-Quicksand md:text-xl">
              Collection ID - {collectionId}
            </h3>
          </div>
        </div>

        {/* NFT list section */}
        <div className="w-full pb-12 text-white">
          <h1 className="text-2xl">{heading2}</h1>
          <div className="flex flex-row justify-between gap-5 mt-8 overflow-x-auto overflow-y-hidden sm:flex-wrap md:gap-8 xl:gap-5">
            {NftList?.map((list, index) => (
              <NftCard id={id} list={list} img={list} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectionDetails;
