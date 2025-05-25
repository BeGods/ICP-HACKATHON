import React, { useContext, useState } from "react";
import { RorContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { useTranslation } from "react-i18next";

const MiscCard = ({ Button, img, icon, showInfo, onlyBack }) => {
  const { assets, setShowCard, setSection } = useContext(RorContext);
  const { i18n } = useTranslation();
  const [flipped, setFlipped] = useState(false);

  const isTelegram = typeof Telegram !== "undefined"; // If not defined elsewhere
  const cardHeight = isTelegram ? "h-[47vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]";

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-[99]">
      <div
        className={`relative card-width card-shadow-white rounded-lg shadow-lg flex flex-col z-50`}
      >
        <div className={`card ${cardHeight} ${flipped ? "flipped" : ""}`}>
          {/* Front Side */}
          <div
            onClick={handleFlip}
            className="card__face card__face--front relative flex justify-center items-center"
          >
            <div
              className="absolute inset-0 bg-cover bg-center rounded-primary z-0"
              style={{
                backgroundImage: `url(${img ?? assets.items.cardBurst})`,
              }}
            />
            <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
              <div className="relative w-full h-[19%] mt-auto card-shadow-white-celtic z-10">
                <div
                  className={`absolute inset-0 bg-cover bg-center bg-no-repeat rounded-b-primary`}
                  style={{ backgroundImage: `url(${assets.uxui.footer})` }}
                />
                <div className="absolute uppercase text-black-contour flex justify-center items-center w-full h-full">
                  {icon ?? "a"}
                </div>
              </div>
            </div>
            <IconBtn
              isInfo={showInfo}
              activeMyth={4}
              handleClick={() => {
                if (showInfo) {
                  setFlipped(true);
                } else {
                  if (!onlyBack) {
                    setSection(0);
                  }
                  setShowCard(null);
                }
              }}
              align={0}
            />
          </div>

          {/* Back Side */}
          <div
            onClick={handleFlip}
            className="card__face card__face--back relative flex justify-center items-center"
          >
            <div className="relative w-full h-full text-card">
              <img
                src={assets.uxui.bgInfo}
                alt="info background"
                className="w-full h-full object-cover rounded-primary z-10"
              />
            </div>
            <div className="absolute flex flex-col top-0 z-20">
              <div className="flex w-full">
                <div className="flex flex-col leading-tight justify-center items-center flex-grow  text-card pt-[10px]">
                  <div className="text-left">
                    <h1 className="text-paperHead font-bold uppercase">
                      {icon ?? "a"}
                    </h1>
                  </div>
                </div>
              </div>
              <div
                className={`leading-[18px] text-para mt-[14px] text-justify mx-auto w-[85%] text-card font-[550] ${
                  ["hi", "th", "ru"].includes(i18n.language) && "font-normal"
                } ${i18n.language === "ru" && "leading-[15px]"}`}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged
              </div>
            </div>
            <IconBtn isInfo={false} activeMyth={5} align={10} />
          </div>
        </div>
      </div>

      {/* Button below the card */}
      <div className={`button z-50 ${flipped ? "flipped mt-3" : "mt-2"}`}>
        <div className="button__face button__face--front flex justify-center items-center">
          {Button}
        </div>
        <div className="button__face button__face--back z-50 mt-0.5 flex justify-center items-center">
          {Button}
        </div>
      </div>
    </div>
  );
};

export default MiscCard;
