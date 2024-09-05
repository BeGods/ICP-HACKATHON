import React, { useContext, useRef } from "react";
import { MyContext } from "../../context/context";
import { footerIcons, mythSections } from "../../utils/variables";
import ReactHowler from "react-howler";

const tele = window.Telegram?.WebApp;

const FooterItem = ({ section, index, activeMyth, handleClick }) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer mt-2"
      onClick={(e) => {
        e.preventDefault();
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
          fontSize: section === index ? "80px" : "70px",
          transition: "font-size 0.3s ease",
        }}
      >
        {footerIcons[index]}
      </h1>
    </div>
  );
};

const Footer = ({ minimize }) => {
  const howlerRef = useRef(null);
  const { section, setSection, activeMyth, setActiveMyth } =
    useContext(MyContext);

  const playAudio = () => {
    if (howlerRef.current && !JSON.parse(localStorage.getItem("sound"))) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  const handleSectionChange = (newSection) => {
    tele.HapticFeedback.notificationOccurred("success");
    setSection(newSection);
    playAudio();
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
      } transition-all duration-1000 items-center h-[12%] z-10 w-full text-white`}
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
        className={`filter-paper-other`}
      />
      {footerIcons.map((item, index) => (
        <FooterItem
          key={index}
          section={section}
          index={index}
          activeMyth={activeMyth}
          handleClick={() => {
            handleSectionChange(index);
          }}
        />
      ))}
      <div className="absolute">
        <ReactHowler
          src="/assets/audio/fof.menu01.wav"
          playing={false}
          preload={true}
          ref={howlerRef}
          html5={true}
        />
      </div>
    </div>
  );
};

export default Footer;
