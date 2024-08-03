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
        backgroundImage: `url(/themes/footer/${mythSections[activeMyth]}.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
      className="flex justify-between items-center h-[13%] px-8 w-full font-montserrat text-[10px] text-white"
    >
      <div
        onClick={() => {
          setSection(0);
        }}
        className={`flex flex-col items-center font-semibold ${
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
          className={`font-symbols text-[42px] -mt-2.5 ${
            section === 0 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        >
          F
        </h1>
        <p className="-mt-4">FORGES</p>
      </div>
      <div
        onClick={() => {
          handleSectionChange(1);
        }}
        className={`flex flex-col items-center font-semibold ${
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
          className={`font-symbols text-[42px] -mt-2.5 ${
            section === 1 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        >
          q
        </h1>
        <p className="-mt-4">QUESTS</p>
      </div>
      <div
        onClick={() => {
          handleSectionChange(2);
        }}
        className={`flex flex-col items-center font-semibold ${
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
          className={`font-symbols text-[42px] -mt-2.5 ${
            section === 2 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        >
          Z
        </h1>
        <p className="-mt-4">BOOSTERS</p>
      </div>
      <div
        onClick={() => {
          handleSectionChange(3);
        }}
        className={`flex flex-col items-center font-semibold ${
          section !== 3 && "opacity-40"
        }`}
      >
        <img
          src="/icons/user.svg"
          alt="profile"
          className={`h-[30px] w-[30px] ${
            section === 3 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        />
        <p>PROFILE</p>
      </div>
    </div>
  );
};

export default Footer;
