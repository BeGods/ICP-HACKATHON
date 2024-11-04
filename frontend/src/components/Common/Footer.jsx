import React, { useContext, useRef, useState } from "react";
import { MyContext } from "../../context/context";
import { footerIcons, mythSections } from "../../utils/constants";
import ReactHowler from "react-howler";
import "../../styles/flip.scss";

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
  } = useContext(MyContext);
  const countOfInCompleteQuests = socialQuestData.filter(
    (item) => item.isQuestClaimed === false
  ).length;

  const playAudio = () => {
    tele.HapticFeedback.notificationOccurred("success");

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
          className="flex  flex-col items-center cursor-pointer z-50"
          onClick={(e) => {
            e.preventDefault();
            playAudio();
            handleSectionChange(redirect[icon]);
          }}
          style={{ minWidth: "80px" }}
        >
          <h1
            className={`font-symbols ${
              section === redirect[icon]
                ? `${
                    activeMyth < 4 && section !== 4
                      ? `glow-icon-${mythSections[activeMyth]}`
                      : `glow-icon-white text-black-contour`
                  }`
                : `text-black-contour`
            }`}
            style={{
              fontSize: section === redirect[icon] ? "65px" : "60px",
              transition: "font-size 0.3s ease",
            }}
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
              className="flex flex-col items-center cursor-pointer z-50 h-full mb-3.5 transition-all duration-500"
              style={{ minWidth: "80px" }}
            >
              <img
                src={`https://media.publit.io/file/UserAvatars/${userData.avatarUrl}.jpg`}
                alt="profile-image"
                className={`w-[65px] ${
                  (section === redirect[icon] || section === 5) &&
                  "scale-110 glow-icon-white"
                } border border-black  rounded-full`}
              />
            </div>
          ) : (
            <>
              <div
                className={`flex relative text-center mb-3.5 justify-center text-black-sm-contour items-center glow-icon-${avatarColor}`}
              >
                <img
                  src="/assets/uxui/240px-orb.base.png"
                  alt="orb"
                  className={`filter-orbs-${avatarColor} overflow-hidden max-w-[65px]`}
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
        <div className="absolute gelatine flex justify-center items-center border-[3px] font-roboto text-[5vw] font-medium bg-black text-white h-8 w-8 mb-[66px] mr-1 z-50 right-0 rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.7)]">
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
  const { section, activeMyth, enableSound, minimize, assets } =
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

      <div className="transition-all absolute duration-1000 items-end h-[12%] z-50 w-full flex -mt-1 justify-between text-white">
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
  );
};

export default Footer;
