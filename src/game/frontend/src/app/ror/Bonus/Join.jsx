import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Confetti from "react-confetti";
import { ThumbsUp } from "lucide-react";
import { RorContext } from "../../../context/context";
import { trackEvent } from "../../../utils/ga";
import { fetchJoiningBonus } from "../../../utils/api.ror";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import BasicLayout from "../../../components/Layouts/BasicLayout";

const tele = window.Telegram?.WebApp;

const JoinBonus = (props) => {
  const { t } = useTranslation();
  const {
    setSection,
    authToken,
    setGameData,
    enableHaptic,
    isTgMobile,
    assets,
  } = useContext(RorContext);
  const [changeText, setChangeText] = useState(true);
  const [disableHand, setDisableHand] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const bonusText = t("bonus.join").split(" ");
  let disableRef = useRef(false);

  const playConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleClaimBonus = async () => {
    if (disableRef.current === false) {
      handleClickHaptic(tele, enableHaptic);
      disableRef.current = true;

      try {
        await fetchJoiningBonus(authToken);
        trackEvent("rewards", "claim_join_reward", "success");
        setTimeout(() => {
          setSection(1);
        }, 1000);
        setGameData((prevItems) => {
          const newStats = { ...prevItems.stats };
          newStats.gobcoin = prevItems.stats.gobcoin + 9;

          return {
            ...prevItems,
            stats: newStats,
          };
        });
      } catch (error) {
        console.log(error);
        showToast("default");
      }
    }
  };

  useEffect(() => {
    playConfetti();
    setTimeout(() => {
      setDisableHand(false);
    }, 2000);

    setTimeout(() => {
      handleClaimBonus();
    }, 4000);
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setChangeText((prevText) => !prevText);
  //     setFlipped((prev) => !prev);
  //   }, 1500);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <BasicLayout
        TopChild={
          <h1 className="bonus-heading-text">
            {changeText ? bonusText[0] : bonusText[1]}
          </h1>
        }
        CenterChild={
          <div className={`orb ${flipped ? "flipped" : ""}`}>
            <div className="orb__face orb__face--front  flex justify-center items-center">
              <div className="flex justify-center items-center w-full relative  h-full">
                <img
                  src={assets.uxui.gobcoin}
                  alt="coin"
                  className="glow-box rounded-full"
                />
                <div className="absolute text-[10rem] font-roboto font-bold text-shadow text-gray-600 opacity-85 grayscale">
                  9
                </div>
              </div>
            </div>
            <div className="orb__face orb__face--back flex justify-center items-center">
              <div className="flex justify-center items-center w-full absolute h-full glow-tap-greek">
                <img
                  src={`${assets.uxui.baseOrb}`}
                  alt="orb"
                  className="filter-orbs-greek rounded-full"
                />
                <span
                  className={`absolute inset-0 flex justify-center items-center text-element-lg mt-14 text-white font-symbols opacity-50 orb-symbol-shadow`}
                >
                  d
                </span>
              </div>
            </div>
          </div>
        }
        BottomChild={
          <div className="text-gold w-full uppercase flex justify-center items-center text-bonus-desc -mb-[1.1rem]">
            <h1> {flipped ? "BAG" : "9 GOBCOINS"}</h1>
          </div>
        }
      />

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 10, position: "fixed", top: 0, left: 0 }}
        />
      )}
    </>
  );
};

export default JoinBonus;
