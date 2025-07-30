import { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../../../context/context";
import { mythSymbols } from "../../../utils/constants.fof";
import { formatRankOrbs } from "../../../helpers/leaderboard.helper";
import OverlayLayout from "../../Layouts/OverlayLayout";

const OrbInfoCard = ({ gameData }) => {
  const { assets } = useContext(MainContext);
  const elementalOrbs = gameData.mythologies.reduce(
    (sum, itm) => sum + itm.orbs,
    0
  );
  const myths = ["greek", "celtic", "norse", "egyptian"];
  const [activeColor, setActiveColor] = useState(0);
  const activeColorRef = useRef(activeColor);
  const updatedOrbs =
    1000 * gameData.blackOrbs + 2 * gameData.multiColorOrbs + elementalOrbs;

  activeColorRef.current = activeColor;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColor((prev) => (prev + 1) % myths.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [myths.length]);

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
            <h1>ORB(S)</h1>

            <h2 className={`-mt-[1.5vh] text-paperSub font-medium uppercase`}>
              {formatRankOrbs(updatedOrbs)}
            </h2>
          </div>

          <div
            className={`absolute leading-[18px] text-paperSub text-card inset-0 w-[85%] mx-auto flex gap-[1.5dvh]  flex-col justify-start pt-[32%] font-[550] z-30 `}
          >
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
                    {gameData.blackOrbs}
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
                    {gameData.multiColorOrbs}
                  </div>
                </div>
                {gameData.mythologies.slice(0, 1).map((myth, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div
                      className={`flex relative text-center justify-center max-w-xs-orb items-center rounded-full glow-icon-${myth.name.toLowerCase()}`}
                    >
                      <img
                        src={assets.uxui.baseOrb}
                        alt="orb"
                        className={`filter-orbs-${myth.name.toLowerCase()}`}
                      />
                      <span
                        className={`absolute opacity-50 orb-symbol-shadow text-white z-1 font-symbols  text-symbol-xs mt-1 transition-all duration-1000`}
                      >
                        <>{mythSymbols[myth.name.toLowerCase()]}</>
                      </span>
                    </div>
                    <div
                      className={`font-fof text-paperHead font-medium transition-all duration-1000 text-card`}
                    >
                      {myth.orbs}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-[2.25dvh] w-full">
                {gameData.mythologies.slice(1, 4).map((myth, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div
                      className={`flex relative text-center justify-center max-w-xs-orb items-center rounded-full glow-icon-${myth.name.toLowerCase()}`}
                    >
                      <img
                        src={assets.uxui.baseOrb}
                        alt="orb"
                        className={`filter-orbs-${myth.name.toLowerCase()}`}
                      />
                      <span
                        className={`absolute opacity-50 orb-symbol-shadow text-white z-1 font-symbols  text-symbol-xs mt-1 transition-all duration-1000`}
                      >
                        <>{mythSymbols[myth.name.toLowerCase()]}</>
                      </span>
                    </div>
                    <div
                      className={`font-fof text-paperHead font-medium transition-all duration-1000 text-card`}
                    >
                      {myth.orbs}
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

export default OrbInfoCard;
