import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { ThumbsUp } from "lucide-react";
import { t } from "i18next";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { determineStreak } from "../../helpers/streak.helper";
import { mythSections } from "../../utils/constants";

const tele = window.Telegram?.WebApp;

const StreakBonus = (props) => {
  const { assets, setSection, userData, enableHaptic } = useContext(MyContext);
  const [changeText, setChangeText] = useState(true);
  const [disableHand, setDisableHand] = useState(true);
  const reward = determineStreak(userData.streak.streakCount);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisableHand(false);
    }, 2000);
    const closeTimeout = setTimeout(() => {
      setSection(5);
    }, 4000);

    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      clearTimeout(closeTimeout);
    };
  }, []);

  return (
    <div
      className="flex relative flex-col w-screen justify-center font-fof items-center bg-black"
      style={{
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
    >
      <div className="flex flex-col w-full h-full items-center">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center  pt-4 w-full z-50 h-1/5">
          <div className="text-gold text-[60px] font-symbols">t</div>
          <h1 className="uppercase text-gold text-[12.2vw] text-center -mt-2 text-black-contour break-words leading-[55px]">
            {changeText
              ? `${userData.streak.streakCount + " " + t("misc.day")}`
              : "Streak"}
          </h1>
        </div>
        {/* Main */}
        <div className="flex justify-center items-center w-full absolute  h-full">
          <div className="relative h-[55%] w-[72%] flex items-center justify-center rounded-primary card-shadow-white">
            <div
              className={`absolute inset-0 rounded-[15px]`}
              style={{
                backgroundImage: `url(${
                  assets.boosters[`${reward.reward}Card`]
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center center ",
              }}
            />
            <div className="text-primary rotate-6 text-black-contour text-white font-fof w-7 h-7 absolute top-0 right-7">
              {reward.multiplier}X
            </div>
            <div
              className={`flex relative  mt-auto items-center h-[19%] w-full card-shadow-white-celtic `}
            >
              <div
                style={{
                  backgroundImage: `url(${assets.uxui.paper})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
                className={`rounded-b-primary filter-paper-${userData.streak.lastMythClaimed?.toLowerCase()}`}
              />
              <div className="flex w-full z-50 justify-center items-center font-symbols text-white text-[60px] text-black-contour">
                {reward.reward === "automata"
                  ? "n"
                  : reward.reward === "alchemist"
                  ? "9"
                  : "s"}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start text-color  justify-start w-full h-1/5"></div>
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            updateRewards();
            setSection(6);
          }}
          className="flex absolute items-start bottom-[92px] justify-center w-full"
        >
          <img
            src="/assets/badges/superstar.svg"
            alt="badge"
            className="w-[16vw] h-[16vw]"
          />

          {disableHand && (
            <div className="font-symbols scale-point z-10 mx-auto my-auto absolute ml-4 mt-6 text-white text-[60px] text-black-contour">
              b
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreakBonus;
