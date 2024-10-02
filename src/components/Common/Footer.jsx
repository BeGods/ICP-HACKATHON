import React, { useContext, useRef } from "react";
import { MyContext } from "../../context/context";
import { footerIcons, mythSections } from "../../utils/variables";
import ReactHowler from "react-howler";

const tele = window.Telegram?.WebApp;

const FooterItem = ({
  section,
  index,
  activeMyth,
  handleClick,
  enableSound,
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
            section === index
              ? `${
                  activeMyth < 4 && section != 3
                    ? `glow-icon-${mythSections[activeMyth]}`
                    : `glow-text-white`
                }`
              : `text-black-contour`
          }`}
          style={{
            fontSize: section === index ? "60px" : "50px",
            transition: "font-size 0.3s ease",
          }}
        >
          {footerIcons[index]}
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

  const handleSectionChange = (newSection) => {
    tele.HapticFeedback.notificationOccurred("success");
    setSection(newSection);
    if (activeMyth >= 4) {
      setActiveMyth(0);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
      className={`flex justify-between ${minimize === 2 && "maximize"} ${
        minimize === 1 && "minimize"
      } transition-all duration-1000 items-center h-[12%] z-50 w-full text-white`}
    >
      <div
        style={{
          backgroundImage: `url(/assets/uxui/fof.footer.paper.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        className={`filter-paper-${
          section === 3 || section === 0 || section === 9
            ? mythSections[4]
            : mythSections[activeMyth]
        } `}
      />
      {footerIcons.map((item, index) => (
        <FooterItem
          key={index}
          section={section}
          index={index}
          enableSound={enableSound}
          activeMyth={activeMyth}
          handleClick={() => {
            handleSectionChange(index);
          }}
        />
      ))}
    </div>
  );
};

export default Footer;
