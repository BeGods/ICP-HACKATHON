import React, { useEffect, useState } from "react";
import { collection } from "../TextData";
import { Box, Input } from "@chakra-ui/react";
import BackButton from "./collection/BackButton";
import { useAuth } from "../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import { useLocation, useParams } from "react-router-dom";
const UserDetails = () => {
  const [data, setdata] = useState([]);
  const { backendActor } = useAuth();
  const location = useLocation();
  const { alluser } = location.state || {};

  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [telegram, settelegram] = useState();
  const [image, setimage] = useState();
  const [principal, setprincipal] = useState();
  const [useid, setuseid] = useState();

  console.log(alluser[0][0]);
  const userPrincipalArray = alluser[0][0];

  const principalString = Principal.fromUint8Array(userPrincipalArray._arr);

  const getUserDetail = async (principalString) => {
    console.log(principalString);
    if (backendActor) {
      try {
        const result = await backendActor?.getUserDetails(principalString);
        console.log("User details", result);
        setdata(result);
        const userPrincipalArray = result.ok[0];
        const principalStringg = Principal.fromUint8Array(
          userPrincipalArray._arr
        ).toText();
        console.log(principalStringg);

        setprincipal(principalStringg);
        setuseid(result.ok[1]);
        setname(result.ok[3]);
        setemail(result.ok[4]);
        settelegram(result.ok[5]);
        setimage(result.ok[6]);
      } catch (error) {
        console.error("Error fetching in user details:", error);
      }
    }
  };

  useEffect(() => {
    getUserDetail(principalString);
  }, []);
  console.log(data);

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
              <img
                src={image}
                alt={`Image of ${name} `}
                className="w-full h-full "
              />
            </div>
          </div>
          <div className="h-1/2 sm:h-full sm:w-1/2 md:w-[70%] lg:w-[60%] flex flex-col gap-5 pl-[5%] sm:mt-8 sm:mb-8 md:mt-[5vh] lg:mt-0 md:mb-0 sm:justify-center md:justify-center ">
            <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
              <span className="w-24 font-semibold text-white">Id </span>
              <span className="text-gray-400 font-[700]">{useid}</span>
            </p>
            <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
              <span className="w-24 font-semibold text-white">Name </span>
              <span className="text-gray-400 font-[700]">{name}</span>
            </p>
            <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
              <span className="w-24 font-semibold text-white">Email </span>
              <span className="text-gray-400 font-[700]">{email}</span>
            </p>
            <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
              <span className="w-24 font-semibold text-white">Prinicipal </span>
              <span className="text-gray-400 font-[700]">{principal}</span>
            </p>
            <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
              <span className="w-24 font-semibold text-white">Telegram </span>
              <span className="text-gray-400 font-[700]">{telegram}</span>
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
