import { Megaphone, ThumbsUp } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FofContext } from "../../../context/context";
import {
  claimAnmntReward,
  claimStreakBonus,
  fetchProfilePhoto,
} from "../../../utils/api";
import {
  handleClickHaptic,
  setTutKey,
  validateCountryCode,
} from "../../../helpers/cookie.helper";
import { trackEvent } from "../../../utils/ga";
import { showToast } from "../../../components/Toast/Toast";
import Confetti from "react-confetti";

const tele = window.Telegram?.WebApp;

const Announcement = (props) => {
  const [disableHand, setDisableHand] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const {
    setSection,
    setGameData,
    authToken,
    setActiveMyth,
    setShowAnmt,
    enableHaptic,
  } = useContext(FofContext);
  let disableRef = useRef(false);

  const playConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  useEffect(() => {
    playConfetti();
    setTimeout(() => {
      setDisableHand(false);
    }, 2000);

    setTimeout(() => {
      getAnmntReward();
    }, 4000);
  }, []);

  // const getAnmntReward = async () => {
  //   if (disableRef.current === false) {
  //     handleClickHaptic(tele, enableHaptic);
  //     disableRef.current = true;
  //     try {
  //       const response = await claimAnmntReward(authToken);
  //       setTutKey(tele, "announcement05", 1);
  //       setSection(8);
  //     } catch (error) {
  //       showToast("default");
  //     }
  //   }
  // };
  const getAnmntReward = async () => {
    if (disableRef.current === false) {
      handleClickHaptic(tele, enableHaptic);
      disableRef.current = true;
      try {
        const response = await claimAnmntReward(authToken);
        setTutKey(tele, "announcement06", 1);
        setGameData((prev) => ({
          ...prev,
          isBurstAutoPayActive: true,
          autoPayBurstExpiry: 0,
        }));

        setShowAnmt(true);
        setSection(2);
      } catch (error) {
        showToast("default");
      }
    }
  };

  return (
    <div className="flex relative flex-col h-screen w-screen justify-center font-fof items-center bg-black">
      <div className="flex flex-col w-full h-full items-center">
        <div className="flex flex-col items-center justify-center  pt-4 w-full z-50 h-1/5">
          <div className="text-gold font-symbols">
            <Megaphone size={"20vw"} />
          </div>
          <h1 className="uppercase text-gold text-[12.2vw] text-center -mt-2 text-black-contour break-words leading-[55px]">
            IS LIVE
          </h1>
        </div>
        <div className="flex justify-center items-center w-full absolute  h-full">
          <div className="flex relative flex-col items-center cursor-pointer mt-5">
            <img
              src="/assets/announcements/480px-announcement_05.jpg"
              alt="announcement"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="flex absolute items-start bottom-[75px] justify-center w-full">
          <ThumbsUp
            onClick={getAnmntReward}
            size={"18vw"}
            color="#FFD660"
            className="mx-auto drop-shadow-xl scale-more"
          />
          {disableHand && (
            <div className="font-symbols scale-point z-10 mx-auto my-auto absolute ml-4 mt-6 text-white text-[60px] text-black-contour">
              b
            </div>
          )}
        </div>
      </div>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 10, position: "fixed", top: 0, left: 0 }}
        />
      )}
    </div>
  );
};

export default Announcement;
