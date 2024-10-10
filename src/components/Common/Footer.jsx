import React, { useContext, useRef, useState } from "react";
import { MyContext } from "../../context/context";
import { footerIcons, mythSections } from "../../utils/variables";
import ReactHowler from "react-howler";
import animationData from "../../../public/assets/fx/tower.json";
import Lottie from "lottie-react";

const tele = window.Telegram?.WebApp;

const FooterItem = ({
  section,
  activeMyth,
  handleClick,
  enableSound,
  icon,
}) => {
  const howlerRef = useRef(null);

  const playAudio = () => {
    if (howlerRef.current && enableSound) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  return (
    <>
      <div
        className="flex relative flex-col items-center cursor-pointer mt-2 z-50"
        onClick={(e) => {
          e.preventDefault();
          playAudio();
          handleClick();
        }}
        style={{ minWidth: "90px" }}
      >
        <h1
          className={`font-symbols ${
            section === icon
              ? `${
                  activeMyth < 4 && section != 3
                    ? `glow-icon-${mythSections[activeMyth]}`
                    : `glow-text-white`
                }`
              : `text-black-contour`
          }`}
          style={{
            fontSize: section === icon ? "60px" : "50px",
            transition: "font-size 0.3s ease",
          }}
        >
          {footerIcons[icon]}
        </h1>
      </div>
      <div className="absolute ">
        <ReactHowler
          src="/assets/audio/fof.menu01.wav"
          playing={false}
          preload={true}
          ref={howlerRef}
          html5={true}
        />
      </div>
    </>
  );
};

const Footer = ({ minimize }) => {
  const { section, setSection, activeMyth, setActiveMyth, enableSound } =
    useContext(MyContext);
  const lottieRef = useRef(null);
  const [isForward, setIsForward] = useState(true);

  const handlePlay = () => {
    if (lottieRef.current) {
      if (isForward) {
        lottieRef.current.setSpeed(0.1);
        lottieRef.current.setDirection(1);
      } else {
        lottieRef.current.setSpeed(0.1);
        lottieRef.current.setDirection(-1);
      }
      lottieRef.current.goToAndPlay(0, false);
      setIsForward(!isForward);
    }
  };

  const handleSectionChange = (newSection) => {
    tele.HapticFeedback.notificationOccurred("success");
    setSection(newSection);
    if (activeMyth >= 4) {
      setActiveMyth(0);
    }
  };

  return (
    <div
      className={`relative ${minimize === 2 && "maximize"} ${
        minimize === 1 && "minimize"
      } `}
    >
      <img
        src="/assets/uxui/fof.footer.rock3.png"
        alt="paper"
        className={`w-full h-auto filter-paper-${
          section === 3 || section === 4 || section === 5 || section === 6
            ? mythSections[8]
            : mythSections[activeMyth]
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[80%] flex justify-between text-white">
          {/* <FooterItem
            icon={footerLeft[section]}
            section={section}
            enableSound={enableSound}
            activeMyth={activeMyth}
            handleClick={() => {
              handleSectionChange(footerLeft[section]);
            }}
          /> */}
          <Lottie
            onClick={handlePlay}
            lottieRef={lottieRef}
            autoplay={false}
            loop={false}
            animationData={animationData}
            className="w-[15vw]"
          />
          {/* <FooterItem
            icon={footerMed[section]}
            section={section}
            enableSound={enableSound}
            activeMyth={activeMyth}
            handleClick={() => {
              handleSectionChange(footerMed[section]);
            }}
          />
          <FooterItem
            icon={footerRight[section]}
            section={section}
            enableSound={enableSound}
            activeMyth={activeMyth}
            handleClick={() => {
              handleSectionChange(footerRight[section]);
            }}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Footer;
