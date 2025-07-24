import { useContext, useRef, useState } from "react";
import { FofContext, MainContext } from "../../context/context";
import { mythSections } from "../../utils/constants.fof";
import ReactHowler from "react-howler";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { hasTimeElapsed } from "../../helpers/booster.helper";
import { useTranslation } from "react-i18next";
import "../../styles/flip.scss";

const tele = window.Telegram?.WebApp;

const BoosterAlert = () => {
  const { gameData, activeMyth } = useContext(FofContext);

  const boosterStatus = {
    automata: !gameData.mythologies[activeMyth].boosters.isAutomataActive,
    burst: gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim,
    minion: gameData.mythologies[activeMyth].boosters.isShardsClaimActive,
    moon: gameData.isMoonActive,
    multiAutomata: gameData?.isAutomataAutoActive === -1,
    multiBurst: hasTimeElapsed(gameData.autoPayBurstExpiry),
  };

  const boostersActiveCnt = Object.values(boosterStatus).filter(Boolean).length;

  return (
    <div
      className={`absolute gelatine right-0 flex justify-center items-center border-[1.5px] font-roboto text-tertiary font-medium bg-${mythSections[activeMyth]}-text w-[1.3rem] h-[1.3rem] text-white text-black-sm-contour mt-[0.5rem] z-50 mr-[0.25rem] rounded-full shadow-[0px_4px_15px_rgba(0,0,0,1)]`}
    >
      {boostersActiveCnt}
    </div>
  );
};

const FooterItem = ({ idx, avatarColor, itm, myth }) => {
  const howlerRef = useRef(null);
  const {
    section,
    setSection,
    setActiveMyth,
    assets,
    userData,
    enableHaptic,
    enableSound,
    game,
  } = useContext(MainContext);
  const [clickEffect, setClickEffect] = useState(false);

  const playAudio = () => {
    handleClickHaptic(tele, enableHaptic);

    if (howlerRef.current && enableSound) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  const handleSectionChange = (curr) => {
    setSection(curr);
    if (myth >= 4) {
      setActiveMyth(0);
    }
  };

  return (
    <>
      {idx < 3 ? (
        <div
          className={`flex ${
            clickEffect && "click-effect"
          }  relative -mb-[0.375rem] flex-col items-center cursor-pointer`}
          onClick={(e) => {
            e.preventDefault();
            playAudio();
            handleSectionChange(itm.redirect);
            setClickEffect(true);
            setTimeout(() => {
              setClickEffect(false);
            }, 500);
          }}
          style={{ minWidth: "60px" }}
        >
          <h1
            className={`font-symbols  text-iconLg  ${
              section === itm.redirect
                ? `${
                    myth < 4 && section !== 4
                      ? `glow-icon-${mythSections[myth]}`
                      : `glow-icon-white text-black-contour`
                  }`
                : `text-black-contour`
            }`}
          >
            {itm.icon}
          </h1>
          <h1 className="flex text-secondary justify-center -mt-[12px] pb-[6px] uppercase">
            {itm.label}
          </h1>
          {game == "fof" && idx === 2 && <BoosterAlert />}
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.preventDefault();
            playAudio();
            setClickEffect(true);
            setTimeout(() => {
              setClickEffect(false);
            }, 500);
            handleSectionChange(itm.redirect);
          }}
          className={`flex cursor-pointer relative ${
            clickEffect && "click-effect"
          } flex-col items-center mb-[2px]`}
        >
          {userData.avatarUrl ? (
            <div
              className="flex flex-col items-center cursor-pointer z-50 h-full transition-all duration-500"
              style={{ minWidth: "60px" }}
            >
              <img
                src={userData.avatarUrl}
                alt="profile-image"
                className={`w-circle-img transition-all duration-500 ${
                  section === itm.redirect && "glow-icon-white"
                } border border-black rounded-full w-[3.75rem] h-[3.75rem] pointer-events-none`}
              />
            </div>
          ) : (
            <>
              <div
                className={`flex relative text-center justify-center text-black-sm-contour items-center glow-icon-${avatarColor}`}
              >
                <img
                  src={assets.uxui.baseOrb}
                  alt="orb"
                  className={`filter-orbs-${avatarColor} overflow-hidden w-[3.75rem] h-[3.75rem] pointer-events-none`}
                />
                <span
                  className={`absolute z-1 text-black-sm-contour transition-all duration-1000  text-[2.25rem] mt-1 opacity-50`}
                >
                  {userData.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </>
          )}
          <h1 className="flex text-secondary  justify-center -mb-0.5 uppercase">
            {itm.label}
          </h1>
        </div>
      )}

      <div className="absolute z-0">
        <ReactHowler
          src={assets.audio.menu}
          playing={false}
          preload={true}
          ref={howlerRef}
          html5={true}
        />
      </div>
    </>
  );
};
const Footer = () => {
  const { t } = useTranslation();
  const { section, activeMyth, enableSound, minimize, assets, game } =
    useContext(MainContext);
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem("avatarColor");
  });

  const fofFooterMap = [
    {
      icon: "z",
      redirect: 0,
      label: t(`sections.forges`),
    },
    {
      icon: "x",
      redirect: 4,
      label: t(`sections.tower`),
    },
    {
      icon: "k",
      redirect: 2,
      label: t(`sections.boosters`),
    },
    {
      icon: "t",
      redirect: 3,
      label: t(`sections.profile`),
    },
  ];

  const rorFooterMap = [
    {
      icon: "5",
      redirect: 1,
      label: "explore",
    },
    {
      icon: `"`,
      redirect: 0,
      label: "citadel",
    },
    {
      icon: "8",
      redirect: 2,
      label: "bag",
    },
    {
      icon: "t",
      redirect: 8,
      label: t(`sections.profile`),
    },
  ];

  const isFoFFilteredSectn = section === 0 || section === 1 || section === 2;
  const footerMap = game === "fof" ? fofFooterMap : rorFooterMap;
  const myth = game === "fof" ? activeMyth : 5;

  return (
    <div
      className={`absolute flex justify-center w-screen h-[6rem] bottom-0  ${
        minimize === 2 && "maximize"
      } ${minimize === 1 && "minimize"}`}
    >
      <img
        src={assets.uxui.footer}
        alt="paper"
        draggable={false}
        className={`w-full select-none h-[6rem] absolute bottom-0 filter-paper-${
          isFoFFilteredSectn ? mythSections[myth] : null
        }`}
      />
      <div className="absolute footer-width flex justify-between items-end h-full text-white  w-full">
        {footerMap.map((item, index) => (
          <FooterItem
            key={index}
            enableSound={enableSound}
            idx={index}
            myth={myth}
            itm={item}
            avatarColor={avatarColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Footer;
