import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import BackButton from "./collection/BackButton.jsx";

import { Principal } from "@dfinity/principal";
import { useLocation } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AllorderDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for skeletons

  const location = useLocation();
  const { orderdata } = location.state || {};
  console.log(orderdata);
  const userorderArray = orderdata.accountIdentifier;
  const orderid = userorderArray
    ? Principal.fromUint8Array(userorderArray._arr).toText()
    : null;

  const [name, setName] = useState("name");
  const [email, setEmail] = useState("email");
  const [telegram, setTelegram] = useState("telegram");
  const [image, setImage] = useState("iamge");
  const [principal, setPrincipal] = useState("princiapl");
  const [userId, setUserId] = useState("usedid");

  // const userPrincipalArray = alluser[0][0];
  // const principalString = Principal.fromUint8Array(userPrincipalArray._arr);

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar sm:w-full lg:w-[90%] lg:pt-20">
        {/* Back Button */}
        <div className="flex justify-between items-center text-center">
          <BackButton />
        </div>

        {/* Order Info */}
        <Box
          color="white"
          className="flex flex-col items-center justify-center"
        >
          {/* Order Details */}
          <Box
            w={{ base: "90%", sm: "100%", md: "85%", "2xl": "90%" }}
            mx={{ base: "4%", sm: "8%", md: "7%", lg: "7%", "2xl": "10%" }}
            mt="5%"
            className="bg-[#29292C] mt-[15%] sm:mt-[8%] md:mt-[5%] flex flex-col sm:flex-row w-full p-6 rounded-lg shadow-lg"
          >
            <div className="h-1/2 sm:h-full sm:w-1/2 md:w-[70%] lg:w-[60%] flex flex-col gap-6 pl-[5%] sm:mt-8 sm:mb-8 md:mt-[5vh] lg:mt-0 md:mb-0 sm:justify-center md:justify-center">
              {loading ? (
                <>
                  <Skeleton width={180} height={25} />
                  <Skeleton width={250} height={25} />
                  <Skeleton width={200} height={25} />
                  <Skeleton width={200} height={25} />
                </>
              ) : (
                <>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">
                      Account Id
                    </span>
                    <span className="text-gray-400 font-[700]"> {orderid}</span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">
                      Address
                    </span>
                    <span className="text-gray-400 font-[700]">
                      {" "}
                      {orderdata.address}
                    </span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">City</span>
                    <span className="text-gray-400 font-[700]">
                      {" "}
                      {orderdata.city}
                    </span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">
                      Country
                    </span>
                    <span className="text-gray-400 font-[700]">
                      {" "}
                      {orderdata.country}
                    </span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">Email</span>
                    <span className="text-gray-400 font-[700]">
                      {" "}
                      {orderdata.email}
                    </span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">ID</span>
                    <span className="text-gray-400 font-[700]">
                      {" "}
                      {orderdata.id.toString()}
                    </span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">
                      Landmark
                    </span>
                    <span className="text-gray-400 font-[700]">
                      {orderdata.landmark.join(", ") || "N/A"}
                    </span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">
                      Order Time
                    </span>
                    <span className="text-gray-400 font-[700]">
                      {new Date(
                        Number(orderdata.orderTime) / 1000000
                      ).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">Phone</span>
                    <span className="text-gray-400 font-[700]">
                      {" "}
                      {orderdata.phone}
                    </span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">
                      Pincode
                    </span>
                    <span className="text-gray-400 font-[700]">
                      {" "}
                      {orderdata.pincode}
                    </span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">UUID</span>
                    <span className="text-gray-400 font-[700]">
                      {" "}
                      {orderdata.uuid}
                    </span>
                  </p>
                </>
              )}
            </div>
          </Box>
        </Box>
      </div>
    </SkeletonTheme>
  );
};

export default AllorderDetails;

// id: Nat;
//     accountIdentifier: Principal;
//     uuid: Text;
//     collectionCanisterId: Principal;
//     phone: Text;
//     email: Text;
//     address: Text;
//     city: Text;
//     country: Text;
//     pincode: Text;
//     landmark: ?Text;
//     orderTime: Time.Time;
