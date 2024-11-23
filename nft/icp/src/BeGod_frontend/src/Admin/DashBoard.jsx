import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../utils/useAuthClient.jsx";
import { setUser } from "../redux/authSlice.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { canisterId } from "../../../declarations/BeGod_backend";
import { Principal } from "@dfinity/principal";

function DashBoard() {
  const { backendActor } = useAuth();
  const [user, setUser] = useState();
  const [nfts, setnfts] = useState();
  const [collections, setcollections] = useState();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const fetching = async () => {
        // await getTotalNFT();
        // await getTotalUser();
        // await getallcollection();
        // setloading(false);
        setloading(true);
        await Promise.all([getTotalNFT(), getTotalUser(), getallcollection()]);
        setloading(false);
      };
      fetching();
    }
  }, [navigate]);

  const getTotalNFT = async () => {
    setloading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getTotalNFTs();
        const value = Number(result);
        setnfts(value);
        console.log("total nft", result);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  };

  const getTotalUser = async () => {
    setloading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getTotalUsers();
        const value = Number(result);
        setUser(value);
        console.log("total user", result);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  };

  const getallcollection = async () => {
    setloading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.totalcollections();
        const value = Number(result);
        setcollections(value);
        console.log("total collection", result);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="bg-contain text-white mx-auto text-center w-[90%] h-full px-6 sm:px-12 md:px-24 pt-5 sm:pt-6 md:pt-16 lg:pt-28">
        {loading ? (
          <div className="grid justify-center grid-cols-1 gap-8 mx-auto lg:text-2xl sm:grid-cols-4 max-w-screen-2xl font-Quicksand sm:font-bold md:text-xl sm:text-lg">
            <div className="col-span-2 h-32 2xl:h-52">
              <Skeleton height="100%" />
            </div>
            <div className="col-span-2 h-32 2xl:h-52">
              <Skeleton height="100%" />
            </div>
            <div className="col-span-2 sm:col-start-2 sm:col-end-4 h-32 2xl:h-52">
              <Skeleton height="100%" />
            </div>
          </div>
        ) : (
          <div className="grid justify-center grid-cols-1 gap-8 mx-auto lg:text-2xl sm:grid-cols-4 max-w-screen-2xl font-Quicksand sm:font-bold md:text-xl sm:text-lg">
            <div className="bg-[#29292C] px-6 py-4 col-span-2 h-32 2xl:h-52 flex flex-col justify-center rounded-md">
              <h3>Total Collections</h3>
              <p>{collections}</p>
            </div>
            <div className="bg-[#29292C] px-6 py-4 col-span-2 h-32 2xl:h-52 flex flex-col justify-center rounded-md">
              <h3>Total NFTs</h3>
              <p>{nfts}</p>
            </div>
            <div className="bg-[#29292C] px-6 py-4 col-span-2 sm:col-start-2 sm:col-end-4 h-32 2xl:h-52 flex flex-col justify-center rounded-md">
              <h3>Total Users</h3>
              <p>{user}</p>
            </div>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
}

export default DashBoard;
