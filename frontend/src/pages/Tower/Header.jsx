import { useContext, useEffect, useState } from "react";
import { mythSections, mythSymbols, wheel } from "../../utils/constants";
import { MyContext } from "../../context/context";
import Header from "../../components/Common/Header";
import MoonInfoCard from "../../components/Cards/Info/MoonInfoCrd";
import { getPhaseByDate } from "../../helpers/game.helper";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ platform, myth }) => {
  const { setShowCard, assets } = useContext(MyContext);

  return (
    <div
      onClick={() => {
        tele.HapticFeedback.notificationOccurred("success");
        setShowCard(
          <MoonInfoCard
            handleClick={() => {
              setShowCard(null);
            }}
          />
        );
      }}
      className="flex absolute justify-center w-full mt-1"
    >
      {myth !== 0 ? (
        <div
          className={`z-20 flex text-center glow-icon-${wheel[myth]} justify-center h-[36vw] w-[36vw] mt-0.5 items-center rounded-full outline outline-[0.5px]  outline-${wheel[myth]}-primary transition-all duration-1000  overflow-hidden relative`}
        >
          <img
            src={`${assets.uxui.baseorb}`}
            alt="base-orb"
            className={`filter-orbs-${wheel[myth]} w-full h-full`}
          />
          <span
            className={`absolute tex-black-icon-contour z-1 font-symbols opacity-100 text-white text-[28vw] ${
              platform === "ios" ? "mt-8 ml-2" : "mt-8 ml-2"
            } opacity-50  orb-symbol-shadow`}
          >
            {mythSymbols[wheel[myth]]}
          </span>
        </div>
      ) : (
        <div className={`z-20 glow-icon-white`}>
          <div className="moon-phases">
            <div className="moon">
              <div
                className={`absolute z-10 h-full w-[36vw] overflow-hidden rounded-full y`}
              >
                <div
                  style={{ height: `100%` }}
                  className={`absolute bottom-0 opacity-35 w-full transition-all duration-500 phase phase-${getPhaseByDate(
                    new Date()
                  )} z-10`}
                ></div>
              </div>
              <img
                src={`${assets.uxui.baseorb}`}
                alt="moon-phase"
                className="moon-base"
              />
              <span
                className={`absolute z-1 font-symbols text-white-icon-contour  text-black/90 text-[28vw] ${
                  platform === "ios" ? "mt-8 ml-2" : "mt-8 ml-2"
                } orb-symbol-shadow z-50`}
              >
                {mythSymbols["other"]}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TopChild = ({ myth }) => {
  const { assets } = useContext(MyContext);
  return (
    <div className="absolute flex w-full justify-between top-0 z-50">
      <div className="ml-[8vw]">
        {myth !== 0 ? (
          <>
            <div
              className={`font-symbols text-black-md-contour text-[12vw] mt-0.5 transition-all duration-1000 text-${wheel[myth]}-text`}
            >
              {mythSymbols[wheel[myth]]}
            </div>
          </>
        ) : (
          <>
            {" "}
            <div
              className={`font-symbols  text-black-md-contour mt-0.5 text-[12vw] text-black-contour transition-all duration-1000 text-white`}
            >
              {mythSymbols["other"]}
            </div>
          </>
        )}
      </div>
      <div className="flex relative text-center justify-center items-center w-[11vw] h-[11vw] mt-[14px] glow-icon-white mr-[8vw] rounded-full">
        <img
          src={`${assets.uxui.multiorb}`}
          alt="multiOrb"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

const BottomChild = ({ gameData, sessionOrbs, myth, showGlow }) => {
  return (
    <div className="flex bar-flipped justify-center -mt-[4vh] px-7">
      <div
        className={`flex  ${
          myth === 0 || showGlow
            ? `glow-button-white border-white`
            : `glow-button-${mythSections[myth - 1]} border-${
                mythSections[myth - 1]
              }-primary`
        } text-num pl-[18px] text-black-lg-contour transition-all duration-1000 text-white items-center border justify-start h-button-primary w-full bg-black z-10 rounded-primary transform skew-x-[18deg]`}
      >
        {myth !== 0 ? (
          <>{gameData?.mythologies[myth - 1]?.orbs - sessionOrbs * 2}</>
        ) : (
          <>{gameData.blackOrbs}</>
        )}
      </div>
      <div
        className={`flex ${
          showGlow && "glow-button-white"
        } text-num pr-[18px] text-black-lg-contour transition-all duration-1000 text-white items-center border justify-end h-button-primary w-full bg-black z-10 rounded-primary transform -skew-x-[18deg]`}
      >
        {gameData.multiColorOrbs}
      </div>
    </div>
  );
};

const TowerHeader = ({ gameData, myth, sessionOrbs, showGlow }) => {
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    const teleConfi = async () => {
      if (tele) {
        await tele.ready();
        setPlatform(tele.platform);
      }
    };
    teleConfi();
  }, []);

  return (
    <div className="z-[60]">
      <Header
        BottomChild={
          <BottomChild
            showGlow={showGlow}
            gameData={gameData}
            myth={myth}
            sessionOrbs={sessionOrbs}
          />
        }
        TopChild={<TopChild myth={myth} />}
        CenterChild={<CenterChild platform={platform} myth={myth} />}
      />
    </div>
  );
};

export default TowerHeader;
