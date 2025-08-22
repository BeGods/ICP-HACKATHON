import { useEffect, useState } from "react";
import { mythSections, mythSymbols } from "../../../utils/constants.fof";
import { useTranslation } from "react-i18next";
import { formatThreeNums } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import HeaderLayout, {
  HeadbarLayout,
} from "../../../components/Layouts/HeaderLayout";
import OrbInfoCard from "../../../components/Cards/Info/OrbInfoCard";
import { useStore } from "../../../store/useStore";

const tele = window.Telegram?.WebApp;

const CenterChild = ({
  tapGlow,
  glowReward,
  showBlackOrb,
  activeMyth,
  orbGlow,
  platform,
  mythData,
  height,
  starIsHeld,
  minimize,
}) => {
  const setSection = useStore((s) => s.setSection);
  const assets = useStore((s) => s.assets);
  const enableHaptic = useStore((s) => s.enableHaptic);

  return (
    <div className="flex cursor-pointer absolute justify-center w-full top-0 -mt-2 z-50">
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          setSection(4);
        }}
        className={`flex text-center justify-center h-symbol-primary w-symbol-primary overflow-hidden items-center rounded-full outline outline-${
          mythSections[activeMyth]
        }-primary transition-all duration-1000 ${
          orbGlow
            ? `glow-tap-${mythSections[activeMyth]} outline-[2px]`
            : `glow-icon-${mythSections[activeMyth]}`
        } ${tapGlow ? "scale-[110%] outline-[2px]" : ""} ${
          glowReward ? "scale-[110%] outline-[2px]" : ""
        }`}
      >
        <div
          className={`absolute h-symbol-primary w-symbol-primary overflow-hidden rounded-full outline outline-${mythSections[activeMyth]}-primary`}
        >
          <div
            style={{ height: `${height}%` }}
            className={`absolute bottom-0 opacity-35 w-full transition-all duration-500 bg-${mythSections[activeMyth]}-text z-10`}
          ></div>
        </div>
        <img
          src={assets.uxui.baseOrb}
          alt="base-orb"
          className={`filter-orbs-${mythSections[activeMyth]} w-full h-full`}
        />
        <div
          className={`z-1 flex justify-center items-start font-symbols ${
            mythData.disabled && "opacity-25"
          } ${
            glowReward
              ? `text-${mythSections[activeMyth]}-text`
              : showBlackOrb === 1
              ? "text-white"
              : "text-white"
          } text-element-md transition-all ${
            starIsHeld && "z-20"
          } duration-1000 myth-glow-greek text-black-icon-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
        >
          <div
            className={`${platform === "ios" ? "mt-[0.5rem]" : "mt-[0.75rem]"}`}
          >
            {mythSymbols[mythSections[activeMyth]]}
          </div>
        </div>
      </div>
      <div
        className={`text-tertiary opacity-50 absolute z-30 text-white-lg-contour font-semibold ${
          minimize == 1 && "rise-and-fade"
        } ${
          minimize == 2 && "drop-and-fade-in"
        } text-center top-0 text-black-lg-contour uppercase absolute inset-0 w-fit h-fit mx-auto`}
      >
        <h1 className="">
          {Math.floor(mythData.energy / 10)}
          <span className="text-tertiary font-bold">%</span>
        </h1>
      </div>
    </div>
  );
};

const BottomChild = ({
  shards,
  orbs,
  activeMyth,
  glowShards,
  glowBooster,
  glowSymbol,
  showTut,
  gameData,
}) => {
  const setSection = useStore((s) => s.setSection);
  const setShowCard = useStore((s) => s.setShowCard);

  const [showEffect, setShowEffect] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (glowShards) {
      setShowEffect(true);
      setTimeout(() => {
        setShowEffect(false);
      }, 1000);
    }
  }, [glowShards, showEffect]);

  const data = [
    {
      icon: (
        <div
          className={`font-symbols  ${showTut == 0 && "tut-shake"} ${
            glowShards && `scale-125`
          }   text-${
            mythSections[activeMyth]
          }-text transition-all duration-500`}
        >
          l
        </div>
      ),
      value: formatThreeNums(shards),
      label: t(`keywords.shards`),
      handleClick: () => {
        setShowCard(
          <OrbInfoCard
            gameData={gameData}
            close={() => {
              setShowCard(null);
            }}
          />
        );
      },
    },
    {
      icon: (
        <div
          className={`${(glowSymbol || glowBooster === 3) && `scale-125`} ${
            showTut == 1 && "tut-shake"
          } text-${mythSections[activeMyth]}-text transition-all duration-500`}
        >
          {mythSymbols[mythSections[activeMyth]]}
        </div>
      ),
      value: formatThreeNums(orbs),
      label: t(`keywords.orbs`),
      handleClick: () => {
        setSection(2);
      },
    },
  ];

  return <HeadbarLayout activeMyth={activeMyth} data={data} />;
};

const ForgeHeader = ({
  activeMyth,
  shards,
  orbs,
  orbGlow,
  tapGlow,
  glowReward,
  mythData,
  platform,
  showBlackOrb,
  glowShards,
  glowSymbol,
  glowBooster,
  minimize,
  showTut,
  starIsHeld,
  gameData,
}) => {
  const { t } = useTranslation();
  const height = Math.min(
    100,
    Math.max(0, (mythData.energy / mythData.energyLimit) * 100)
  );

  return (
    <HeaderLayout
      activeMyth={activeMyth}
      title={t("sections.forges")}
      BottomChild={
        <BottomChild
          shards={shards}
          orbs={orbs}
          activeMyth={activeMyth}
          glowShards={glowShards}
          showTut={showTut}
          glowBooster={glowBooster}
          glowSymbol={glowSymbol}
          minimize={minimize}
          gameData={gameData}
        />
      }
      CenterChild={
        <CenterChild
          starIsHeld={starIsHeld}
          tapGlow={tapGlow}
          height={height}
          glowReward={glowReward}
          showBlackOrb={showBlackOrb}
          orbGlow={orbGlow}
          platform={platform}
          activeMyth={activeMyth}
          mythData={mythData}
          minimize={minimize}
        />
      }
    />
  );
};

export default ForgeHeader;
