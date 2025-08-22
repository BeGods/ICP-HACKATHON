import { useEffect, useState } from "react";
import { t } from "i18next";
import { handleClickHaptic } from "../../../../helpers/cookie.helper";
import { determineStreak } from "../../../../helpers/streak.helper";
import BasicLayout from "../../../../components/Layouts/BasicLayout";
import { useStore } from "../../../../store/useStore";

const tele = window.Telegram?.WebApp;

const StreakBonus = () => {
  const assets = useStore((s) => s.assets);
  const setSection = useStore((s) => s.setSection);
  const userData = useStore((s) => s.userData);
  const enableHaptic = useStore((s) => s.enableHaptic);
  const [changeText, setChangeText] = useState(true);
  const reward = determineStreak(userData.streak.streakCount);

  useEffect(() => {
    const closeTimeout = setTimeout(() => {
      setSection(8);
    }, 4000);

    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => {
      clearInterval(interval);
      clearTimeout(closeTimeout);
    };
  }, []);

  return (
    <>
      <BasicLayout
        TopChild={
          <h1 className="bonus-heading-text">
            {changeText
              ? `${userData.streak.streakCount + " " + t("misc.day")}`
              : "Streak"}
          </h1>
        }
        CenterChild={
          <div
            className={`relative card-width flex items-center justify-center rounded-primary`}
          >
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
                  backgroundImage: `url(${assets.uxui.footer})`,
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
        }
        BottomChild={
          <div
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setSection(8);
            }}
            className="flex justify-center items-center w-full"
          >
            <img
              src="/assets/badges/superstar.svg"
              alt="badge"
              className="w-[4rem] h-[4rem]"
            />
          </div>
        }
      />
    </>
  );
};

export default StreakBonus;
