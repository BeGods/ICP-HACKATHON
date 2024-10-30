import React, { useContext, useEffect, useState } from "react";
import Symbol from "../../Common/Symbol";
import { mythSections } from "../../../utils/constants";
import ShareButton from "../../Buttons/ShareBtn";
import IconBtn from "../../Buttons/IconBtn";
import MappedOrbs from "../../Common/MappedOrbs";
import { MyContext } from "../../../context/context";
import Confetti from "react-confetti";

const OrbCard = ({ activeMyth }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center w-full absolute h-full`}
    >
      <Symbol myth={mythSections[activeMyth]} isCard={3} />
      <div className="absolute bottom-0 text-[9vw] mt-4 text-gold text-black-contour">
        $FAITH TOKEN
      </div>
    </div>
  );
};

const OrbClaimCard = ({
  t,
  quest,
  handleOrbClaimReward,
  handleShowClaim,
  activeMyth,
}) => {
  const { enableSound, assets } = useContext(MyContext);
  const [flipped, setFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const playConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  useEffect(() => {
    playConfetti();
    const interval = setInterval(() => {
      setFlipped((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0  bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="relative w-[72%] rounded-lg shadow-lg mt-[70px] flex flex-col z-50">
        <div className={`card ${flipped ? "flipped" : ""} text-black-contour`}>
          <div
            onClick={(e) => {
              setFlipped((prev) => !prev);
            }}
            className="card__face card__face--front relative card-shadow-white  flex justify-center items-center"
          >
            <img
              src={assets.questCards?.[mythSections[activeMyth]]?.[quest?.type]}
              alt="card"
              className="w-full h-full mx-auto rounded-[15px]"
            />

            <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
              <div className="flex w-full">
                <div className="m-2 z-50">
                  <MappedOrbs quest={quest} />
                </div>
                <IconBtn
                  isInfo={false}
                  activeMyth={activeMyth}
                  handleClick={handleShowClaim}
                  align={1}
                />
              </div>
              <div
                className={`flex relative items-center h-[19%] uppercase card-shadow-white-${mythSections[activeMyth]} text-white`}
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
                  className={`filter-paper-${mythSections[activeMyth]} rounded-b-[15px]`}
                />
                <div
                  className={`flex justify-between w-full h-full items-center glow-text-quest px-3 z-10`}
                >
                  <div>{quest?.questName}</div>
                  <div className="">
                    <Symbol myth={mythSections[activeMyth]} isCard={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={(e) => {
              setFlipped((prev) => !prev);
            }}
            className="card__face card__face--back flex flex-col justify-center items-center"
          >
            <OrbCard activeMyth={activeMyth} />
          </div>
        </div>
        <ShareButton
          isShared={false}
          isInfo={false}
          isOrbClaimCard={true}
          handleClaim={handleOrbClaimReward}
          activeMyth={activeMyth}
          t={t}
          link={quest?.link[0]}
        />
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

export default OrbClaimCard;
