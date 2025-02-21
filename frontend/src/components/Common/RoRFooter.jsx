import React, { useContext, useRef, useState } from "react";
import { RorContext } from "../../context/context";
import { footerIcons, mythSections } from "../../utils/constants.ror";
import ReactHowler from "react-howler";
import "../../styles/flip.scss";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { useTranslation } from "react-i18next";

const redirect = [1, 0, 2, 6];
const sectionTitles = ["Explore", "Citadel", "Bag", "profile"];

const tele = window.Telegram?.WebApp;

const FooterItem = ({ enableSound, icon, avatarColor }) => {
  const howlerRef = useRef(null);
  const { t } = useTranslation();
  const {
    section,
    setSection,
    activeMyth,
    setActiveMyth,
    assets,
    userData,
    enableHaptic,
  } = useContext(RorContext);
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
                ? `glow-icon-white text-black-contour`
                : `text-black-contour`
            }`}
          >
            {footerIcons[icon]}
          </h1>
          <h1 className="flex justify-center -mt-3 pb-[6px] uppercase">
            {sectionTitles[icon]}
          </h1>
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
            handleSectionChange(6);
          }}
          className={`flex ${
            clickEffect && "click-effect"
          } flex-col items-center mb-2`}
        >
          {userData.avatarUrl ? (
            <div
              className="flex flex-col items-center cursor-pointer z-50 h-full transition-all duration-500"
              style={{ minWidth: "60px" }}
            >
              <img
                src={`https://media.publit.io/file/UserAvatars/${userData.avatarUrl}.jpg`}
                alt="profile-image"
                className={`w-[16vw] transition-all duration-500 ${
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
                  src={assets.uxui.baseorb}
                  alt="orb"
                  className={`filter-orbs-${avatarColor} overflow-hidden max-w-[65px] pointer-events-none`}
                />
                <span
                  className={`absolute z-1 text-black-sm-contour transition-all duration-1000  text-[35px] mt-1 opacity-50`}
                >
                  {userData?.telegramUsername?.charAt(0).toUpperCase() ??
                    "name"}
                </span>
              </div>
            </>
          )}
          <h1 className="flex justify-center -mb-0.5 uppercase">
            {t(`sections.profile`)}
          </h1>
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
    useContext(RorContext);
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
        className={`w-full h-auto filter-paper-${mythSections[8]}`}
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
