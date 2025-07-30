import React, { useContext, useEffect } from "react";
import { FofContext } from "../../../context/context";
import { mythSymbols } from "../../../utils/constants.fof";
import { countries } from "../../../utils/country";
import { formatRankOrbs } from "../../../helpers/leaderboard.helper";
import OverlayLayout from "../../Layouts/OverlayLayout";

const UserInfoCard = ({ close, userData }) => {
  const { assets } = useContext(FofContext);
  const countryFlag = countries.find((item) => item.code == userData.country);

  return (
    <OverlayLayout>
      <div className="center-section">
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
            <h2 className={`-mt-[1dvh] text-paperSub font-medium uppercase`}>
              {countryFlag.flag}
            </h2>
          </div>
          <div
            className={`absolute leading-[18px] text-paperSub text-card inset-0 w-[85%] mx-auto flex gap-[1.5dvh]  flex-col justify-start pt-[32%] font-[550] z-30 `}
          >
            <h2 className={` text-paperSub font-medium uppercase`}>
              ORB(S): {formatRankOrbs(userData.totalOrbs)}
            </h2>
            <div className={`flex w-full`}>
              <div className="flex flex-col gap-[2.5dvh] w-full">
                <div className="flex gap-2 items-center">
                  <div
                    className={`flex relative text-center overflow-hidden justify-center max-w-xs-orb items-center rounded-full glow-icon-black`}
                  >
                    <img
                      src={assets.uxui.baseOrb}
                      alt="orb"
                      className={`filter-orbs-black`}
                    />
                    <span
                      className={`absolute opacity-50 orb-symbol-shadow text-white z-1 font-symbols  text-symbol-xs mt-1 transition-all duration-1000`}
                    >
                      <>{mythSymbols["other"]}</>
                    </span>
                  </div>
                  <div
                    className={`font-fof text-paperHead font-medium transition-all duration-1000 text-card`}
                  >
                    {userData.gameData.blackOrbs}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div
                    className={`flex relative text-center justify-center items-center max-w-xs-multi-orb -mt-1 rounded-full glow-icon-black`}
                  >
                    <img src={assets.items.multiorb} alt="multi orb" />
                  </div>
                  <div
                    className={`font-fof text-paperHead font-medium transition-all duration-1000 text-card`}
                  >
                    {userData.gameData.multiColorOrbs}
                  </div>
                </div>
                {Object.entries(userData.gameData)
                  .filter(
                    ([key]) => key !== "blackOrbs" && key !== "multiColorOrbs"
                  ) // filter orb extras
                  .slice(0, 1)
                  .map(([key, value], index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div
                        className={`flex relative text-center justify-center max-w-xs-orb items-center rounded-full glow-icon-${key.toLowerCase()}`}
                      >
                        <img
                          src={assets.uxui.baseOrb}
                          alt="orb"
                          className={`filter-orbs-${key.toLowerCase()}`}
                        />
                        <span
                          className={`absolute opacity-50 orb-symbol-shadow text-white z-1 font-symbols text-symbol-xs mt-1 transition-all duration-1000`}
                        >
                          {mythSymbols[key.toLowerCase()]}
                        </span>
                      </div>
                      <div className="font-fof text-paperHead font-medium transition-all duration-1000 text-card">
                        {value}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col gap-[2.25dvh] w-full">
                {Object.entries(userData.gameData)
                  .filter(
                    ([key]) => key !== "blackOrbs" && key !== "multiColorOrbs"
                  )
                  .slice(1, 4)
                  .map(([key, value], index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div
                        className={`flex relative text-center justify-center max-w-xs-orb items-center rounded-full glow-icon-${key.toLowerCase()}`}
                      >
                        <img
                          src={assets.uxui.baseOrb}
                          alt="orb"
                          className={`filter-orbs-${key.toLowerCase()}`}
                        />
                        <span
                          className={`absolute opacity-50 orb-symbol-shadow text-white z-1 font-symbols text-symbol-xs mt-1 transition-all duration-1000`}
                        >
                          {mythSymbols[key.toLowerCase()]}
                        </span>
                      </div>
                      <div className="font-fof text-paperHead font-medium transition-all duration-1000 text-card">
                        {value}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OverlayLayout>
  );
};

export default UserInfoCard;

// ${
//     (i18n.language === "hi" ||
//       i18n.language === "th" ||
//       i18n.language === "ru") &&
//     "font-normal"
//   }
