import React, { useContext } from "react";
import { RorContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { useTranslation } from "react-i18next";

const RelicInfo = ({ handleFlip }) => {
  const { i18n } = useTranslation();
  const { assets } = useContext(RorContext);

  return (
    <div
      style={{ userSelect: "none", WebkitUserDrag: "none" }}
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      onClick={handleFlip}
      className={`card__face card__face--back relative flex select-none justify-center items-center`}
    >
      <div className="relative w-full h-full text-card">
        <img
          src={assets.uxui.bgInfo}
          alt="info background"
          className="w-full h-full object-cover rounded-primary z-10"
        />
      </div>
      <div className="absolute flex flex-col top-0 z-20">
        {/* <img
          src={`/assets/char.info.png`}
          alt="shards"
          className="rounded-t-primary"
        /> */}
        <div
          className={`leading-[18px] text-para mt-[14px] text-justify  mx-auto w-[85%] text-card font-[550] ${
            (i18n.language === "hi" ||
              i18n.language === "th" ||
              i18n.language === "ru") &&
            "font-normal"
          } ${i18n.language === "ru" && "leading-[15px]"}`}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
      </div>
      <IconBtn isInfo={false} activeMyth={5} align={10} />
    </div>
  );
};

export default RelicInfo;
