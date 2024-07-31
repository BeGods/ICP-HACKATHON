import React, { useContext } from "react";
import { MyContext } from "../context/context";

const mythSections = ["celtic", "egyptian", "greek", "norse", "other"];

const Footer = () => {
  const { section, setSection, activeMyth } = useContext(MyContext);
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
        <img
          src="/icons/home.png"
          alt="home"
          className={`h-[30px] w-[30px] mb-0.5 ${
            section === 0 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        />
        <p>FORGE</p>
      </div>
      <div
        onClick={() => {
          setSection(1);
        }}
        className={`flex flex-col items-center font-semibold ${
          section !== 1 && "opacity-40"
        }`}
      >
        <img
          src="/icons/open-quest.svg"
          alt="quests"
          className={`h-[30px] w-[30px] ${
            section === 1 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        />
        <p>QUEST</p>
      </div>
      <div
        onClick={() => {
          setSection(2);
        }}
        className={`flex flex-col items-center font-semibold ${
          section !== 2 && "opacity-40"
        }`}
      >
        <img
          src="/icons/booster.svg"
          alt="booster"
          className={`h-[30px] w-[30px] ${
            section === 2 && `glow-icon-${mythSections[activeMyth]}`
          }`}
        />
        <p>BOOSTER</p>
      </div>
      <div
        onClick={() => {
          setSection(3);
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
