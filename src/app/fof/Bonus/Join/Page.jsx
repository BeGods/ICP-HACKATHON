import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchJoiningBonus } from "../../../../utils/api.fof";
import Confetti from "react-confetti";
import { trackEvent } from "../../../../utils/ga";
import { handleClickHaptic } from "../../../../helpers/cookie.helper";
import BasicLayout from "../../../../components/Layouts/BasicLayout";
import { useStore } from "../../../../store/useStore";

const tele = window.Telegram?.WebApp;

const JoinBonus = (props) => {
  const { t } = useTranslation();
  const setGameData = useStore((s) => s.setGameData);
  const setSection = useStore((s) => s.setSection);
  const authToken = useStore((s) => s.authToken);
  const assets = useStore((s) => s.assets);
  const enableHaptic = useStore((s) => s.enableHaptic);

  const [changeText, setChangeText] = useState(true);
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
              <div className="flex justify-center items-center w-full absolute  h-full">
                <img
                  src={`${assets.items.multiorb}`}
                  alt="multicolor"
                  className="glow-box rounded-full"
                />
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
          <div className="text-gold w-full flex justify-center items-center text-bonus-desc -mb-[1.1rem]">
            <h1> {changeText ? "3 Multi Orbs" : "2 Fire Orbs"}</h1>
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
