import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchJoiningBonus } from "../../../utils/api";
import { FofContext } from "../../../context/context";
import Confetti from "react-confetti";
import { ThumbsUp } from "lucide-react";
import { trackEvent } from "../../../utils/ga";
import { handleClickHaptic } from "../../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const JoinBonus = (props) => {
  const { t } = useTranslation();
  const { setGameData, setSection, authToken, assets, enableHaptic } =
    useContext(FofContext);
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
          setSection(0);
        }, 1000);
        setGameData((prevData) => {
          const updatedMythologies = prevData.mythologies.map((mythology) => {
            if (mythology.name === "Greek") {
              return {
                ...mythology,
                orbs: mythology.orbs + 2,
              };
            }
            return mythology;
          });

          const updatedData = {
            ...prevData,
            multiColorOrbs: prevData.multiColorOrbs + 3,
            mythologies: updatedMythologies,
          };

          return updatedData;
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

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
      setFlipped((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex relative flex-col h-screen w-screen justify-center font-fof items-center bg-black">
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
                <div className="orb__face orb__face--front  flex justify-center items-center">
                  <div className="flex justify-center items-center w-full absolute  h-full">
                    <img
                      src={`${assets.uxui.multiorb}`}
                      alt="multicolor"
                      className="glow-box rounded-full"
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
        <div className="text-gold text-[12.2vw] absolute bottom-6 mt-4 w-full flex justify-center items-center">
          {changeText ? "3 Multi Orbs" : "2 Fire Orbs"}
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

export default JoinBonus;
