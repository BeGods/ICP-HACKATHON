import React, { useContext, useEffect, useState } from "react";
import IconBtn from "../../Buttons/IconBtn";
import {
  boosterIcon,
  elementNames,
  mythSections,
  mythSymbols,
} from "../../../utils/constants";
import ReactHowler from "react-howler";
import { Download } from "lucide-react";
import { MyContext } from "../../../context/context";

const MilestoneCard = ({
  activeMyth,
  closeCard,
  isOrb,
  isBlack,
  booster,
  handleClick,
  isMulti,
  isForge,
  t,
}) => {
  const [disableSound, setDisableSound] = useState(true);
  const { enableSound, assets } = useContext(MyContext);

  useEffect(() => {
    setTimeout(() => {
      setDisableSound(false);
    }, 2200);
  }, []);

  return (
    <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
      <div className="relative w-[72%] h-[55%] mt-[70px]  flex items-center justify-center rounded-primary card-shadow-white">
        <div
          className="absolute inset-0 filter-card rounded-[15px]"
          style={{
            backgroundImage: `url(${assets.uxui.info})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center ",
          }}
        />
        <div className="relative h-full w-full flex flex-col items-center">
          <div className="flex relative flex-col justify-center items-center h-full w-full">
            {!isForge && (
              <IconBtn
                isInfo={false}
                activeMyth={activeMyth}
                handleClick={closeCard}
                align={0}
              />
            )}
            {isOrb && isMulti ? (
              <div
                className={`flex absolute  text-center justify-center items-center h-full w-[72%] glow-symbol-black`}
              >
                <img
                  src={assets.uxui.multiorb}
                  alt="orb"
                  className={`w-full rounded-full orb`}
                />
              </div>
            ) : isOrb && !isMulti ? (
              <div
                className={`flex absolute text-center justify-center items-center h-full w-[72%] glow-symbol-${
                  isBlack ? "black" : mythSections[activeMyth]
                }`}
              >
                <div className="relative w-full h-full flex justify-center items-center">
                  <img
                    src={assets.uxui.baseorb}
                    alt="orb"
                    className={`w-full filter-orbs-${
                      isBlack ? "black" : mythSections[activeMyth]
                    } rounded-full orb`}
                  />
                  {/* symbol */}
                  <span
                    className={`absolute inset-0 flex justify-center items-center text-[180px] mt-4 text-white font-symbols opacity-50 orb-symbol-shadow`}
                  >
                    {isBlack ? 3 : mythSymbols[mythSections[activeMyth]]}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className={`flex relative text-center justify-center items-center w-[72%] h-full`}
              >
                <img
                  src="/assets/uxui/240px-shard.base.png"
                  alt="orb"
                  className={`w-full filter-orbs-${
                    isBlack ? "black" : mythSections[activeMyth]
                  }`}
                />
              </div>
            )}
            <div
              className={`flex relative  mt-auto items-center h-[19%] w-full uppercase card-shadow-white-celtic text-white`}
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
                className={`rounded-b-primary filter-paper-${
                  isBlack ? "black" : mythSections[activeMyth]
                }`}
              />
              <div className="flex justify-center w-full h-full items-center px-3 z-10 text-primary glow-text-black">
                {isOrb && !isMulti ? (
                  <h1>
                    {isBlack
                      ? t("elements.aether")
                      : t(
                          `elements.${elementNames[activeMyth].toLowerCase()}`
                        )}{" "}
                    Orb
                  </h1>
                ) : isOrb && isMulti ? (
                  <h1>MultiOrb</h1>
                ) : (
                  <div className="font-symbols absolute">
                    <h1 className="text-booster">{boosterIcon[booster]}</h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Download
        size={"14vw"}
        color="#ffd660"
        onClick={handleClick}
        className="scale-icon mt-2"
      />
      {disableSound && (
        <ReactHowler
          src={assets.audio.fofOrb}
          playing={enableSound}
          html5={true}
        />
      )}
    </div>
  );
};

export default MilestoneCard;
