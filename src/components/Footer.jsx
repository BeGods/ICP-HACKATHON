import React, { useContext } from "react";
import { MyContext } from "../context/context";

const mythSections = ["celtic", "egyptian", "greek", "norse", "other"];

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
      className="flex justify-between items-center h-[13%] px-4 pb-1 w-full font-montserrat text-[10px] text-white"
    >
      <div
        style={{
          backgroundImage: `url(/themes/footer.png)`,
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

      <div
        onClick={() => {
          setSection(0);
        }}
        className={`flex flex-col items-center  ${
          section !== 0 && "opacity-40"
        }`}
      >
        {/* <img
          src="/icons/home.png"
          alt="home"
          className={`h-[30px] w-[30px] mb-0.5 ${
            section === 0 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        />
        <p>FORGES</p> */}

        <h1
          className={`font-symbols text-[60px] -mb-2 ${
            section === 0 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        >
          F
        </h1>
        <p className={`-mt-4 text-[14px] ${section == 0 && "font-semibold"}`}>
          FORGES
        </p>
      </div>
      <div
        onClick={() => {
          handleSectionChange(1);
        }}
        className={`flex flex-col items-center  ${
          section !== 1 && "opacity-40"
        }`}
      >
        {/* <img
          src="/icons/open-quest.svg"
          alt="quests"
          className={`h-[30px] w-[30px] ${
            section === 1 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        />
        <p>QUESTS</p> */}

        <h1
          className={`font-symbols text-[60px] -mb-2 ${
            section === 1 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        >
          q
        </h1>
        <p className={`-mt-4 text-[14px] ${section == 1 && "font-semibold"}`}>
          QUESTS
        </p>
      </div>
      <div
        onClick={() => {
          handleSectionChange(2);
        }}
        className={`flex flex-col items-center  ${
          section !== 2 && "opacity-40"
        }`}
      >
        {/* <img
          src="/icons/booster.svg"
          alt="booster"
          className={`h-[30px] w-[30px] ${
            section === 2 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        />
        <p>BOOSTERS</p> */}

        <h1
          className={`font-symbols text-[60px] -mb-2 ${
            section === 2 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        >
          Z
        </h1>
        <p className={`-mt-4 text-[14px] ${section == 2 && "font-semibold"}`}>
          BOOSTERS
        </p>
      </div>
      <div
        onClick={() => {
          handleSectionChange(3);
        }}
        className={`flex flex-col items-center  ${
          section !== 3 && "opacity-40"
        }`}
      >
        {/* <img
          src="/icons/user.svg"
          alt="profile"
          className={`h-[50px] w-[50px] ${
            section === 3 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        /> */}
        <h1
          className={`font-symbols text-[60px] -mb-2 ${
            section === 3 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        >
          P
        </h1>
        <p className={`-mt-4 text-[14px] ${section == 3 && "font-semibold"}`}>
          PROFILE
        </p>
      </div>
    </div>
  );
};

export default Footer;

// <div
//   style={{
//     backgroundImage: `url(/themes/footer.png)`,
//     backgroundRepeat: "no-repeat",
//     backgroundSize: "cover",
//     backgroundPosition: "center center",
//   }}
//   className="flex justify-between items-center h-[13%] px-8 w-full font-montserrat text-[10px] text-white"
// >
