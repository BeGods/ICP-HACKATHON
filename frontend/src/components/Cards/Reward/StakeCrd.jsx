import React, { useContext, useState } from "react";
import { FofContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { ThumbsUp } from "lucide-react";
import { showToast } from "../../Toast/Toast";
import { addLeaderboardBet } from "../../../utils/api.fof";

const StakeCrd = ({ profileImg }) => {
  const { setShowCard, authToken, setUserData } = useContext(FofContext);
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
    <div className="fixed inset-0  bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="flex absolute flex-col items-center justify-center  pt-4 w-full z-50 top-0">
        <h1 className="uppercase text-gold text-[12.2vw] text-center -mt-2 text-black-contour break-words leading-[55px]">
          Stake
        </h1>
      </div>
      <>
        {showConfirm ? (
          <>
            <div
              className={`flex absolute w-full justify-end top-[20vh] mr-[18vw]`}
            >
              <IconBtn
                handleClick={() => {
                  setShowCard(null);
                }}
              />
            </div>
            <div className="relative w-[72%] rounded-lg shadow-lg mt-[70px] flex flex-col z-50">
              <div className="flex justify-center items-center w-full absolute h-full">
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
                size={"18vw"}
                color="#FFD660"
                className="mx-auto drop-shadow-xl scale-more"
              />
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-[20%] mr-[2vw] w-full z-50">
              <div
                onClick={() => {
                  setStatus(true);
                  setShowConfirm(true);
                }}
                className="arrows-lg-up"
              ></div>
            </div>
            <div
              className={`flex absolute w-full justify-end top-[20vh] mr-[18vw]`}
            >
              <IconBtn
                handleClick={() => {
                  setShowCard(null);
                }}
              />
            </div>
            <div className="relative w-[72%] rounded-lg shadow-lg flex flex-col z-50">
              <div className="flex justify-center items-center w-full absolute bg-red-40">
                <div className="flex justify-center items-center w-full glow- absolute h-full">
                  <img
                    src={profileImg}
                    alt="orb"
                    className="filter-orbs-black rounded-full w-full"
                  />
                </div>
              </div>
            </div>
            <div className="absolute bottom-[20%] w-full">
              <div
                onClick={() => {
                  setStatus(false);
                  setShowConfirm(true);
                }}
                className="arrows-lg-down"
              ></div>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default StakeCrd;
