import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import BackButton from "./BackButton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NftDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true); // To handle loading state
  const nftdata = location.state?.list;

  // Simulating a fetch with a timeout for the skeleton loader
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate loading for 2 seconds
  }, []);

  // If there's no NFT data, return a message or redirect back
  if (!nftdata && !loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">No NFT data found</p>
      </div>
    );
  }

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="2xl:mt-[10vh]">
        {/* Back Button */}
        <div className="flex justify-start items-center mx-auto w-11/12 pt-9 hover:cursor-pointer">
          <div className="hidden sm:block">
            <BackButton />
          </div>
        </div>

        {/* NFT Details Section */}
        <div className="flex flex-col sm:flex-row mt-10 sm:mt-0 sm:ml-10 lg:ml-20 gap-6">
          {/* NFT Image */}
          <div className="ml-12 mt-2 sm:mt-[3%] md:mt-[53px]">
            {loading ? (
              <Skeleton height={380} width={280} />
            ) : (
              <img
                src={nftdata.nonfungible.thumbnail}
                alt="NFT Thumbnail"
                className="object-cover rounded-md"
                style={{
                  width: "280px", // Full width for the image container
                  height: "380px", // Height to match aspect ratio
                }}
              />
            )}
          </div>

          {/* NFT Details Card */}
          <div className="w-full md:w-[585px] h-auto bg-[#29292c] mt-8 sm:mt-0 md:mt-[53px] mb-2 md:mb-0 sm:ml-[10%] md:ml-[50px] rounded-md p-6 gap-[10px]">
            {loading ? (
              <div className="flex flex-col gap-4">
                <Skeleton width={150} height={25} />
                <Skeleton width={180} height={25} />
                <Skeleton width={120} height={25} />
                <Skeleton width={200} height={25} />
                <Skeleton width={100} height={25} />
                <Skeleton width={80} height={25} />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-white text-lg">
                  <span className="font-semibold">NFT Name:</span>{" "}
                  <span>{nftdata.nonfungible.name}</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">Collection:</span>{" "}
                  <span>{nftdata.nonfungible.collection || "Not Available"}</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">NFT ID:</span>{" "}
                  <span>{nftdata.nonfungible.nftId || id}</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">Owner:</span>{" "}
                  <span>{nftdata.nonfungible.owner || "Unknown"}</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">Price:</span>{" "}
                  <span>{nftdata.nonfungible.price || "Not Listed"}</span>
                </p>
                <p className="text-white text-lg">
                  <span className="font-semibold">Listed:</span>{" "}
                  <span>{nftdata.nonfungible.listed ? "Yes" : "No"}</span>
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
