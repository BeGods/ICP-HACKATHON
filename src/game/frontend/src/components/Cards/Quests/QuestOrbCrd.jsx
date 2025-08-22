import { useEffect, useState } from "react";
import Symbol from "../../Common/Symbol";
import { mythSections } from "../../../utils/constants.fof";
import IconBtn from "../../Buttons/IconBtn";
import MappedOrbs from "../../Common/MappedOrbs";
import Confetti from "react-confetti";
import OverlayLayout from "../../Layouts/OverlayLayout";
import { PrimaryBtn } from "../../Buttons/PrimaryBtn";
import { useStore } from "../../../store/useStore";

const OrbCard = ({ activeMyth }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center w-full absolute h-full`}
    >
      <Symbol myth={mythSections[activeMyth]} isCard={3} />
      <div className="absolute bottom-2 text-primary text-gold text-black-contour">
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
  const assets = useStore((s) => s.assets);
  const isTgMobile = useStore((s) => s.isTgMobile);

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
    <OverlayLayout>
      <div className="center-section">
        <div
          className={`relative card-width rounded-lg shadow-lg flex flex-col z-50`}
        >
          <div
            className={`card ${
              flipped ? "flipped" : ""
            }  text-black-contour mb-1`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                setFlipped((prev) => !prev);
              }}
              className="card__face card__face--front relative card-shadow-white  flex justify-center items-center"
            >
              <img
                src={
                  assets.questCards?.[mythSections[activeMyth]]?.[quest?.type]
                }
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
                e.stopPropagation();
                setFlipped((prev) => !prev);
              }}
              className="card__face card__face--back flex flex-col justify-center items-center"
            >
              <OrbCard activeMyth={activeMyth} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute flex justify-center w-full bottom-0 mb-safeBottom">
        <PrimaryBtn
          mode="share"
          onClick={handleOrbClaimReward}
          rightContent={1}
          disable={false}
          link={`https://twitter.com/intent/tweet?text=%F0%9F%8C%9F%20Quest%20Completed!%20%F0%9F%8C%9F%0AEmbark%20on%20your%20next%20adventure%20with%20BeGODS%20Quests%20in%20Forges%20of%20Faith%20%E2%80%94%20where%20you%20Play-2-L(earn)%20through%20myth%20and%20battle!%20%F0%9F%9B%A1%F0%9F%94%A5%0A%40BattleofGods_io%0Ahttps%3A%2F%2Fx.com%2FBattleofGods_io%2Fstatus%2F${quest.link[1]}%0A%0A%F0%9F%8E%AE%20Play%3A%20https%3A%2F%2Fplay.begods.games`}
        />
      </div>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 10, position: "fixed", top: 0, left: 0 }}
        />
      )}
    </OverlayLayout>
  );
};

export default OrbClaimCard;
