import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Confetti from "react-confetti";
import { ThumbsUp } from "lucide-react";
import { RorContext } from "../../context/context";
import { trackEvent } from "../../utils/ga";
import { fetchJoiningBonus } from "../../utils/api.ror";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const JoinBonus = (props) => {
  const { t } = useTranslation();
  const {
    setSection,
    authToken,
    setGameData,
    enableHaptic,
    isTelegram,
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
          newStats.gobcoins = prevItems.stats.gobcoin + 9;

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
    <div
      className={`flex relative flex-col ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      } w-screen justify-center font-fof items-center bg-black`}
    >
      <div className="flex flex-col w-full h-full items-center">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center  pt-4 w-full z-50 h-1/5">
          <div className="text-gold text-[60px] font-symbols">t</div>
          <h1 className="uppercase text-gold text-[12.2vw] text-center -mt-2 text-black-contour break-words leading-[55px]">
            {changeText ? bonusText[0] : bonusText[1]}
          </h1>
        </div>
        {/* Main */}
        <div className="flex justify-center items-center w-full absolute  h-full">
          <div className="flex relative flex-col items-center cursor-pointer mt-5 z-50">
            <div className={``}>
              <div className={`orb ${flipped ? "flipped" : ""}`}>
                <div className="orb__face orb__face--front absolute flex justify-center items-center">
                  <div className="flex justify-center items-center w-full relative  h-full">
                    <img
                      src={assets.uxui.gobcoin}
                      alt="coin"
                      className="glow-box rounded-full"
                    />
                    <div className="absolute text-[40vw] font-roboto font-bold text-shadow text-gray-600 opacity-85 grayscale">
                      9
                    </div>
                  </div>
                </div>
                <div className="orb__face orb__face--back flex justify-center items-center">
                  <div className="flex justify-center items-center w-full absolute h-full glow-tap-white">
                    <img
                      src={`https://media.publit.io/file/BeGods/items/240px-celtic.artifact.starter00.png`}
                      alt="bag"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="flex items-start text-color  justify-start w-full h-1/5"></div>
        <div
          onClick={handleClaimBonus}
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
        {/* <div className="text-gold text-[12.2vw] absolute bottom-6 mt-4 w-full flex justify-center items-center">
          {changeText ? "3 Gobcoins" : "1 Bag"}
        </div> */}
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

export default JoinBonus;
