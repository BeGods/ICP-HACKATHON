import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FofContext } from "../../context/context";
import { mythSections, mythSymbols } from "../../utils/constants.fof";

export const ForgesGuide = ({ handleClick, Header, Toggles, currTut }) => {
  const { activeMyth, assets } = useContext(FofContext);
  const { t, i18n } = useTranslation();

  return (
    <>
      {currTut == 0 ? (
        <div className="absolute inset-0 backdrop-blur-[3px] flex flex-col items-center z-50">
          <div className="w-full">{Header}</div>
          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols items-center z-[99] text-white "
          >
            <div className="font-symbols  text-white text-[10rem] mt-32 scale-point">
              b
            </div>
          </div>
          <div className="h-[5.625rem] text-primary leading-8 maximize flex flex-col justify-center items-center  bottom-0 px-10 w-screen bg-black  text-white text-center uppercase">
            {i18n.language === "en" ? (
              <div className="flex flex-col justify-center items-center">
                Tap to earn <br />{" "}
                <div className={`text-${mythSections[activeMyth]}-text`}>
                  shards
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                {t("tutorial.forgeShard.title")}
              </div>
            )}
          </div>
        </div>
      ) : currTut == 1 ? (
        <div className="absolute inset-0 backdrop-blur-[3px] flex flex-col items-center z-50">
          <div className="w-full">{Header}</div>
          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols items-center z-[99] text-white "
          >
            <div className="font-symbols  text-white text-[10rem] mt-32 scale-point">
              b
            </div>
          </div>
          <div className="h-[5.625rem] leading-8 maximize flex flex-col justify-center items-center  bottom-0 px-10 w-screen bg-black  text-white text-center uppercase">
            {i18n.language === "en" ? (
              <div className="flex flex-col justify-center items-center break-words">
                <div>
                  1{" "}
                  <span className={`text-${mythSections[activeMyth]}-text`}>
                    Orb
                  </span>{" "}
                  =
                </div>
                <div>1,000 shards</div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                {t("tutorial.forgeOrbs.title")}
              </div>
            )}
          </div>
        </div>
      ) : currTut == 2 ? (
        <div className="absolute inset-0 backdrop-blur-[3px] flex flex-col items-center z-50">
          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols justify-start  w-full items-center z-[99] text-white "
          >
            <div className="font-symbols text-white text-[5rem] left-0 mt-[26vh] ml-[8vw] scale-point">
              b
            </div>
          </div>
          <div className="h-[5.625rem] text-primary leading-8 maximize flex flex-col justify-center items-center  bottom-0 px-10 w-screen bg-black  text-white text-center uppercase">
            {i18n.language === "en" ? (
              <div className="flex flex-col justify-center items-center break-words">
                <div>Explore</div>
                <div className={`text-${mythSections[activeMyth]}-text`}>
                  +more
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                {t("tutorial.forgeExplore.title")}
              </div>
            )}
          </div>
          {Toggles}
        </div>
      ) : currTut == 3 ? (
        <div className="absolute inset-0  backdrop-blur-[3px] flex flex-col items-center z-50">
          <div className="h-[20%] pt-gamePanelTop text-primary leading-8 maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
            {i18n.language === "en" ? (
              <div className="flex flex-col">
                <div>Catch & hold</div>
                <div className="flex justify-center w-full gap-3">
                  <div
                    className={`relative text-${mythSections[activeMyth]}-text`}
                  >
                    <span className="text-[2rem]">2</span>{" "}
                    <span className="text-[1.5rem] pl-1 absolute">x</span>{" "}
                  </div>
                  <div className="pl-4">shards</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                {t("tutorial.forgeMinion.title")}
              </div>
            )}
          </div>
          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols justify-center  w-full items-center z-[99] text-white "
          >
            <div className="font-symbols absolute text-white text-[5rem] mb-[2vh] move-hand">
              b
            </div>
          </div>
          <div className="absolute bottom-0 right-0 ">
            <img
              src={`${assets.boosters.alchemistPop}`}
              alt="dwarf"
              className="w-full h-full select-none pointer-events-none"
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 backdrop-blur-[3px] flex flex-col items-center z-50">
          <div className="h-[20%] pt-gamePanelTop text-primary leading-8 maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
            {i18n.language === "en" ? (
              <div className="flex flex-col">
                <div>Pop Bubble</div>
                <div className="flex justify-center w-full gap-3">
                  <div
                    className={`relative text-${mythSections[activeMyth]}-text`}
                  >
                    to earn Gifts
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                {t("tutorial.forgeBubble.title")}
              </div>
            )}
          </div>
          <div
            onClick={handleClick}
            className="flex w-full  relative flex-grow font-symbols justify-center items-center  ml-[10vw] z-[99] text-white "
          >
            <div className="font-symbols text-white text-[5rem] -mt-[4vh] mr-[6vw] scale-once-hold  text-black-contour">
              b
            </div>
          </div>
          <img
            src={assets.logos.captcha}
            alt="fdg"
            className="rounded-full w-[8rem] h-[8rem] absolute ottom-0 right-0 move-circle"
          />
        </div>
      )}
    </>
  );
};

export const QuestGuide = ({ handleClick }) => {
  const { activeMyth } = useContext(FofContext);
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 flex  flex-col items-center z-50">
      <div className="h-[20%] pt-gamePanelTop maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="flex flex-col text-bonus-desc mt-2 leading-10">
          <span
            className={`font-symbols text-[50px] pb-3 lowercase glow-icon-${mythSections[activeMyth]}`}
          >
            i
          </span>
          <div>
            {t("tutorial.quests.title")
              .split(" ")
              .map((word, index, words) => (
                <span
                  key={index}
                  style={{
                    display: index === words.length - 1 ? "block" : "inline",
                  }}
                  className={`${
                    index === words.length - 1
                      ? `text-${mythSections[activeMyth]}-text`
                      : ""
                  }`}
                >
                  {word}{" "}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex w-full pointer-events-auto cursor-pointer relative flex-grow font-symbols items-center z-[99] text-white "
      ></div>
      <div className="h-[5.625rem] maximize flex flex-col text-primary leading-8 justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        {t("tutorial.quests.desc")
          .split(" ")
          .map((text, index) => (
            <span
              key={index}
              style={{
                display: index === text.length - 1 ? "block" : "inline",
              }}
              className={`${
                index === text.length - 1
                  ? `text-${mythSections[activeMyth]}-text`
                  : ""
              }`}
            >
              {text}{" "}
            </span>
          ))}
      </div>
    </div>
  );
};

export const BoosterGuide = ({ handleClick }) => {
  const { activeMyth } = useContext(FofContext);
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 flex flex-col items-center z-50">
      <div className="h-[20%] maximize-head flex justify-center items-center pt-gamePanelTop  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="flex flex-col text-bonus-desc leading-10">
          <div>
            {t("tutorial.boosters.title")
              .split(" ")
              .map((word, index) => (
                <span
                  key={index}
                  style={{ display: "block" }}
                  className={`${
                    index == 1 && `text-${mythSections[activeMyth]}-text`
                  }`}
                >
                  {word}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex pointer-events-auto cursor-pointer w-full relative flex-grow font-symbols items-center z-[99] text-white "
      ></div>
      <div className="h-[5.625rem] maximize flex flex-col justify-center items-center  bottom-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="flex flex-col justify-center items-center text-primary leading-8">
          {t("tutorial.boosters.desc")
            .split(" ")
            .map((text, index) => (
              <span
                key={index}
                style={{
                  display: index === text.length - 1 ? "block" : "inline",
                }}
                className={`${
                  index === text.length - 1
                    ? `text-${mythSections[activeMyth]}-text`
                    : ""
                }`}
              >
                {text}{" "}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export const TowerGuide = ({ handleClick, isTgMobile }) => {
  const { assets, activeMyth } = useContext(FofContext);
  const { t } = useTranslation();
  const [activeColor, setActiveColor] = useState(0);
  const myths = ["greek", "celtic", "norse", "egyptian"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColor((prev) => (prev + 1) % myths.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [myths.length]);

  return (
    <div className="absolute inset-0 backdrop-blur-[3px] flex  flex-col items-center z-[60]">
      <div className="h-[20%] pt-gamePanelTop text-bonus-desc leading-10 maximize-head flex justify-center items-center  top-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="flex flex-col">
          <div>
            {t("tutorial.tower.title")
              .split(" ")
              .map((word, index) => (
                <span
                  key={index}
                  style={{ display: "block" }}
                  className={`${
                    index == 1 && `text-${mythSections[activeMyth]}-text`
                  }`}
                >
                  {word}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-grow"></div>

      <div onClick={handleClick} className={`center-section`}>
        <div
          className="relative scale-105 flex justify-center items-center w-full h-full pointer-events-none scale-wheel-glow"
          style={{
            width:
              !!document.fullscreenElement || isTgMobile ? "79dvw" : "42dvh",
            backgroundImage: `url(${assets.uxui.towerOff})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="font-symbols text-white text-[5rem] z-[99] text-black-contour scale-point -ml-[7rem] mt-[30vh]">
            b
          </div>
        </div>
      </div>
      <div className="h-[5.625rem] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="text-primary">2</div>
        <div className="text-[20px] font-roboto font-semibold px-1">x</div>
        <div
          className={`flex transition-all duration-1000  relative text-center justify-center items-center max-w-orb rounded-full glow-icon-${mythSections[activeColor]}`}
        >
          <img
            src={assets.uxui.baseOrb}
            alt={`gray orb`}
            className={`filter-orbs-${myths[activeColor]} transition-all duration-1000`}
          />
          <span
            className={`absolute z-1  justify-center items-center font-symbols text-white `}
          >
            <div className="text-symbol-sm lowercase transition-all duration-1000  opacity-50 orb-symbol-shadow mt-1 justify-center items-center font-symbols text-white">
              {mythSymbols[myths[activeColor]]}
            </div>
          </span>
        </div>
        <h1 className="text-primary font-semibold px-2">=</h1>
        <div
          className={`flex relative text-center justify-center items-center max-w-orb -mr-2 rounded-full glow-icon-white`}
        >
          <img src={assets.items.multiorb} alt={`gray orb`} />
        </div>
      </div>
    </div>
  );
};

export const ProfileGuide = ({ handleClick, currGuide, Header }) => {
  const { t } = useTranslation();

  return (
    <>
      {currGuide === 0 ? (
        <div className="absolute inset-0  flex  flex-col items-center z-50">
          <div className="h-[20%] maximize-head pb-2 w-screen bg-black text-white text-center">
            <div className="flex flex-col text-bonus-desc mt-2 leading-10">
              <span className="font-symbols text-[50px] pb-3">0</span>
              <div className="uppercase">
                {t("tutorial.profileTask.title")
                  .split(" ")
                  .map((word, index, words) => (
                    <span
                      key={index}
                      style={{
                        display:
                          index === words.length - 1 ? "block" : "inline",
                      }}
                    >
                      {word}{" "}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div
            onClick={handleClick}
            className="flex w-full  relative pointer-events-auto cursor-pointer flex-grow items-center text-white"
          ></div>
          <div className="h-[5.625rem] maximize flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
            <div className="flex flex-col justify-center items-center text-primary leading-8 break-words">
              {t("tutorial.profileTask.desc")}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute w-full inset-0 backdrop-blur-[3px] flex  flex-col items-center z-50">
          <div className="w-full">{Header}</div>
          <div
            onClick={handleClick}
            className="flex relative flex-grow font-symbols justify-start  w-full items-start z-[99] text-white "
          >
            <div className="font-symbols text-white text-[5rem] left-0 ml-[8vw] scale-point">
              b
            </div>
          </div>
          <div className="h-[5.625rem] maximize flex justify-center items-center text-primary leading-8  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
            <div className="flex flex-col justify-center items-centerbreak-words">
              {t("tutorial.gift.title")
                .split(" ")
                .map((text, index) => (
                  <span
                    key={index}
                    style={{
                      display: index === text.length - 1 ? "block" : "inline",
                    }}
                  >
                    {text}{" "}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
