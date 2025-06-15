import React, { useContext } from "react";
import PropTypes from "prop-types";
import { MainContext } from "../../../context/context";
import { mythSymbols } from "../../../utils/constants.fof";
import IconBtn from "../../Buttons/IconBtn";
import { countries } from "../../../utils/country";

const OrbInfoCard = ({ gameData, close }) => {
  const { assets, userData } = useContext(MainContext);
  const countryFlag = countries.find((item) => item.code == userData.country);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div
        className={`relative card-width rounded-lg shadow-lg card-shadow-white`}
      >
        <div className="relative w-full h-full text-card">
          <img
            src={assets.uxui.bgInfo}
            alt="info card background"
            className="w-full h-full object-cover rounded-primary z-10"
          />
        </div>
        <div className="absolute top-0 w-full text-center text-card text-paperHead font-bold mt-2 uppercase z-30">
          <h1>{userData.username.toUpperCase().slice(0, 11)}</h1>

          <h2 className={`-mt-[2vh] text-paperSub font-medium uppercase`}>
            #{userData.orbRank ?? 0}{" "}
            {userData.country != "NA" &&
              `| ${countryFlag.flag} ${userData.countryRank}`}
          </h2>
        </div>

        <div
          className={`absolute leading-[18px] text-paperSub text-card inset-0 w-[85%] mx-auto flex gap-6 justify-start pt-[32%] font-[550] z-30 `}
        >
          <div className="flex flex-col gap-[2rem] w-full">
            <div className="flex gap-2 items-center">
              <div
                className={`flex relative text-center justify-center items-center max-w-orb -mt-1 rounded-full glow-icon-black`}
              >
                <img src={assets.items.multiorb} alt="multi orb" />
              </div>
              <div
                className={`font-fof text-[28px] font-medium transition-all duration-1000 text-card`}
              >
                {gameData.multiColorOrbs}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div
                className={`flex relative text-center overflow-hidden justify-center max-w-orb items-center rounded-full glow-icon-black`}
              >
                <img
                  src={assets.uxui.baseOrb}
                  alt="orb"
                  className={`filter-orbs-black`}
                />
                <span
                  className={`absolute opacity-50 orb-symbol-shadow text-white z-1 font-symbols  text-symbol-sm mt-1 transition-all duration-1000`}
                >
                  <>{mythSymbols["other"]}</>
                </span>
              </div>
              <div
                className={`font-fof text-[28px] font-medium transition-all duration-1000 text-card`}
              >
                {gameData.blackOrbs}
              </div>
            </div>
            {gameData.mythologies.slice(0, 2).map((myth, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div
                  className={`flex relative text-center justify-center max-w-orb items-center rounded-full glow-icon-${myth.name.toLowerCase()}`}
                >
                  <img
                    src={assets.uxui.baseOrb}
                    alt="orb"
                    className={`filter-orbs-${myth.name.toLowerCase()}`}
                  />
                  <span
                    className={`absolute opacity-50 orb-symbol-shadow text-white z-1 font-symbols  text-symbol-sm mt-1 transition-all duration-1000`}
                  >
                    <>{mythSymbols[myth.name.toLowerCase()]}</>
                  </span>
                </div>
                <div
                  className={`font-fof text-[28px] font-medium transition-all duration-1000 text-card`}
                >
                  {myth.orbs}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[6vw] w-full">
            {gameData.mythologies.slice(2, 4).map((myth, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div
                  className={`flex relative text-center justify-center max-w-orb items-center rounded-full glow-icon-${myth.name.toLowerCase()}`}
                >
                  <img
                    src={assets.uxui.baseOrb}
                    alt="orb"
                    className={`filter-orbs-${myth.name.toLowerCase()}`}
                  />
                  <span
                    className={`absolute opacity-50 orb-symbol-shadow text-white z-1 font-symbols  text-symbol-sm mt-1 transition-all duration-1000`}
                  >
                    <>{mythSymbols[myth.name.toLowerCase()]}</>
                  </span>
                </div>
                <div
                  className={`font-fof text-[28px] font-medium transition-all duration-1000 text-card`}
                >
                  {myth.orbs}
                </div>
              </div>
            ))}
          </div>
        </div>

        <IconBtn isInfo={false} activeMyth={4} handleClick={close} align={1} />
      </div>
    </div>
  );
};

export default OrbInfoCard;
