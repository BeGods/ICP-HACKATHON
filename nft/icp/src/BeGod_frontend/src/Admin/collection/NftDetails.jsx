import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import BackButton from "./BackButton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";

const NftDetails = () => {
  const { id } = useParams();
  const { backendActor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true); // To handle loading state
  const [tokenid, settokenid] = useState();
  const [singletokendata, setsingletokendata] = useState();
  const nftdata = location.state?.list;
  const { list, collectiondata } = location.state || {};
  console.log(list);

  const tokenindex = nftdata?.[0];
  const userid = nftdata?.[1];

  const priceBigInt = nftdata[3]?.[0]?.toString() ?? "Price not found";
  const price = Number(priceBigInt) / 100000000;

  const metadataJson = nftdata[2]?.nonfungible?.metadata?.[0]?.json;
  const metadata = metadataJson ? JSON.parse(metadataJson) : null;
  console.log(nftdata[1]);

  const collid = collectiondata[1];

  const getListing = async (collid) => {
    setLoading(true);
    try {
      console.log(collid);
      const userPrincipalArray = collid;

      const principalString = Principal.fromUint8Array(userPrincipalArray._arr);

      const result = await backendActor?.listings(principalString);
      console.log("Listing", result);
      settokenid(result);
    } catch (error) {
      console.error("Error fetching listing:", error);

      return error; // Return error
    }
  };
  const getdata = async (collid, tokenindex, userid) => {
    setLoading(true);
    try {
      console.log(collid);
      const userPrincipalArray = collid;

      const principalString = Principal.fromUint8Array(userPrincipalArray._arr);

      const result = await backendActor?.getSingleNonFungibleTokens(
        principalString,
        tokenindex,
        userid
      );
      console.log("in single token", result);
      setsingletokendata(result);
    } catch (error) {
      console.error("Error fetching listing:", error);

      return error; // Return error
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getListing(collid);
        await getdata(collid, tokenindex, userid);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // If there's no NFT data, return a message or redirect back
  if (!nftdata && !loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">No NFT data found</p>
      </div>
    );
  }
  console.log(tokenid);

  const identifier = tokenid?.[0]?.[1] || "null";
  console.log("Identifier:", identifier);

  console.log(singletokendata);
  const owner = singletokendata?.[0]?.[1];
  const isOwned = singletokendata?.[0]?.[4];
  console.log(owner, isOwned);

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="2xl:mt-[10vh] w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto">
        {/* Back Button */}
        <div className="flex justify-start items-center w-full pt-9 mb-8 hover:cursor-pointer">
          <div className="hidden sm:block">
            {loading ? <Skeleton width={100} height={35} /> : <BackButton />}
          </div>
        </div>

        {/* NFT Details Section */}
        <div className="flex flex-col md:flex-row mt-8 sm:mt-0 gap-6">
          {/* NFT Image */}
          <div className="flex justify-start mb-4 sm:mb-0 w-full sm:w-[35%]">
            {loading ? (
              <Skeleton
                height="100%" // Use percentage for skeleton height
                width="100%"
                className="w-full max-w-[80%] sm:max-w-[85%] md:max-w-[90%] aspect-square"
              />
            ) : (
              <img
                src={nftdata[2]?.nonfungible?.thumbnail ?? "Image not found"}
                alt="NFT Thumbnail"
                className="object-cover rounded-md w-full max-w-[80%] sm:max-w-[85%] md:max-w-[90%] aspect-square h-auto"
              />
            )}
          </div>

          {/* NFT Details Card */}
          <div className="flex flex-col justify-center w-[95%] sm:w-[86%] md:w-[60%] lg:w-[50%] bg-[#29292c] mb-4 sm:mb-0 rounded-md p-6 gap-4 mx-auto sm:mx-0">
            {loading ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-[25px] w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]" />
                <Skeleton className="h-[25px] w-[85%] sm:w-[70%] md:w-[60%] lg:w-[50%]" />
                <Skeleton className="h-[25px] w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%]" />
                <Skeleton className="h-[25px] w-[75%] sm:w-[60%] md:w-[50%] lg:w-[40%]" />
                <Skeleton className="h-[25px] w-[60%] sm:w-[50%] md:w-[40%] lg:w-[30%]" />
                <Skeleton className="h-[25px] w-[55%] sm:w-[50%] md:w-[40%] lg:w-[30%]" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-white text-lg">
                  <span className="font-semibold">NFT Name: </span>
                  <span>
                    {nftdata[2]?.nonfungible?.name ?? "Name not found"}
                  </span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">Collection: </span>
                  <span>{collectiondata[2] || "Not Available"}</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">NFT ID: </span>
                  <span className="text-yellow-500">{identifier || id}</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">Owner: </span>
                  <span className="text-green-800">{owner || "Unknown"}</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">Price: </span>
                  <span>{price || "Not Listed"} ICP</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">Listed: </span>
                  <span>{isOwned ? "Yes" : "No"}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default NftDetails;
