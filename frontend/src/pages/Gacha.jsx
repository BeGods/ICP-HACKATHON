import Lottie from "lottie-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import animationData from "../../public/assets/fx/gacha.json";
import { fetchDailyBonus } from "../utils/api";
import QuestCard from "../components/QuestCards/QuestCard";
import { mythologies } from "../utils/variables";
import { useNavigate } from "react-router-dom";
import MilestoneCard from "../components/MilestoneCard";
import AutomataCard from "../components/Cards/Boosters/AutomataCard";
import Confetti from "react-confetti";
import { Crown } from "lucide-react";

const BonusClaimButton = ({ action, message }) => {
  return (
    <div
      onClick={action}
      className="w-button-primary flex justify-between mx-auto mt-[10px] items-center h-button-primary border border-gold rounded-primary cursor-pointer"
    >
      <div className="flex justify-center items-center w-1/4 h-full"></div>
      <div className="text-[16px] uppercase text-gold">{message}</div>
      <div className="flex justify-center items-center w-1/4  h-full"></div>
    </div>
  );
};

const FlashScreen = ({ showFlash }) => {
  const [runConfetti, setRunConfetti] = useState(false);

  useEffect(() => {
    setRunConfetti(true);
    setTimeout(() => {
      setRunConfetti(false);
    }, 5000);
  }, []);

  return (
    <div
      className={`fixed flex flex-col  items-center  h-screen w-screen flash-overlay ${
        showFlash ? "show" : ""
      }`}
    >
      <div className="w-full flex flex-col justify-center bg-glass-black h-screen gap-10">
        <h1 className="w-full text-center mt-10 text-gold text-[9vw]">
          CONGRATULATIONS!
        </h1>
        <div className="w-full flex flex-col flex-grow justify-start gap-12">
          <div className="w-[80vw] h-[80vw] relative rounded-full bg-black mx-auto flex items-center justify-center">
            <div className="w-[90%] h-[90%] rounded-full  flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-white font-symbols text-[70vw] mx-auto">
                q
              </div>
            </div>
            <div className="absolute bottom-0 text-white text-[9vw]">
              AUTOMATA
            </div>
          </div>
          <div className="w-button-primary flex justify-between mx-auto bg-black items-center h-button-primary border border-gold rounded-primary cursor-pointer">
            <div className="flex justify-center items-center w-1/4 h-full"></div>
            <div className="text-[16px] uppercase text-gold">Claim</div>
            <div className="flex justify-center items-center w-1/4  h-full"></div>
          </div>
        </div>
      </div>

      {runConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 50, position: "fixed", top: 0, left: 0 }}
        />
      )}
    </div>
  );
};

const Gacha = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lottieRef = useRef(null);
  const [reward, setReward] = useState(null);
  const [showSpin, setShowSpin] = useState(true);
  const [showFlash, setShowFlash] = useState(false);

  const claimDailyBonus = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }
    try {
      const response = await fetchDailyBonus(token);
      if (response && response.reward) {
        handlePlay();
        setTimeout(() => {
          setShowSpin(false);
          setReward(response.reward);
          setShowFlash(true);
        }, 4000);
      } else {
        console.error("No reward in response:", response);
      }
    } catch (error) {
      console.error("Failed to claim daily bonus:", error);
    }
  };

  const handlePlay = () => {
    if (lottieRef.current) {
      lottieRef.current.play();
      lottieRef.current.setSpeed(3);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen justify-center font-fof items-center bg-black ">
      <div className="flex flex-col h-full items-center justify-start mt-5">
        <div className="flex flex-col justify-center items-center  w-full ">
          {/* <img src="/assets/uxui/bonus.svg" alt="bonus" className="w-[20vw]" /> */}
          <Crown color="white" size={"30vw"} />
          <h1 className="uppercase text-gold text-[60px] -mt-4">Win</h1>
        </div>
        <div className="flex relative items-center">
          <img src="/assets/uxui/box.png" alt="box" className="w-full h-fit" />
          {showSpin && (
            <div className="absolute">
              <Lottie
                lottieRef={lottieRef}
                autoplay={false}
                loop
                animationData={animationData}
                className="w-full h-full"
              />
            </div>
          )}
        </div>
        <BonusClaimButton
          action={claimDailyBonus}
          message={t(`buttons.spin`)}
        />
      </div>
      {showFlash && <FlashScreen showFlash={showFlash} />}
      {/* {reward?.type === "quest" && (
        <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-sm bg-opacity-60 z-50">
          <QuestCard
            quest={reward?.quest}
            activeMyth={mythologies.indexOf(reward?.quest.mythology)}
            curr={0}
            t={t}
            Button={
              <BonusClaimButton
                message={t(`buttons.claim`)}
                action={() => {
                  navigate("/home");
                }}
              />
            }
          />
        </div>
      )} */}
      {/* {(reward?.type === "shards" ||
        reward?.type === "mythOrb" ||
        reward?.type === "blackOrb") && (
        <MilestoneCard
          activeCard={reward?.type}
          isOrb={reward?.type === "mythOrb" || reward?.type === "blackOrb"}
          isBlack={reward?.type === "blackOrb"}
          activeMyth={mythologies.indexOf(reward?.mythology)}
          closeCard={() => {
            navigate("/home");
          }}
          booster={reward?.type === "shards" && 5}
          t={t}
          Button={
            <BonusClaimButton
              message={t(`buttons.claim`)}
              action={() => {
                navigate("/home");
              }}
            />
          }
        />
      )} */}
      {/* {reward?.type === "automata" && (
        <AutomataCard
          activeCard={reward?.type}
          activeMyth={mythologies.indexOf(reward?.mythology)}
          closeCard={() => {
            navigate("/home");
          }}
          Button={
            <BonusClaimButton
              message={t(`buttons.claim`)}
              action={() => {
                navigate("/home");
              }}
            />
          }
        />
      )} */}
    </div>
  );
};

export default Gacha;
