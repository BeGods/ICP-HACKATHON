import React, { useContext, useRef, useState } from "react";
import { MyContext } from "../../context/context";
import { footerArray, footerIcons, mythSections } from "../../utils/constants";
import ReactHowler from "react-howler";
import "../../styles/flip.scss";

const tele = window.Telegram?.WebApp;

const FooterItem = ({ enableSound, icon }) => {
  const howlerRef = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const { section, setSection, activeMyth, setActiveMyth } =
    useContext(MyContext);

  const playAudio = () => {
    if (howlerRef.current && enableSound) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  const handleFlip = (e) => {
    tele.HapticFeedback.notificationOccurred("success");
    playAudio();
  };

  const handleSectionChange = (curr) => {
    if (footerArray[icon][curr] == 4 && icon === 1 && section !== 0) {
      setSection(0);
    } else {
      setSection(footerArray[icon][curr]);
      setFlipped((prev) => !prev);
    }
    if (activeMyth >= 4) {
      setActiveMyth(0);
    }
  };

  return (
    <>
      <div className="flex relative flex-col items-center cursor-pointer mt-5 z-50">
        <div className={`font-symbols text-[15vw]`}>
          <div
            className={`ficon ${flipped ? "flipped" : ""} text-black-contour`}
          >
            <div
              onClick={(e) => {
                handleFlip(e);
                handleSectionChange(0);
              }}
              className="ficon__face ficon__face--front font-symbols flex justify-center items-center"
            >
              {footerIcons[footerArray[icon][0]]}
            </div>
            <div
              onClick={(e) => {
                handleFlip(e);
                handleSectionChange(1);
              }}
              className="ficon__face ficon__face--back font-symbols flex justify-center items-center"
            >
              {footerIcons[footerArray[icon][1]]}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute">
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
  const { section, activeMyth, enableSound } = useContext(MyContext);

  return (
    <div
      className={`absolute  w-screen bottom-0 ${minimize === 2 && "maximize"} ${
        minimize === 1 && "minimize"
      } `}
    >
      <img
        src="/assets/uxui/1280px-fof.footer.png"
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
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[80%] flex justify-between text-white">
          <FooterItem
            icon={0}
            section={section}
            enableSound={enableSound}
            activeMyth={activeMyth}
          />
          <FooterItem
            icon={1}
            section={section}
            enableSound={enableSound}
            activeMyth={activeMyth}
          />
          <FooterItem
            icon={2}
            section={section}
            enableSound={enableSound}
            activeMyth={activeMyth}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
