import React, { useEffect, useState } from "react";
import YellowButton from "../../components/button/YellowButton";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import { useAuth } from "../../utils/useAuthClient.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";

function Collection() {
  const { backendActor } = useAuth();
  const [coll, setColl] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);

  const getCollection = async () => {
    setLoading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getAllCollections();
        console.log(result);
        if (result && result[0] && result[0][1]) {
          setColl(result[0][1]);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  };

  useEffect(() => {
    const fetchCollection = async () => {
      await getCollection();
      setLoading(false);
    };

    fetchCollection();
  }, [backendActor]);

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="w-[90%] h-screen overscroll-none overflow-hidden pt-10 px-10 pb-8 no-scrollbar 2xl:ml-[7%] md:w-full lg:w-[90%] lg:pt-20">
        {/* Flex container for back button and collection buttons */}
        <div className="flex justify-between items-center w-full mb-6 mt-5">
          {/* Back button (hidden on small screens) */}
          <div className="hidden sm:block">
            <BackButton />
          </div>
          {/* Create collection button */}
          <div className="flex space-x-4">
            <Link to="/Admin/collection/create">
              <YellowButton className="font-semibold">
                Create Collection
              </YellowButton>
            </Link>
          </div>
        </div>

        {/* Loader skeleton when loading */}
        {loading ? (
          <div className="grid w-full gap-6 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
            {Array(6) // Generate skeleton loaders for each collection card
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-[#29292C] w-full h-full px-10 py-6 flex flex-col justify-center items-center gap-y-4 rounded-md border-transparent border"
                >
                  <Skeleton circle width={160} height={160} />
                  <Skeleton width={140} height={30} />
                  <Skeleton width={140} height={30} />
                </div>
              ))}
          </div>
        ) : (
          <div className="w-full  flex justify-center items-center">
            {/* Grid of collections */}
            {coll.length > 0 ? (
              <div className="grid w-full gap-6 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
                {coll.map((collectiondata, index) => (
                  <Link
                    to={`/Admin/collection/collectionDetails/${collectiondata[0]}`}
                    key={index}
                    state={{ collectiondata }}
                  >
                    <div
                      key={index}
                      className="bg-[#29292C] w-full h-full px-10 py-6 text-white flex flex-col justify-center items-center gap-y-4 rounded-md border-transparent border hover:border-[#FCD37B]"
                    >
                      <img
                        className="w-28 h-28 sm:h-40 sm:w-40"
                        src={collectiondata[3]}
                        alt=""
                      />
                      <div className="mx-auto mt-2 text-sm text-center sm:font-bold">
                        <p className="text-2xl font-semibold">
                          {collectiondata[2]}
                        </p>
                        <p className="text-2xl font-semibold">Collection</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <p className="text-white text-2xl text-center">
                  No collections available
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
}

export default Collection;
