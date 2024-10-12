import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { mythSections, mythologies } from "../../utils/constants";

const sectionNames = {
  0: "Forge",
  1: "Quests",
  2: "Boosters",
  3: "Profile",
  4: "Tower",
  5: "Tasks",
};

const Header = ({ TopChild, CenterChild, BottomChild }) => {
  const { activeMyth, section } = useContext(MyContext);
  const [changeText, setChangeText] = useState(true);
  const myth =
    section != 3 &&
    section != 5 &&
    section != 4 &&
    section != 11 &&
    mythSections[activeMyth];

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);

    return () => clearInterval(interval);
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
          className={`text-head -mt-2 mx-auto w-full text-center top-0 absolute z-30 text-${mythSections[activeMyth]}-text text-black-lg-contour uppercase`}
        >
          {mythologies[activeMyth]}
        </div>
      )}

      <div className="relative flex justify-center w-full h-auto">
        {/* Left */}
        <div className="relative">
          <img
            src="/assets/uxui/390px-header-k.png"
            alt="left"
            className={`left-0 h-[36vw] filter-${myth}`}
          />
        </div>
        {/* Orb */}
        <div className="justify-center flex">{CenterChild}</div>
        {/* Right */}
        <img
          src="/assets/uxui/390px-header-k.png"
          alt="left"
          className={`right-0 transform scale-x-[-1] h-[36vw] filter-${myth}`}
        />
      </div>
      {TopChild}
      {BottomChild}
    </div>
  );
};

export default Header;
