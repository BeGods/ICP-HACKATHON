import React, { useEffect, useState } from "react";
import YellowButton from "../../components/button/YellowButton";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import { useAuth } from "../../utils/useAuthClient.jsx";

function Collection() {
  const { backendActor } = useAuth();
  const [coll, setColl] = useState([]); // Initialize as an empty array

  const getCollection = async () => {
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

      <div className="grid w-full gap-6 pt-10 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
        {coll.length > 0 ? (
          coll.map((nft, index) => (
            <Link
              to={`/Admin/collection/collectionDetails/${nft[0]}`}
              key={index}
              state={{ nft }}
            >
              <div
                key={index}
                className="bg-[#29292C] w-[100%] h-[100%] px-10 py-6 text-white flex flex-col justify-center items-center gap-y-4 rounded-md border-transparent border hover:border-[#FCD37B]"
              >
                <img
                  className="p-2 w-28 h-28 sm:h-40 sm:w-40"
                  src={nft[3]}
                  alt=""
                />
                <div className="mx-auto mt-2 text-sm text-center sm:font-bold">
                  <p className="text-2xl font-semibold">{nft[2]}</p>
                  <p className="text-2xl font-semibold text">Collection</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No collections available</p>
        )}
      </div>
    </div>
  );
}

export default Collection;
