import React, { useContext, useRef, useState } from "react";
import { MyContext } from "../../context/context";
import { footerIcons, mythSections } from "../../utils/constants";
import ReactHowler from "react-howler";
import "../../styles/flip.scss";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const redirect = [0, 2, 4, 3];

const tele = window.Telegram?.WebApp;

const FooterItem = ({ enableSound, icon, avatarColor }) => {
  const howlerRef = useRef(null);
  const {
    section,
    setSection,
    activeMyth,
    setActiveMyth,
    socialQuestData,
    assets,
    userData,
    platform,
    enableHaptic,
  } = useContext(MyContext);
  const countOfInCompleteQuests = socialQuestData.filter(
    (item) => item.isQuestClaimed === false
  ).length;
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
    if (activeMyth >= 4) {
      setActiveMyth(0);
    }
  };

  return (
    <>
      {icon < 3 ? (
        <div
          className={`flex flex-col items-center cursor-pointer z-50`}
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
              section === redirect[icon] && platform !== "ios" && "pb-[3px]"
            } ${
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
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.preventDefault();
            playAudio();
            handleSectionChange(icon);
          }}
        >
          {userData.avatarUrl ? (
            <div
              className="flex flex-col items-center cursor-pointer z-50 h-full mb-4 transition-all duration-500"
              style={{ minWidth: "70px" }}
            >
              <img
                src={`https://media.publit.io/file/UserAvatars/${userData.avatarUrl}.jpg`}
                alt="profile-image"
                className={`w-[16.5vw] ${
                  (section === redirect[icon] || section === 5) &&
                  "scale-110 glow-icon-white"
                } border border-black  rounded-full pointer-events-none`}
              />
            </div>
          ) : (
            <>
              <div
                className={`flex relative text-center mb-3.5 justify-center text-black-sm-contour items-center glow-icon-${avatarColor}`}
              >
                <img
                  src={assets.uxui.baseorb}
                  alt="orb"
                  className={`filter-orbs-${avatarColor} overflow-hidden max-w-[65px] pointer-events-none`}
                />
                <span
                  className={`absolute z-1 text-black-sm-contour transition-all duration-1000  text-[35px] mt-1 opacity-50`}
                >
                  {userData.telegramUsername.charAt(0).toUpperCase()}
                </span>
              </div>
            </>
          )}
        </div>
      )}
      {icon === 3 && (
        <div className="absolute gelatine flex justify-center items-center border-[3px] font-roboto text-[5vw] font-medium bg-[#FF6500] text-white h-8 w-8 mb-[7.5vh] mr-3 z-50 right-0 rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.7)]">
          {countOfInCompleteQuests}
        </div>
      )}

      <ReactHowler
        src={assets.audio.menu}
        playing={false}
        preload={true}
        ref={howlerRef}
        html5={true}
      />
    </>
  );
};
const Footer = ({}) => {
  const { section, activeMyth, enableSound, minimize, assets, platform } =
    useContext(MyContext);
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
        src={assets.uxui.paper}
        alt="paper"
        className={`w-full h-auto filter-paper-${
          section === 3 ||
          section === 4 ||
          section === 5 ||
          section === 6 ||
          section === 11
            ? mythSections[8]
            : mythSections[activeMyth]
        }`}
      />

      <div
        className={`transition-all absolute duration-1000 items-end h-[12%] z-50 w-full px-2 flex justify-between text-white ${
          platform === "ios" ? "-mt-3" : "-mt-0.5"
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
      <ReactHowler
        src={assets.audio.fofIntro}
        playing={enableSound}
        preload={true}
        html5={true}
      />
    </div>
  );
};

export default Footer;
