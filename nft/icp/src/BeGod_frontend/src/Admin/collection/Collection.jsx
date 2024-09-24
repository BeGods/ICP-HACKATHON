import React, { useEffect, useState } from "react";
import YellowButton from "../../components/button/YellowButton";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import { useAuth } from "../../utils/useAuthClient.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Collection() {
  const { backendActor } = useAuth();
  const [coll, setColl] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);

  const getCollection = async () => {
    setLoading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getAllCollections();
        if (result && result[0] && result[0][1]) {
          setColl(result[0][1]);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  };

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchCollection = async () => {
      await getCollection();
      setLoading(false);
    };

    fetchCollection(); // Call the async function
  }, [backendActor]); // Add backendActor as a dependency

  // console.log("In end useEffect", coll);
  // console.log("name", coll[0][2]);
  // var name = coll[0][3];

  return (
    <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar no-scroll 2xl:ml-[7%] md:w-full lg:w-[90%] lg:pt-20">
      <div className="flex justify-center text-center">
        <div className="flex justify-between w-full ml-auto lg:-ml-12 gap-x-6 md:ml-0 sm:ml-auto">
          <div className="hidden sm:block">
            <BackButton />
          </div>

          <Link to="/Admin/collection/create" className="w-full">
            <YellowButton className="font-semibold">
              Create Collection
            </YellowButton>
          </Link>
          <YellowButton className="font-semibold">Add</YellowButton>
        </div>
      </div>
      {loading ? (
        <div
          style={{
            display: "block",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 3,
            padding: "1rem",
            marginBottom: "0.5rem",
            width: "100%",
          }}
        >
          <Skeleton width="100%" />
          <Skeleton count={5} width="100%" />
        </div>
      ) : (
        <div className="grid w-full gap-6 pt-10 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
          <>
            {coll.length > 0 ? (
              coll.map((collectiondata, index) => (
                <Link
                  to={`/Admin/collection/collectionDetails/${collectiondata[0]}`}
                  key={index}
                  state={{ collectiondata }}
                >
                  <div
                    key={index}
                    className="bg-[#29292C] w-[100%] h-[100%] px-10 py-6 text-white flex flex-col justify-center items-center gap-y-4 rounded-md border-transparent border hover:border-[#FCD37B]"
                  >
                    <img
                      className="p-2 w-28 h-28 sm:h-40 sm:w-40"
                      src={collectiondata[3]}
                      alt=""
                    />
                    <div className="mx-auto mt-2 text-sm text-center sm:font-bold">
                      <p className="text-2xl font-semibold">
                        {collectiondata[2]}
                      </p>
                      <p className="text-2xl font-semibold text">Collection</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p class="text-white text-2xl  text-center">
                No collections available
              </p>
            )}
          </>
        </div>
      )}
    </div>
  );
}

export default Collection;
