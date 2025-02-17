import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { ThumbsUp } from "lucide-react";
import { t } from "i18next";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const StreakBonus = (props) => {
  const {
    assets,
    setSection,
    userData,
    activeReward,
    setActiveReward,
    setRewards,
    setTriggerConf,
    enableHaptic,
  } = useContext(MyContext);
  const [changeText, setChangeText] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [disableHand, setDisableHand] = useState(true);

  const updateRewards = () => {
    setRewards((prev) => {
      const updatedRewards = [...prev];
      const reward = updatedRewards.find((item) => item.id === activeReward.id);
      if (reward) {
        reward.tokensCollected += 1;
      }
      if (reward.tokensCollected === 12) {
        setTriggerConf(true);
      }

      setActiveReward(
        updatedRewards.find((item) => item.id === activeReward.id)
      );

      return updatedRewards;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisableHand(false);
    }, 2000);
    const closeTimeout = setTimeout(() => {
      updateRewards();
      setSection(6);
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
              ? `${userData.streakCount + " " + t("misc.day")}`
              : t("bonus.join").split(" ")[1]}
          </h1>
        </div>
        {/* Main */}
        <div className="flex justify-center items-center w-full absolute  h-full">
          <div className="flex relative flex-col items-center cursor-pointer mt-5 z-50">
            <div className={``}>
              <div className={`orb ${flipped ? "flipped" : ""}`}>
                <div className="orb__face orb__face--front  flex justify-center items-center">
                  <div className="flex justify-center items-center w-full absolute  h-full">
                    <img
                      src={
                        activeReward.partnerType == "playsuper"
                          ? `${activeReward.metadata.campaignCoverImage}`
                          : `https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/160px-${activeReward.metadata.campaignCoverImage}.bubble.png`
                      }
                      alt="multicolor"
                      className="glow-box rounded-full h-[55vw] w-[55vw]"
                    />
                  </div>
                </div>
                <div className="orb__face orb__face--back flex justify-center items-center">
                  <div className="flex justify-center items-center w-full absolute h-full glow-tap-greek">
                    <img
                      src={`${assets.uxui.baseorb}`}
                      alt="orb"
                      className="filter-orbs-greek rounded-full"
                    />
                    <span
                      className={`absolute inset-0 flex justify-center items-center text-[180px] mt-4 text-white font-symbols opacity-50 orb-symbol-shadow`}
                    >
                      d
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="flex items-start text-color  justify-start w-full h-1/5"></div>
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            updateRewards();
            setSection(6);
          }}
          className="flex absolute items-start bottom-[92px] justify-center w-full"
        >
          <ThumbsUp
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
        <div className="text-gold text-[12.2vw] absolute bottom-6 mt-4 w-full flex justify-center items-center">
          VOUCHER
        </div>
      </div>
    </div>
  );
};

export default StreakBonus;
