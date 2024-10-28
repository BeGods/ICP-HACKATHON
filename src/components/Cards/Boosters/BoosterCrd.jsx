import React, { useContext, useEffect } from "react";
import { mythSections } from "../../../utils/constants";
import IconBtn from "../../Buttons/IconBtn";
import ReactHowler from "react-howler";
import { MyContext } from "../../../context/context";
import { ToggleLeft, ToggleRight } from "../../Common/SectionToggles";

const BoosterClaim = ({ activeCard, Button, closeCard, disableIcon }) => {
  const { gameData, section, enableSound, assets, setActiveMyth, activeMyth } =
    useContext(MyContext);

  console.log(
    assets.boosters[`${activeCard === "minion" ? "alchemist" : activeCard}Card`]
  );

  return (
    <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
      {section === 2 && (
        <div className="flex gap-3 absolute bottom-5">
          <div className="flex gap-1 items-center">
            <div
              className={`flex relative text-center justify-center max-w-orb p-0.5 items-center rounded-full glow-icon-white`}
            >
              <img src={assets.uxui.multiorb} alt="orb" />
            </div>
            <div
              className={`font-fof text-[28px] font-normal text-white text-black-sm-contour transition-all duration-1000`}
            >
              {gameData.multiColorOrbs}
            </div>
          </div>
        </div>
      )}
      <div className="relative w-[72%] h-[55%] mt-[70px]  flex items-center justify-center rounded-primary card-shadow-white">
        <div
          className={`absolute inset-0 rounded-[15px]`}
          style={{
            backgroundImage: `${`url(${
              assets.boosters[
                `${activeCard === "minion" ? "alchemist" : activeCard}Card`
              ]
            })`}`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center ",
          }}
        />
        <div className="relative h-full w-full flex flex-col items-center">
          <div className="flex relative flex-col justify-center items-center h-full w-full">
            {!disableIcon && (
              <IconBtn
                isInfo={false}
                activeMyth={activeMyth}
                handleClick={closeCard}
                align={0}
              />
            )}
            <div
              className={`flex relative  mt-auto items-center h-[19%] w-full card-shadow-white-celtic text-white`}
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
                className={`rounded-b-primary filter-paper-${mythSections[activeMyth]}`}
              />
              <div className="flex justify-center text-[60px] w-full h-full items-center px-3 z-10 font-symbols glow-text-black">
                {activeCard === "automata"
                  ? "n"
                  : activeCard === "minion"
                  ? "m"
                  : "s"}
              </div>
            </div>
          </div>
        </div>
      </div>
      {Button}
      <ReactHowler
        src={
          assets.audio[
            activeCard === "automata"
              ? "automataShort"
              : activeCard === "minion"
              ? "alchemistShort"
              : "automataShor"
          ]
        }
        playing={enableSound}
        preload={true}
      />
      <>
        <ToggleLeft
          minimize={2}
          handleClick={() => {
            setActiveMyth((prev) => (prev - 1 + 4) % 4);
          }}
          activeMyth={activeMyth}
        />
        <ToggleRight
          minimize={2}
          handleClick={() => {
            setActiveMyth((prev) => (prev + 1) % 4);
          }}
          activeMyth={activeMyth}
        />
      </>
    </div>
  );
};

export default BoosterClaim;
