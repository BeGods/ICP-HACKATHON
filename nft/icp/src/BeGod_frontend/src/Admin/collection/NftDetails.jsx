import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import BackButton from "./BackButton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";

const NftDetails = () => {
  const { collectionId, nftId } = useParams();
  const { backendActor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true); // To handle loading state
  const [tokenid, settokenid] = useState();
  const [singletokendata, setsingletokendata] = useState();
  const nftdata = location.state?.list;
  const { collectiondata } = location.state || {};
  console.log(nftdata); //
  console.log(collectiondata);
  console.log(nftId);

  const tokenindex = nftdata?.[0];
  const userid = nftdata?.[1];

  const priceBigInt = nftdata[3]?.[0]?.toString() ?? "Price not found";
  const price = Number(priceBigInt) / 100000000;

  const metadataJson = nftdata[2]?.nonfungible?.metadata?.[0]?.json;
  const metadata = metadataJson ? JSON.parse(metadataJson) : null;
  console.log(metadata);

  const collid = collectiondata[1];

  const getdata = async (collid, tokenindex, userid) => {
    setLoading(true);
    try {
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

  const owner = singletokendata?.[0]?.[1];
  const isOwned = singletokendata?.[0]?.[4];

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="2xl:mt-[10vh] w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto">
        {/* Back Button */}
        <div className="flex justify-start items-center w-full pt-9 mb-5 hover:cursor-pointer">
          <div className="hidden sm:block">
            {loading ? <Skeleton width={100} height={35} /> : <BackButton />}
          </div>
        </div>

        {/* NFT Details Section */}
        <div className="flex flex-col md:flex-row mt-12 sm:mt-0 gap-8">
          {/* NFT Image */}
          <div className="flex justify-center md:justify-start mb-6 md:mb-0 w-full sm:w-[60%] md:w-[40%]">
            {loading ? (
              <Skeleton
                height="100%" // Set to "100%" to fill available space
                width="100%"
                className="rounded-md w-full max-w-[85%] sm:max-w-[90%] md:max-w-[95%] aspect-square"
              />
            ) : (
              <img
                src={nftdata[2]?.nonfungible?.thumbnail ?? "Image not found"}
                alt="NFT Thumbnail"
                className="object-cover rounded-md w-full max-w-[85%] sm:max-w-[90%] md:max-w-[95%] aspect-square"
              />
            )}
          </div>

          {/* NFT Details Card */}
          <div className="flex flex-col justify-center w-[95%] md:w-[60%] lg:w-[50%] bg-[#29292c] mb-4 md:mb-0 rounded-md p-6 gap-4 mx-4 sm:mx-auto">
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
                  <span className="text-yellow-500">{nftId || identifier}</span>
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
                  <span className="font-semibold">Nft Season: </span>
                  <span>{metadata?.nftSeason || "Null"}</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">Nft Type: </span>
                  <span>{metadata?.newtype || "Null"}</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">Nft Rarity: </span>
                  <span>{metadata?.nftType ? "Yes" : "No"}</span>
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
