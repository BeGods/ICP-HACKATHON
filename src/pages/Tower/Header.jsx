import { useContext, useEffect, useState } from "react";
import { mythSections, mythSymbols, wheel } from "../../utils/constants";
import { MyContext } from "../../context/context";
import MoonInfoCard from "../../components/Cards/Info/MoonInfoCrd";
import { getPhaseByDate } from "../../helpers/game.helper";
import { useTranslation } from "react-i18next";
import { formatThreeNums } from "../../helpers/leaderboard.helper";

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
      className="flex absolute top-0 justify-center w-full -mt-1"
    >
      {myth !== 0 ? (
        <div
          className={`z-20 flex text-center glow-icon-${wheel[myth]} justify-center h-symbol-primary w-symbol-primary mt-0.5 items-center rounded-full outline outline-[0.5px]  outline-${wheel[myth]}-primary transition-all duration-1000  overflow-hidden relative`}
        >
          <img
            src={`${assets.uxui.baseorb}`}
            alt="base-orb"
            className={`filter-orbs-${wheel[myth]} w-full h-full`}
          />
          <span
            className={`absolute text-black-icon-contour font-symbols opacity-100 text-white text-[26vw] ${
              platform === "ios" ? "mt-8 ml-2" : "mt-5 ml-2"
            } opacity-70  orb-symbol-shadow`}
          >
            {mythSymbols[wheel[myth]]}
          </span>
        </div>
      ) : (
        <div className={`z-20 glow-icon-white`}>
          <div className="moon-phases">
            <div className="moon">
              <div
                className={`absolute z-10 h-full w-full overflow-hidden rounded-full y`}
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

const BottomChild = ({ gameData, sessionOrbs, myth, showGlow }) => {
  const { assets } = useContext(MyContext);
  return (
    <div className="flex relative justify-center px-2 -mt-3">
      <div className="flex w-full px-7">
        <div
          className={`flex border  ${
            myth === 0 || showGlow
              ? `glow-button-white border-white`
              : `glow-button-${mythSections[myth - 1]} border-${
                  mythSections[myth - 1]
                }-primary`
          }  gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className={`text-primary font-medium pl-headSides`}>
            {" "}
            {myth !== 0 ? (
              <>
                {formatThreeNums(
                  gameData?.mythologies[myth - 1]?.orbs - sessionOrbs * 2
                )}
              </>
            ) : (
              <>{formatThreeNums(gameData.blackOrbs)}</>
            )}
          </div>
        </div>
        <div
          className={`flex justify-end ${
            showGlow && "glow-button-white"
          } primary gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="text-primary font-medium pr-headSides">
            {" "}
            {formatThreeNums(gameData.multiColorOrbs)}
          </div>
        </div>
      </div>
      <div className="flex text-white justify-between absolute w-[98%] top-0 -mt-4">
        {myth !== 0 ? (
          <>
            <div
              className={`font-symbols  text-iconLg mt-0.5  text-black-lg-contour transition-all duration-1000 text-${wheel[myth]}-text`}
            >
              {mythSymbols[wheel[myth]]}
            </div>
          </>
        ) : (
          <>
            {" "}
            <div
              className={`font-symbols  mt-0.5 text-iconLg text-black-lg-contour transition-all duration-1000 text-white`}
            >
              {mythSymbols["other"]}
            </div>
          </>
        )}
        <div
          className={`flex relative text-center justify-center items-center w-[15.4vw] h-[15.4vw] mt-[17px]  rounded-full`}
        >
          <img
            src={`${assets.uxui.multiorb}`}
            alt="multiOrb"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

const TowerHeader = ({ gameData, myth, sessionOrbs, showGlow }) => {
  const { platform } = useContext(MyContext);
  const [changeText, setChangeText] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-[5px] pt-[3.5vh]">
        <div
          className={`text-sectionHead ${
            changeText
              ? `text-white text-black-lg-contour`
              : `text-black text-white-lg-contour`
          } -mt-2.5 text-center top-0  uppercase absolute inset-0 w-fit h-fit z-30 mx-auto`}
        >
          {changeText ? t("sections.tower") : t("mythologies.dark")}
        </div>
        <BottomChild
          showGlow={showGlow}
          gameData={gameData}
          myth={myth}
          sessionOrbs={sessionOrbs}
        />
        <CenterChild platform={platform} myth={myth} />
      </div>
    </div>
  );
};

export default TowerHeader;
