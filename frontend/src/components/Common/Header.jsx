import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { elementNames, mythSections, mythologies } from "../../utils/constants";

const sectionNames = {
  0: "Forge",
  1: "Quests",
  2: "Boosters",
  3: "Profile",
  4: "Tower",
  5: "Partners",
  6: "Rewards",
};

const Header = ({ TopChild, CenterChild, BottomChild }) => {
  const { activeMyth, section } = useContext(MyContext);
  const [changeText, setChangeText] = useState(true);

  useEffect(() => {
    if (section === 1 || section === 2 || section === 4 || section == 0) {
      const interval = setInterval(() => {
        setChangeText((prevText) => !prevText);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className={`relative`}>
      {changeText ? (
        <div
          className={`text-head -mt-2 mx-auto w-full text-center top-0 absolute z-30 text-white text-black-lg-contour uppercase`}
        >
          {sectionNames[section]}
        </div>
      ) : (
        <div
          className={`text-head -mt-2 mx-auto w-full text-center top-0 absolute z-30 text-${
            section === 4 ? "black" : mythSections[activeMyth]
          }-text ${
            section === 4 ? "text-white-lg-contour" : "text-black-lg-contour"
          } uppercase`}
        >
          {section === 4
            ? "DARK"
            : section === 0
            ? elementNames[activeMyth]
            : mythologies[activeMyth]}
        </div>
      )}
      <div className="relative flex justify-center w-full h-auto">
        <img
          src="/assets/uxui/1280px-fof.footer.png"
          alt="paper"
          className={`w-full h-auto rotate-180 filter-paper-${
            section === 3 ||
            section === 4 ||
            section === 5 ||
            section === 6 ||
            section === 11
              ? mythSections[8]
              : mythSections[activeMyth]
          }`}
        />
        {/* Orb */}
        {CenterChild}
      </div>
      <div className="w-full">
        {TopChild}
        {BottomChild}
      </div>
    </div>
  );
};

export default Header;
