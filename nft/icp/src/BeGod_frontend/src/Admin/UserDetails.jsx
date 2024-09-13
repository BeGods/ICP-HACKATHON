import React from "react";
import { collection } from "../TextData";
import { Box, Input } from "@chakra-ui/react";
import BackButton from "./collection/BackButton";
const UserDetails = () => {
  const filteredNft = collection.collections[0].CollectionDetails.NftList[0];
  console.log(filteredNft.img);
  return (
    <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar  no-scroll  md:w-full lg:w-[90%] lg:pt-20">
      <div className="flex justify-between text-center">
        <BackButton />
      </div>
      <Box color="white" className="flex flex-col items-center justify-center">
        {/* Search Box */}
        <Box
          w={{ base: "90%", sm: "100%", md: "85%", "2xl": "90%" }}
          mx={{ base: "4%", sm: "8%", md: "7%", lg: "7%", "2xl": "10%" }}
          mt="5%"
        >
          <Input
            placeholder="Search"
            w={{ base: "100%", sm: "90%", md: "85%", "2xl": "100%" }}
            h="45px"
            border="1px"
            borderColor="gray.600"
            bg="#161618"
            color="white"
            p="4"
            _placeholder={{ color: "gray.400" }}
          />
        </Box>
        <Box
          w={{ base: "90%", sm: "100%", md: "85%", "2xl": "90%" }}
          mx={{ base: "4%", sm: "8%", md: "7%", lg: "7%", "2xl": "10%" }}
          mt="5%"
          className="h-auto md:h-[40%] lg:h-[370px] bg-[#29292C] mt-[15%] sm:mt-[8%] md:mt-[5%]  flex flex-col sm:flex-row w-full p-2"
        >
          <div className="h-1/2 md:h-full md:w-[30%] lg:w-[1/2] flex items-center justify-center md:mt-[5vh] lg:mt-0 md:mb-[5vh] lg:mb-0">
            <div className="w-[30%] md:w-[60%] flex items-center justify-center 2xl:h-[80%]">
              <img src={filteredNft.img} alt="" className="w-full h-full " />
            </div>
          </div>
          <div className="h-1/2 sm:h-full sm:w-1/2 md:w-[70%] lg:w-[60%] flex flex-col gap-5 pl-[5%] sm:mt-8 sm:mb-8 md:mt-[5vh] lg:mt-0 md:mb-0 sm:justify-center md:justify-center ">
            <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
              <span className="w-24 font-semibold text-white">Id </span>
              <span className="text-gray-400 font-[700]">123212</span>
            </p>
            <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
              <span className="w-24 font-semibold text-white">Name </span>
              <span className="text-gray-400 font-[700]">Barry</span>
            </p>
            <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
              <span className="w-24 font-semibold text-white">Email </span>
              <span className="text-gray-400 font-[700]">
                Tonya_Barrows@yahoo.com
              </span>
            </p>
            <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
              <span className="w-24 font-semibold text-white">Prinicipal </span>
              <span className="text-gray-400 font-[700]">1951982</span>
            </p>
            <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
              <span className="w-24 font-semibold text-white">Telegram </span>
              <span className="text-gray-400 font-[700]">1951982</span>
            </p>
          </div>
        </Box>
        <h1 className="text-[20px] font-[700] leading-[25px] text-[#646464]  mt-[2%]">
          NFT Owned by 84fer-gg19
        </h1>
      </Box>
      {/* <div className="flex items-center justify-center text-white mt-[5%]">
        <h1>User doesn't own any NFT</h1>
      </div> */}
    </div>
  );
};

export default UserDetails;
