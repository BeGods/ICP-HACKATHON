import React, { useContext, useEffect, useRef, useState } from "react";
import { FofContext } from "../../context/context";
import { footerIcons, mythSections } from "../../utils/constants.fof";
import ReactHowler from "react-howler";
import "../../styles/flip.scss";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { useTranslation } from "react-i18next";
import { hasTimeElapsed } from "../../helpers/booster.helper";
import { getImage } from "../../utils/line";

const redirect = [0, 2, 4, 3];
const sectionTitles = ["forges", "boosters", "tower", "profile"];

const tele = window.Telegram?.WebApp;

const FooterItem = ({ enableSound, icon, avatarColor }) => {
  const howlerRef = useRef(null);
  const { t } = useTranslation();
  const {
    section,
    setSection,
    activeMyth,
    setActiveMyth,
    tasks,
    assets,
    userData,
    enableHaptic,
    gameData,
  } = useContext(FofContext);
  const countOfInCompleteQuests = tasks.filter(
    (item) => item.isQuestClaimed === false
  ).length;
  const [clickEffect, setClickEffect] = useState(false);
  const [showEffect, setShowEffect] = useState(true);

  const boosterStatus = {
    automata: !gameData.mythologies[activeMyth].boosters.isAutomataActive,
    burst: gameData.mythologies[activeMyth].boosters.isBurstActiveToClaim,
    minion: gameData.mythologies[activeMyth].boosters.isShardsClaimActive,
    moon: gameData.isMoonActive,
    multiAutomata: gameData?.isAutomataAutoActive === -1,
    multiBurst: hasTimeElapsed(gameData.autoPayBurstExpiry),
  };

  const boostersActiveCnt = Object.values(boosterStatus).filter(Boolean).length;

  const playAudio = () => {
    handleClickHaptic(tele, enableHaptic);

    if (howlerRef.current && enableSound) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  const handleSectionChange = (curr) => {
    setSection(curr);
    if (activeMyth >= 4) {
      setActiveMyth(0);
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowEffect(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {icon < 3 ? (
        <div
          className={`flex relative flex-col items-center cursor-pointer z-50`}
          onClick={(e) => {
            e.preventDefault();
            playAudio();
            handleSectionChange(redirect[icon]);
            setClickEffect(true);
            setTimeout(() => {
              setClickEffect(false);
            }, 500);
          }}
          style={{ minWidth: "60px" }}
        >
          <h1
            className={`font-symbols ${
              clickEffect && "click-effect"
            }  text-iconLg  ${
              section === redirect[icon]
                ? `${
                    activeMyth < 4 && section !== 4
                      ? `glow-icon-${mythSections[activeMyth]}`
                      : `glow-icon-white text-black-contour`
                  }`
                : `text-black-contour`
            }`}
          >
            {footerIcons[icon]}
          </h1>
          <h1 className="flex justify-center -mt-3 pb-[6px] uppercase">
            {t(`sections.${sectionTitles[icon]}`)}
          </h1>
          {icon === 1 && (
            <div
              className={`absolute ${
                showEffect && "pulse-text"
              } gelatine right-0 flex justify-center items-center border-[1.5px] font-roboto text-[1.2rem] font-medium bg-${
                mythSections[activeMyth]
              }-text text-white  h-7 w-7 text-black-sm-contour -mr-1 mt-[0.5rem] z-50 rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.7)]`}
            >
              {boostersActiveCnt}
            </div>
          )}
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
            handleSectionChange(icon);
          }}
          className={`flex cursor-pointer relative ${
            clickEffect && "click-effect"
          } flex-col items-center mb-2`}
        >
          {/* {icon === 3 && (
            <div
              className={`absolute ${
                showEffect && "pulse-text"
              } gelatine right-0 flex justify-center items-center border-[1.5px] font-roboto text-[1.2rem] font-medium bg-${
                mythSections[activeMyth]
              }-text text-white  h-7 w-7 text-black-sm-contour -mr-4 -mt-1 z-[60] rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.7)]`}
            >
              {countOfInCompleteQuests}
            </div>
          )} */}
          {userData.avatarUrl ? (
            <div
              className="flex flex-col items-center cursor-pointer z-50 h-full transition-all duration-500"
              style={{ minWidth: "60px" }}
            >
              <img
                src={userData.avatarUrl}
                alt="profile-image"
                className={`w-[4rem] transition-all duration-500 ${
                  (section === redirect[icon] || section === 5) &&
                  "glow-icon-white"
                } border border-black  rounded-full pointer-events-none`}
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
                  className={`filter-orbs-${avatarColor} overflow-hidden w-[4.5rem] pointer-events-none`}
                />
                <span
                  className={`absolute z-1 text-black-sm-contour transition-all duration-1000  text-[2.5rem] mt-1 opacity-50`}
                >
                  {userData.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </>
          )}
          <h1 className="flex justify-center -mb-0.5 uppercase">
            {t(`sections.profile`)}
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
const Footer = ({}) => {
  const {
    section,
    activeMyth,
    enableSound,
    minimize,
    assets,
    platform,
    isTgMobile,
  } = useContext(FofContext);
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem("avatarColor");
  });

  return (
    <div
      className={`absolute w-screen bottom-0 ${minimize === 2 && "maximize"} ${
        minimize === 1 && "minimize"
      }`}
    >
      <img
        src={assets.uxui.footer}
        alt="paper"
        draggable={false}
        className={`w-full select-none h-auto max-h-[7rem] filter-paper-${
          section === 3 ||
          section === 4 ||
          section === 5 ||
          section === 6 ||
          section === 11
            ? mythSections[8]
            : mythSections[activeMyth]
        }`}
      />
      <div className="flex justify-center w-full px-2 -ml-1.5 bg-green-200">
        <div
          className={`transition-all footer-width absolute duration-1000 items-end h-[12%] z-50  flex justify-between text-white ${
            isTgMobile && platform === "ios"
              ? "-mt-5.5"
              : isTgMobile && platform !== "ios"
              ? "-mt-4"
              : "-mt-2.5"
          }`}
        >
          {footerIcons.map((item, index) => (
            <FooterItem
              key={index}
              enableSound={enableSound}
              icon={index}
              avatarColor={avatarColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
