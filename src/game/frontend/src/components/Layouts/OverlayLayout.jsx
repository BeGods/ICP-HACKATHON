import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../context/context";
import { mythSections } from "../../utils/constants.fof";
import { ToggleBack } from "../Common/SectionToggles";

const OverlayLayout = ({ children, customMyth }) => {
  const { assets, setShowCard, section, activeMyth } = useContext(MainContext);
  const [animateClass, setAnimateClass] = useState("overlay-fade-in");
  const myth = customMyth ? customMyth : activeMyth;
  const filter =
    typeof customMyth == "string"
      ? `orbs-${customMyth}`
      : typeof customMyth == "number" ||
        section === 0 ||
        section === 1 ||
        section === 2
      ? `orbs-${mythSections[myth]}`
      : "other";

  const handleClose = () => {
    setAnimateClass("overlay-fade-out");
    setTimeout(() => {
      setShowCard(null);
    }, 200);
  };

  useEffect(() => {
    setAnimateClass("overlay-fade-in");
  }, []);

  return (
    <div
      onClick={handleClose}
      className={`absolute inset-0 z-[70] flex items-center justify-center ${animateClass}`}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={assets.uxui.shadow}
          alt="top shadow"
          draggable={false}
          className="w-full absolute top-0 rotate-180 left-0 select-none h-[120px] z-[1]"
        />
        <img
          src={assets.uxui.shadow}
          alt="bottom shadow"
          draggable={false}
          className="w-full absolute bottom-0 left-0 select-none h-[120px] z-[1]"
        />
        <div
          className={`absolute inset-0 filter-${filter}`}
          style={{
            backgroundImage: `url(${assets.uxui.baseBgA})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="relative w-full flex flex-col items-center h-full"
      >
        {children}
        <ToggleBack minimize={2} handleClick={handleClose} activeMyth={8} />
      </div>
    </div>
  );
};

export default OverlayLayout;
