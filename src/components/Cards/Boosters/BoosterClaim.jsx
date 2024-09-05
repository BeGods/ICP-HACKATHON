import React from "react";
import { mythSections } from "../../../utils/variables";
import IconButton from "../../Buttons/IconButton";
import ReactHowler from "react-howler";

const BoosterClaim = ({
  activeCard,
  activeMyth,
  Button,
  closeCard,
  mythData,
}) => {
  return (
    <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
      <div className="relative w-[72%] h-[55%] mt-[70px]  flex items-center justify-center rounded-primary card-shadow-white">
        <div className="absolute z-10  top-0 left-0">
          Lvl{" "}
          {activeCard === "automata"
            ? mythData.automatalvl
            : mythData.shardslvl}
        </div>

        <div
          className={`absolute inset-0 rounded-[15px]`}
          style={{
            backgroundImage: `url(/assets/cards/320px-${
              activeCard === "automata" ? "automata" : "minion"
            }.jpg)`,
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
            <div
              className={`flex relative  mt-auto items-center h-[19%] w-full card-shadow-white-celtic text-white`}
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
                className={`rounded-b-primary filter-paper-${mythSections[activeMyth]}`}
              />
              <div className="flex justify-center  text-[80px] w-full h-full items-center px-3 z-10 font-symbols glow-text-black">
                {activeCard === "automata" ? "b" : "h"}
              </div>
            </div>
          </div>
        </div>
      </div>
      {Button}
      <ReactHowler
        src={`/assets/audio/fof.${
          activeCard === "automata" ? "automata" : "minion"
        }.wav`}
        playing={!JSON.parse(localStorage.getItem("sound"))}
        preload={true}
      />
    </div>
  );
};

export default BoosterClaim;
