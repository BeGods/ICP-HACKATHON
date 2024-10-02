import { Gift } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "../components/Buttons/Button";
import { useTranslation } from "react-i18next";
import { fetchJoiningBonus } from "../utils/api";
import { MyContext } from "../context/context";
import Confetti from "react-confetti";

const tele = window.Telegram?.WebApp;

const JoinBonus = (props) => {
  const { t } = useTranslation();
  const { setGameData, setSection, authToken } = useContext(MyContext);
  const [showConfetti, setShowConfetti] = useState(false);
  const [disableHand, setDisableHand] = useState(false);
  let disableRef = useRef(false);

  const playConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleClaimBonus = async () => {
    if (disableRef.current === false) {
      tele.HapticFeedback.notificationOccurred("success");
      disableRef.current = true;

      try {
        await fetchJoiningBonus(authToken);
        setTimeout(() => {
          setSection(1);
        }, 1000);
        setGameData((prevData) => {
          const updateData = {
            ...prevData,
            multiColorOrbs: prevData.multiColorOrbs + 3,
          };
          return updateData;
        });
      } catch (error) {
        console.log(error);
        //!TODO :  add toast
      }
    }
  };

  useEffect(() => {
    playConfetti();
    setTimeout(() => {
      setDisableHand(true);
    }, 2000);
    setTimeout(() => {
      handleClaimBonus();
    }, 20000);
  }, []);

  return (
    <div className="flex relative flex-col h-screen w-screen justify-center font-fof items-center bg-black">
      <div
        className="absolute animate-spin-slow scale-150 z-0"
        style={{
          background: "url(/assets/fx/star.light.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center center",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      ></div>
      <div className="flex flex-col w-full h-full items-center">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center  pt-4 w-full z-50 h-1/5">
          <h1 className="uppercase text-gold text-[14.2vw] text-center -mt-4 text-black-contour leading-[55px]">
            Joining <br />
            BONUS
          </h1>
        </div>
        {/* Main */}
        <div className="flex justify-center items-center w-full absolute  h-full">
          <img
            src="/assets/uxui/240px-orb.multicolor.png"
            alt="multicolor"
            className="glow-box rounded-full"
          />
          <div className="absolute z-10">
            <div className="font-medium text-[44vw] text-white glow-text-black">
              3
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="flex items-start text-color  justify-start w-full h-1/5"></div>
        <div
          onClick={handleClaimBonus}
          className="flex absolute items-start bottom-[92px] justify-center w-full"
        >
          <Gift color="#FFD660" size={"18vw"} />
          {!disableHand && (
            <div className="font-symbols scale-point z-10 mx-auto my-auto absolute  ml-2.5 -mt-3 text-white text-[100px] text-black-contour">
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

export default JoinBonus;
