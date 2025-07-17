import { useContext, useRef } from "react";
import { mythSymbols, wheel } from "../../../utils/constants.fof";
import { FofContext, MainContext } from "../../../context/context";
import { getPhaseByDate } from "../../../helpers/game.helper";
import { useTranslation } from "react-i18next";
import { formatThreeNums } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import HeaderLayout, {
  HeadbarLayout,
} from "../../../components/Layouts/HeaderLayout";
import ConvertInfo from "../../../components/Cards/Info/ConvertInfoCrd";
import MoonInfoCard from "../../../components/Cards/Info/MoonInfoCrd";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ platform, myth }) => {
  const { assets, enableHaptic, setShowCard } = useContext(FofContext);
  const currPhase = getPhaseByDate(new Date());
  const moonPhase = useRef(currPhase);

  return (
    <div
      className={`flex cursor-pointer absolute justify-center mx-auto top-0 w-full -mt-2 z-50`}
    >
      {myth !== 0 ? (
        <div
          className={`z-20 flex text-center glow-icon-${wheel[myth]} justify-center h-symbol-primary w-symbol-primary items-center rounded-full outline outline-[0.5px]  outline-${wheel[myth]}-primary transition-all duration-1000  overflow-hidden relative`}
        >
          <img
            src={`${assets.uxui.baseOrb}`}
            alt="base-orb"
            className={`filter-orbs-${wheel[myth]} w-full h-full`}
          />
          <span
            className={`absolute text-black-icon-contour font-symbols opacity-100 text-white text-element-md ${
              platform === "ios" ? "mt-13" : "mt-8"
            } opacity-70  orb-symbol-shadow`}
          >
            {mythSymbols[wheel[myth]]}
          </span>
        </div>
      ) : (
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            setShowCard(<MoonInfoCard />);
          }}
          className={`z-20 glow-icon-white transition-all duration-500`}
        >
          <div className={`moon-phases`}>
            <div className={`moon`}>
              <div
                className={`absolute z-10 h-full w-full overflow-hidden rounded-full`}
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
                className={`absolute z-1 font-symbols text-white-icon-contour  text-black/90 text-element-md mt-5 ml-1 orb-symbol-shadow z-50`}
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

const BottomChild = ({ gameData, sessionOrbs, myth }) => {
  const { assets, setSection, setShowCard } = useContext(MainContext);
  const { t } = useTranslation();

  const data = [
    {
      icon: (
        <img
          src={`${assets.items.multiorb}`}
          alt="multiOrb"
          className="w-[3.15rem] h-[3.15rem]  glow-orb-black rounded-full"
        />
      ),
      value: formatThreeNums(gameData.multiColorOrbs),
      label: t(`keywords.orbs`),
      borderColor: "white",
      handleClick: () => {
        setSection(2);
      },
    },
    {
      icon:
        myth !== 0 ? (
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
        ),
      value:
        myth !== 0 ? (
          <>
            {formatThreeNums(
              gameData?.mythologies[myth - 1]?.orbs - sessionOrbs * 2
            )}
          </>
        ) : (
          <>{formatThreeNums(gameData.blackOrbs)}</>
        ),
      label: t(`keywords.orbs`),
      handleClick: () => {
        setShowCard(
          <ConvertInfo
            handleClick={() => {
              setShowCard(null);
            }}
          />
        );
      },
    },
  ];

  return <HeadbarLayout activeMyth={myth - 1} data={data} />;
};

const TowerHeader = ({ gameData, myth, sessionOrbs, showGlow, showInfo }) => {
  const { t } = useTranslation();
  const { platform } = useContext(FofContext);

  return (
    <HeaderLayout
      activeMyth={8}
      titleColor="black"
      hideContour={true}
      title={t(`elements.aether`)}
      BottomChild={
        <BottomChild
          showGlow={showGlow}
          gameData={gameData}
          myth={myth}
          sessionOrbs={sessionOrbs}
        />
      }
      CenterChild={
        <CenterChild platform={platform} myth={myth} showInfo={showInfo} />
      }
    />
  );
};

export default TowerHeader;
