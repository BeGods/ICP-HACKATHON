import React from "react";
import { collection } from "../../TextData";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

const NftDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const nftdata = location.state?.list;
  console.log(nftdata);
  // console.log(collection.collections[0].CollectionDetails.NftList[0])
  const filteredNft = collection.collections[0].CollectionDetails.NftList[0];
  // const filteredNft = collection.collections[0].CollectionDetails.NftList.find((nft)=>nft.License_No===id);
  // console.log(filteredNft);
  return (
    <div className="2xl:mt-[10vh]">
      <div className=" flex justify-start mx-auto w-11/12 pt-9 hover:cursor-pointer 2xl:ml-[13%]">
        <ArrowBackIcon onClick={() => navigate(-1)} color="white" />
      </div>
      <div className="flex flex-col sm:flex-row md:flex-row sm:mt-[20%] md:mt-0 md:ml-[100px] 2xl:ml-[20%]">
        <div className="h-64 w-[200px] md:h-[387.2px] md:w-[277px] ml-12 mt-2 sm:mt-[3%] md:mt-[53px]">
          <img src={nftdata.nonfungible.thumbnail} alt="" />
        </div>
        <div className="w-[277px] h-64 sm:h-80 md:h-[388px] md:w-[585px] bg-[#3E3E3E] mt-8 sm:mt-0 md:mt-[53px] mb-2 md:mb-0 sm:ml-[10%] md:ml-[50px] rounded-md gap-[10px]">
          <div className="mt-6 md:mr-[218px] mb-6 ml-[70px] flex flex-col gap-[10px]">
            <p className="text-[#FFFFFF] leading-[30px]">
              NFT Name:{" "}
              <span className="font-[700]">{nftdata.nonfungible.name} </span>
            </p>
            <p className="text-[#FFFFFF] leading-[30px]">
              Collection:{" "}
              <span className="font-[700]">
                {filteredNft.NFTDetails.Collection}
              </span>{" "}
            </p>
            <p className="text-[#FFFFFF] leading-[30px]">
              NFTID:{" "}
              <span className="font-[700]">{filteredNft.NFTDetails.NFTID}</span>
            </p>
            <p className="text-[#FFFFFF] leading-[30px]">
              Owner:{" "}
              <span className="font-[700]">{filteredNft.NFTDetails.Owner}</span>{" "}
            </p>
            <p className="text-[#FFFFFF] leading-[30px]">
              Price:{" "}
              <span className="font-[700]">{filteredNft.NFTDetails.Price}</span>
            </p>
            <p className="text-[#FFFFFF] leading-[30px]">
              Listed:{" "}
              <span className="font-[700]">
                {filteredNft.NFTDetails.Listed}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetails;
