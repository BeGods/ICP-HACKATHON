import React from "react";
import IconButton from "../Buttons/IconButton";
import {
  boosterIcon,
  elementNames,
  mythSections,
  mythSymbols,
} from "../../utils/variables";

const MilestoneCard = ({
  activeMyth,
  closeCard,
  isOrb,
  isBlack,
  booster,
  Button,
  isMulti,
  t,
}) => {
  return (
    <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-sm bg-opacity-60 z-50">
      <div className="relative w-[72%] h-[55%] mt-[70px]  flex items-center justify-center rounded-primary glow-card">
        <div
          className="absolute inset-0 filter-card  rounded-[15px]"
          style={{
            backgroundImage: `url(/assets/cards/320px-info_background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center ",
          }}
        />
        <div className="relative h-full w-full flex flex-col items-center">
          <div className="flex relative flex-col justify-center items-center h-full w-full">
            <IconButton
              isInfo={false}
              activeMyth={activeMyth}
              handleClick={closeCard}
              align={0}
            />
            {isOrb && isMulti ? (
              <div
                className={`flex absolute  text-center justify-center items-center h-full w-[72%] glow-symbol-black`}
              >
                <img
                  src="/assets/uxui/240px-orb.multicolor.png"
                  alt="orb"
                  className={`w-full rounded-full orb`}
                />
              </div>
            ) : isOrb && !isMulti ? (
              <div
                className={`flex absolute  text-center justify-center items-center h-full w-[72%] glow-symbol-${
                  isBlack ? "black" : mythSections[activeMyth]
                } `}
              >
                <img
                  src="/assets/uxui/240px-orb.base.png"
                  alt="orb"
                  className={`w-full filter-orbs-${
                    isBlack ? "black" : mythSections[activeMyth]
                  }  rounded-full orb`}
                />
                <span
                  className={`absolute  z-1 text-[200px] text-white font-symbols opacity-50 orb-glow`}
                >
                  {isBlack ? 3 : mythSymbols[mythSections[activeMyth]]}
                </span>
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
              className={`flex relative  mt-auto items-center h-[19%] w-full uppercase glow-card-celtic text-white`}
            >
              <div
                style={{
                  backgroundImage: `url(/assets/uxui/fof.footer.paper.png)`,
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
              <div className="flex justify-center w-full h-full items-center px-3 z-10 text-primary glow-quest-other">
                {isOrb && !isMulti ? (
                  <h1>
                    {isBlack
                      ? t("elements.aether")
                      : t(`elements.${elementNames[activeMyth]}`)}{" "}
                    Orb
                  </h1>
                ) : isOrb && isMulti ? (
                  <h1>Multi Orb</h1>
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
      {Button}
    </div>
  );
};

export default MilestoneCard;
