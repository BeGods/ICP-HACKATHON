import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import BackButton from "./collection/BackButton";
import { useAuth } from "../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import { useLocation } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for skeletons
  const { backendActor } = useAuth();
  const location = useLocation();
  const { user } = location.state || {};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [image, setImage] = useState("");
  const [principal, setPrincipal] = useState("");
  const [userId, setUserId] = useState("");
  console.log(user);

  const userPrincipalArray = user[0];
  const principalString = Principal.fromUint8Array(userPrincipalArray._arr);

  const getUserDetail = async (principalString) => {
    if (backendActor) {
      try {
        const result = await backendActor?.getUserDetails(principalString);
        setData(result);
        console.log(data);

        const userPrincipalArray = result.ok[0];
        const principalStringg = Principal.fromUint8Array(
          userPrincipalArray._arr
        ).toText();

        setPrincipal(principalStringg);
        setUserId(result.ok[1]);
        setName(result.ok[3]);
        setEmail(result.ok[4]);
        setTelegram(result.ok[5]);
        setImage(result.ok[6]);
        setLoading(false); // Turn off the loading state
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(() => {
    getUserDetail(principalString);
  }, []);

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar md:w-full lg:w-[90%] lg:pt-20">
        {/* Back Button */}
        <div className="flex justify-between text-center">
          <BackButton />
        </div>

        {/* User Info */}
        <Box
          color="white"
          className="flex flex-col items-center justify-center"
        >
          {/* User Details */}
          <Box
            w={{ base: "90%", sm: "100%", md: "85%", "2xl": "90%" }}
            mx={{ base: "4%", sm: "8%", md: "7%", lg: "7%", "2xl": "10%" }}
            mt="5%"
            className="bg-[#29292C] mt-[15%] sm:mt-[8%] md:mt-[5%] flex flex-col sm:flex-row w-full p-6"
          >
            <div className="h-1/2 md:h-full md:w-[30%] lg:w-[1/2] flex items-center justify-center md:mt-[5vh] lg:mt-0 md:mb-[5vh] lg:mb-0">
              <div className="w-[40%] md:w-[60%] flex items-center justify-center">
                {loading ? (
                  <Skeleton circle width={150} height={150} />
                ) : (
                  <img
                    src={
                      image && image.length > 0 ? image[0] : "/image/admin.png"
                    }
                    alt={`Image of ${name}`}
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>
            </div>

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
                    <span className="w-24 font-semibold text-white">Id </span>
                    <span className="text-gray-400 font-[700]"> {userId}</span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">Name </span>
                    <span className="text-gray-400 font-[700]"> {name}</span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">
                      Email{" "}
                    </span>
                    <span className="text-gray-400 font-[700]"> {email}</span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">
                      Principal{" "}
                    </span>
                    <span className="text-gray-400 font-[700]">
                      {" "}
                      {principal}
                    </span>
                  </p>
                  <p className="text-[#FFFFFF] text-[14px] lg:text-[20px] flex gap-10">
                    <span className="w-24 font-semibold text-white">
                      Telegram{" "}
                    </span>
                    <span className="text-gray-400 font-[700]">
                      {" "}
                      {telegram}
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

export default UserDetails;
