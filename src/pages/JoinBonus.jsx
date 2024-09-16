import { Gift } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Button from "../components/Buttons/Button";
import { useTranslation } from "react-i18next";
import { fetchJoiningBonus } from "../utils/api";
import { MyContext } from "../context/context";
import Confetti from "react-confetti";

const tele = window.Telegram?.WebApp;

const JoinBonus = (props) => {
  const { t } = useTranslation();
  const { setGameData, userData, setSection } = useContext(MyContext);
  const [showConfetti, setShowConfetti] = useState(false);

  const playConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      if (userData.isEligibleToClaim) {
        setSection(5);
      } else {
        setSection(0);
      }
    }, 3000);
  };

  const handleClaimBonus = async () => {
    tele.HapticFeedback.notificationOccurred("success");
    const accessToken = localStorage.getItem("accessToken");

    try {
      await fetchJoiningBonus(accessToken);
      playConfetti();

      setGameData((prevData) => {
        const updateData = {
          ...prevData,
          multiColorOrbs: prevData.multiColorOrbs - 1,
        };
        return updateData;
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleClaimBonus();
    }, 3000);
  }, []);

  return (
    <div className="flex relative flex-col h-screen w-screen justify-center font-fof items-center bg-black">
      <div className="flex flex-col w-full h-full items-center">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center  pt-4 w-full h-1/5">
          <Gift color="#FFD660" size={"20vw"} />
          <h1 className="uppercase text-gold text-[14.2vw] -mt-4 text-black-contour">
            BONUS
          </h1>
        </div>
        {/* Main */}
        <div className="flex justify-center items-center w-full absolute  h-full">
          <img
            src="/assets/uxui/240px-orb.multicolor.png"
            alt="multicolor"
            className="glow-box "
          />
        </div>
        {/* Bottom */}
        <div className="flex items-start text-color  justify-start w-full h-1/5"></div>
        <div className="flex absolute items-start bottom-[92px] justify-center w-full">
          <Button
            message={t("buttons.claim")}
            isGold={true}
            handleClick={handleClaimBonus}
          />
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
