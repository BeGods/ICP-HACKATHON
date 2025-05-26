import React, { useContext, useEffect, useRef, useState } from "react";
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
    tasks,
  } = useContext(RorContext);
  const [clickEffect, setClickEffect] = useState(false);
  const [showEffect, setShowEffect] = useState(true);

  const countOfInCompleteQuests = tasks.filter(
    (item) => item.isQuestClaimed === false
  ).length;

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
          {icon === 3 && (
            <div
              className={`absolute ${
                showEffect && "pulse-text"
              } gelatine right-0 flex justify-center items-center border-[1.5px] font-roboto text-[1.2rem] font-medium bg-black text-white  h-7 w-7 text-black-sm-contour -mr-4 -mt-1 z-[60] rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.7)]`}
            >
              {countOfInCompleteQuests}
            </div>
          )}
          {userData.avatarUrl ? (
            <div
              className="flex flex-col items-center cursor-pointer z-50 h-full transition-all duration-500"
              style={{ minWidth: "60px" }}
            >
              <img
                src={userData.avatarUrl}
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
                  src={assets.uxui.baseOrb}
                  alt="orb"
                  className={`filter-orbs-${avatarColor} overflow-hidden max-w-[65px] pointer-events-none`}
                />
                <span
                  className={`absolute z-1 text-black-sm-contour transition-all duration-1000  text-[35px] mt-1 opacity-50`}
                >
                  {userData?.username?.charAt(0).toUpperCase() ?? "name"}
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
  const { enableSound, minimize, assets, platform } = useContext(RorContext);
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
        draggable={false}
        src={assets.uxui.footer}
        alt="paper"
        className={`w-full h-auto max-h-[7rem] filter-paper-${mythSections[8]}`}
      />
      <div className="flex justify-center w-full px-2 -ml-1.5 bg-green-200">
        <div
          className={`transition-all footer-width absolute duration-1000 items-end h-[12%] z-50  flex justify-between text-white ${
            platform === "ios" ? "-mt-5.5" : "-mt-4"
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
