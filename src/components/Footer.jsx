import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../context/context";
import { footerIcons, mythSections } from "../utils/variables";
import ReactHowler from "react-howler";

const tele = window.Telegram?.WebApp;

const FooterItem = ({ section, index, activeMyth, onClick }) => {
  const howlerRef = useRef(null);
  const [playSound, setPlaySound] = useState(false);

  const playAudio = () => {
    if (howlerRef.current) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer mt-2"
      onClick={() => {
        playAudio();
        onClick();
      }}
      style={{ minWidth: "90px" }}
    >
      <h1
        className={`font-symbols  ${
          section === index
            ? `glow-icon-${mythSections[activeMyth]}`
            : `footer-shadow`
        }`}
        style={{
          fontSize: section === index ? "80px" : "70px",
          transition: "font-size 0.3s ease",
        }}
      >
        {footerIcons[index]}
      </h1>
      <ReactHowler
        src="/assets/audio/fof.menu01.wav"
        playing={playSound && !JSON.parse(localStorage.getItem("sound"))}
        ref={howlerRef}
        onEnd={() => setPlaySound(false)}
      />
    </div>
  );
};
const Footer = () => {
  const { section, setSection, activeMyth, setActiveMyth } =
    useContext(MyContext);

  const handleSectionChange = (newSection) => {
    if (typeof setSection === "function") {
      setSection(newSection);

      if (activeMyth >= 4) {
        setActiveMyth(0);
      }
    } else {
      console.error("setSection is not a function. Cannot update section.");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
      className="flex justify-between items-center h-[12%] w-full text-white"
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
        className={`filter-paper-${mythSections[activeMyth]}`}
      />
      {footerIcons.map((item, index) => (
        <FooterItem
          key={index}
          section={section}
          index={index}
          activeMyth={activeMyth}
          onClick={() => {
            handleSectionChange(index);
          }}
        />
      ))}
    </div>
  );
};

export default Footer;
