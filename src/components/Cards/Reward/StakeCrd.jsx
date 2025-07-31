import { useState } from "react";
import IconBtn from "../../Buttons/IconBtn";
import { ThumbsUp } from "lucide-react";
import { showToast } from "../../Toast/Toast";
import { addLeaderboardBet } from "../../../utils/api.fof";
import { useStore } from "../../../store/useStore";

const StakeCrd = ({ profileImg, username }) => {
  const setShowCard = useStore((s) => s.setShowCard);
  const authToken = useStore((s) => s.authToken);
  const setUserData = useStore((s) => s.setUserData);
  const assets = useStore((s) => s.assets);

  const avatarColor = localStorage.getItem("avatarColor");
  const firstLetter = username?.charAt(0).toUpperCase();

  const [status, setStatus] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleAddStake = async () => {
    try {
      await addLeaderboardBet(authToken, status);
      setShowCard(null);
      setUserData((prev) => {
        return {
          ...prev,
          stakeOn: status ? "+" : "-",
        };
      });
      showToast("stake_success");
    } catch (error) {
      console.log(error);
      showToast("default");
    }
  };

  return (
    <div
      onClick={() => {
        setShowCard(null);
      }}
      className="fixed inset-0  bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50"
    >
      <div className="flex absolute flex-col items-center justify-center  pt-4 w-full z-50 top-0">
        <h1 className="uppercase text-gold text-[3rem] text-center -mt-2 text-black-contour break-words leading-[55px]">
          Stake
        </h1>
      </div>
      <>
        {showConfirm ? (
          <>
            <div
              className={`flex absolute w-full justify-end top-[20vh] mr-[4rem]`}
            >
              <IconBtn
                handleClick={() => {
                  setShowCard(null);
                }}
              />
            </div>
            <div className="relative csard-width rounded-lg shadow-lg flex flex-col z-50">
              <div className="flex jutify-center items-center w-full absolute h-full">
                <div className="flex justify-center items-center w-full -mt-[9.4vh] absolute h-full">
                  <img
                    src={profileImg}
                    alt="orb"
                    className="filter-orbs-black rounded-full w-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex absolute items-start bottom-[75px] justify-center w-full">
              <ThumbsUp
                onClick={handleAddStake}
                size={"4rem"}
                color="#FFD660"
                className="mx-auto drop-shadow-xl scale-more"
              />
            </div>
          </>
        ) : (
          <div className={`w-full flex  flex-col justify-center items-center`}>
            <div className="absolute top-[20%] mr-[2vw] w-full z-50">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setStatus(true);
                  setShowConfirm(true);
                }}
                className="arrows-lg-up"
              ></div>
            </div>
            <div className="flex justify-center items-center w-full absolute">
              {profileImg ? (
                <div className="flex justify-center items-center w-full absolute bg-red-40">
                  <div className="flex justify-center items-center w-[16rem] glow-icon-white absolute h-full">
                    <img
                      src={profileImg}
                      alt="orb"
                      className="filter-orbs-black rounded-full w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center w-full">
                  <div className="flex justify-center items-center w-full glow-icon-white absolute h-full">
                    <img
                      src={`${assets.uxui.baseOrb}`}
                      alt="orb"
                      className={`filter-orbs-${avatarColor} rounded-full`}
                    />
                  </div>
                  <span
                    className={`absolute inset-0 flex justify-center items-center text-element-lg text-white opacity-50 orb-symbol-shadow`}
                  >
                    {firstLetter}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`flex absolute w-full justify-end top-[20vh] mr-[4rem]`}
            >
              <div
                onClick={() => {
                  setShowCard(null);
                }}
                className={`absolute  cursor-pointer flex w-full justify-end top-0 right-0 -mt-4 -mr-4 `}
              >
                <div className="absolute flex justify-center items-center glow-icon-white bg-black rounded-full w-[40px] h-[40px]">
                  <div className="text-white font-roboto text-black-contour text-[1.25rem]">
                    {"\u2715"}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative  rounded-lg shadow-lg flex flex-col z-50"></div>
            <div className="absolute bottom-[20%] w-full">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setStatus(false);
                  setShowConfirm(true);
                }}
                className="arrows-lg-down"
              ></div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default StakeCrd;
