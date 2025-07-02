import { useContext, useEffect, useRef, useState } from "react";
import { mythSections, mythSymbols, wheel } from "../../../utils/constants.fof";
import { FofContext } from "../../../context/context";
import MoonInfoCard from "../../../components/Cards/Info/MoonInfoCrd";
import { getPhaseByDate } from "../../../helpers/game.helper";
import { useTranslation } from "react-i18next";
import { formatThreeNums } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import IconBtn from "../../../components/Buttons/IconBtn";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ platform, myth, showInfo, handleInfoClk }) => {
  const { setShowCard, assets, enableHaptic } = useContext(FofContext);
  const currPhase = getPhaseByDate(new Date());
  const moonPhase = useRef(currPhase);
  const [showEffect, setShowEffect] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowEffect(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`flex cursor-pointer absolute justify-center w-full  z-[60] top-0`}
    >
      {myth !== 0 ? (
        <div
          className={`z-20 flex text-center glow-icon-${wheel[myth]} justify-center h-symbol-primary w-symbol-primary mt-0.5 items-center rounded-full outline outline-[0.5px]  outline-${wheel[myth]}-primary transition-all duration-1000  overflow-hidden relative`}
        >
          <img
            src={`${assets.uxui.baseOrb}`}
            alt="base-orb"
            className={`filter-orbs-${wheel[myth]} w-full h-full`}
          />
          <span
            className={`absolute text-black-icon-contour font-symbols opacity-100 text-white text-[5rem] ${
              platform === "ios" ? "mt-14" : "mt-9"
            } opacity-70  orb-symbol-shadow`}
          >
            {mythSymbols[wheel[myth]]}
          </span>
        </div>
      ) : (
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            handleInfoClk();
          }}
          className={`z-20 glow-icon-white transition-all duration-500`}
        >
          <div className={`moon-phases`}>
            <div className={`moon`}>
              <div
                className={`absolute z-10 h-full w-full overflow-hidden rounded-full y`}
              >
                <div
                  style={{ height: `100%` }}
                  className={`absolute bottom-0 opacity-35 w-full transition-all duration-500 phase phase-${moonPhase.current} z-10`}
                ></div>
              </div>
              <img
                src={`${assets.uxui.baseOrb}`}
                alt="moon-phase"
                className={`moon-base`}
              />
              <span
                className={`absolute z-1 font-symbols text-white-icon-contour  text-black/90 text-[5rem] ${
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
  const { assets, activeMyth } = useContext(FofContext);
  const { t } = useTranslation();
  return (
    <div className="flex w-full justify-center px-2 mt-3 top-0 absolute">
      <div className="flex relative w-full max-w-[720px] px-7">
        <div
          className={`flex relative justify-start ${
            showGlow && "glow-button-white"
          } primary gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black-lg border w-full`}
        >
          <div
            className={`flex absolute text-center justify-center items-center w-[3.15rem] h-[3.15rem] -ml-[2rem] glow-orb-black rounded-full`}
          >
            <img
              src={`${assets.items.multiorb}`}
              alt="multiOrb"
              className="w-full h-full"
            />
          </div>
          <div className="text-primary text-black-contour font-medium pl-headSides">
            {" "}
            {formatThreeNums(gameData.multiColorOrbs)}
          </div>
        </div>
        <div
          className={`flex relative border justify-end ${` border-${
            mythSections[myth - 1]
          }-primary`}  gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black-lg border w-full`}
        >
          <div
            className={`text-primary text-black-contour font-medium pr-headSides`}
          >
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
          <div className="absolute -mr-[2rem]">
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
                  className={`font-symbols  mt-0.5 text-[3rem] text-black-lg-contour transition-all duration-1000 text-white`}
                >
                  {mythSymbols["other"]}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="absolute flex text-white  px-1 w-full mt-[4.5rem] font-fof text-tertiary uppercase">
        <div className={`mr-auto slide-in-out-left gradient-multi`}>
          {t(`keywords.orbs`)}
        </div>
        <div className={`ml-auto slide-in-out-right font-bold text-black`}>
          {t(`keywords.orbs`)}
        </div>
      </div>
    </div>
  );
};

const TowerHeader = ({
  gameData,
  myth,
  sessionOrbs,
  showGlow,
  showInfo,
  handleInfoClk,
}) => {
  const { platform } = useContext(FofContext);
  const [changeText, setChangeText] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-[5px] pt-headTop">
        {/* <div
          className={`text-sectionHead ${
            changeText
              ? `text-white text-black-lg-contour`
              : `text-black text-white-lg-contour`
          } -mt-2.5 text-center top-0  uppercase absolute inset-0 z-[90] w-fit h-fit mx-auto`}
        >
          {changeText ? t("sections.tower") : t("mythologies.dark")}
        </div> */}
        <BottomChild
          showGlow={showGlow}
          gameData={gameData}
          myth={myth}
          sessionOrbs={sessionOrbs}
        />
        <CenterChild
          platform={platform}
          myth={myth}
          showInfo={showInfo}
          handleInfoClk={handleInfoClk}
        />
      </div>
    </div>
  );
};

export default TowerHeader;
