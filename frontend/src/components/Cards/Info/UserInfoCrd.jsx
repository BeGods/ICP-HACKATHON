import React, { useContext } from "react";
import { FofContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { mythSymbols } from "../../../utils/constants.fof";
import { countries } from "../../../utils/country";

const UserInfoCard = ({ close, userData }) => {
  const { assets, isTelegram } = useContext(FofContext);
  const countryFlag = countries.find((item) => item.code == userData.country);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="relative w-[72%] rounded-lg shadow-lg card-shadow-white">
        <div className="relative w-full h-full text-card">
          <img
            src={assets.uxui.info}
            alt="info card background"
            className="w-full h-full object-cover rounded-primary z-10"
          />
        </div>
        <div className="absolute top-0 w-full text-center text-card text-paperHead font-bold mt-2 uppercase z-30">
          <h1>{userData.username.charAt(0).toUpperCase()[0].slice(0, 11)}</h1>
          <h2 className={`-mt-[2vh] text-paperSub font-medium uppercase`}>
            #{userData.overallRank}{" "}
            {userData.country != "NA" &&
              `| ${countryFlag.flag} ${userData.countryRank}`}
          </h2>
        </div>

        <div
          className={`absolute leading-[18px] text-paperSub text-card inset-0 w-[85%] mx-auto flex gap-6 justify-start pt-[32%] font-[550] z-30 `}
        >
          <div className="flex flex-col gap-[6vw] w-full">
            <div className="flex gap-2 items-center">
              <div
                className={`flex relative text-center justify-center items-center max-w-orb -mt-1 rounded-full glow-icon-black`}
              >
                <img src={assets.uxui.multiorb} alt="multi orb" />
              </div>
              <div
                className={`font-fof text-[28px] font-medium transition-all duration-1000 text-card`}
              >
                {userData.gameData.multiColorOrbs}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div
                className={`flex relative text-center overflow-hidden justify-center max-w-orb items-center rounded-full glow-icon-black`}
              >
                <img
                  src={assets.uxui.baseorb}
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
                {userData.gameData.blackOrbs}
              </div>
            </div>
            {Object.entries(userData.gameData)
              .slice(0, 2)
              .map(([key, value], index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div
                    className={`flex relative text-center justify-center max-w-orb items-center rounded-full glow-icon-${key}`}
                  >
                    <img
                      src={assets.uxui.baseorb}
                      alt="orb"
                      className={`filter-orbs-${key}`}
                    />
                    <span
                      className={`absolute opacity-50 orb-symbol-shadow text-white z-1 font-symbols  text-symbol-sm mt-1 transition-all duration-1000`}
                    >
                      <>{mythSymbols[key]}</>
                    </span>
                  </div>
                  <div
                    className={`font-fof text-[28px] font-medium transition-all duration-1000 text-card`}
                  >
                    {value}
                  </div>
                </div>
              ))}
          </div>
          <div className="flex flex-col gap-[6vw] w-full">
            {Object.entries(userData.gameData)
              .slice(2, 4)
              .map(([key, value], index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div
                    className={`flex relative text-center justify-center max-w-orb items-center rounded-full glow-icon-${key}`}
                  >
                    <img
                      src={assets.uxui.baseorb}
                      alt="orb"
                      className={`filter-orbs-${key}`}
                    />
                    <span
                      className={`absolute opacity-50 orb-symbol-shadow text-white z-1 font-symbols  text-symbol-sm mt-1 transition-all duration-1000`}
                    >
                      <>{mythSymbols[key]}</>
                    </span>
                  </div>
                  <div
                    className={`font-fof text-[28px] font-medium transition-all duration-1000 text-card`}
                  >
                    {value}
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

export default UserInfoCard;

// ${
//     (i18n.language === "hi" ||
//       i18n.language === "th" ||
//       i18n.language === "ru") &&
//     "font-normal"
//   }
