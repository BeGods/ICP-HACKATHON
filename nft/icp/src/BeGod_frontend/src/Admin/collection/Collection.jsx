import React, { useEffect, useState } from "react";
import YellowButton from "../../components/button/YellowButton";
import { collection } from "../../TextData";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import { useAuth } from "../../utils/useAuthClient.jsx";

function Collection() {
  const { backendActor } = useAuth();
  const [coll, setcoll] = useState();

  const getcolletion = async () => {
    const result = await backendActor?.getAllCollections();
    console.log(result[0]);
    // var arr = result[0];
    // arr = arr[1];
    // setcoll(arr);
    // setcoll(arr);
    // arr = arr[0];
    // console.log(arr);
  };

  useEffect(() => {
    getcolletion();
    // console.log("in useeffect", coll);
  }, []);
  console.log("in end  useeffect", coll);
  return (
    <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar  no-scroll 2xl:ml-[7%] md:w-full lg:w-[90%] lg:pt-20">
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
        {collection.collections.map((nft, index) => (
          <Link
            to={`/Admin/collection/collectionDetails/${nft.CollectionDetails?.collectionId}`}
            key={index}
          >
            <div
              key={index}
              className="bg-[#29292C] w-[100%] h-[100%] px-10 py-6 text-white flex  flex-col justify-center items-center gap-y-4 rounded-md border-transparent border  hover:border-[#FCD37B]"
            >
              <img
                className="p-2 w-28 h-28 sm:h-40 sm:w-40"
                src={nft.img}
                alt=""
              />
              <div className="mx-auto mt-2 text-sm text-center sm:font-bold">
                <p className="text-2xl font-semibold">{nft.text1}</p>
                <p className="text-2xl font-semibold">{nft.text2}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Collection;
