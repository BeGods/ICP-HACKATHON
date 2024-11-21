import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { elements, mythSections } from "../../utils/constants";
import { useTranslation } from "react-i18next";

const Header = ({ TopChild, CenterChild, BottomChild, RedeemHead }) => {
  const { activeMyth, section, assets } = useContext(MyContext);
  const [changeText, setChangeText] = useState(true);
  const { t } = useTranslation();

  const sectionNames = {
    0: [t("sections.forges"), t(`elements.${elements[activeMyth]}`)],
    1: [t("sections.quests"), t(`mythologies.${mythSections[activeMyth]}`)],
    2: [t("sections.boosters"), t(`mythologies.${mythSections[activeMyth]}`)],
    3: [t("sections.profile"), t("sections.profile")],
    4: [t("sections.tower"), t("mythologies.dark")],
    5: [t("profile.partners"), t("profile.charity")],
    6: [t("profile.partner"), RedeemHead],
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className={` ${section === 0 && "hidden"}`}>
        {changeText ? (
          <div
            className={`text-head -mt-2 mx-auto w-full text-center top-0 absolute z-30 text-white text-black-lg-contour uppercase`}
          >
            {sectionNames[section][0]}
          </div>
        ) : (
          <div
            className={`text-head -mt-3 mx-auto w-full text-center top-0 absolute z-30 uppercase
           ${section === 4 ? "text-black text-white-lg-contour" : ""}
           ${
             section === 0 || section === 1 || section === 2
               ? `text-${mythSections[activeMyth]}-text text-black-lg-contour`
               : ""
           }
           ${
             section !== 4 && section !== 0 && section !== 1 && section !== 2
               ? "text-white text-black-lg-contour"
               : ""
           }
         `}
          >
            {sectionNames[section][1]}
          </div>
        )}
      </div>
      <div className="relative flex justify-center w-full h-auto">
        <img
          src={assets.uxui.paper}
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
