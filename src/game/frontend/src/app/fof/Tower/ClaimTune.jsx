import React, { useContext, useRef, useState } from "react";
import {
  elements,
  mythSections,
  mythSymbols,
  mythologies,
} from "../../../utils/constants.fof";
import { CircleCheck, CircleX } from "lucide-react";
import ReactHowler from "react-howler";
import { FofContext } from "../../../context/context";
import { useTranslation } from "react-i18next";
import { handleClickHaptic } from "../../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const orbPos = [
  "top-[69%] left-[26%]",
  "top-[35%] left-[14%]",
  "top-[20%] left-[65%]",
  "top-[54%] left-[77%]",
];

const ConvertClaimCard = ({ handleClose, handleSubmit }) => {
  const { t } = useTranslation();
  const { enableSound, assets, enableHaptic, isBrowser } =
    useContext(FofContext);
  const [clickedOrbs, setClickedOrbs] = useState([]);
  const [showPlay, setShowPlay] = useState(false);
  const [showEffect, setShowEffect] = useState(null);
  const [playSound, setPlaySound] = useState(0);
  const howlerRef = useRef(null);

  const handleKeys = () => {
    const selectedKeys = clickedOrbs
      .map((item) => mythologies.indexOf(item))
      .join("");

    handleClose();
    handleSubmit(selectedKeys);
  };

  const playAudio = () => {
    if (howlerRef.current && enableSound) {
      howlerRef.current.stop();
      howlerRef.current.play();
    }
  };

  return (
    <div className="fixed inset-0  bg-black bg-opacity-85  backdrop-blur-[3px] flex  flex-col justify-center items-center z-50">
      {!showPlay ? (
        <div className="flex flex-col w-full items-center justify-center">
          <div className="uppercase text-center leading-[60px] top-0 text-gold text-[3rem] px-0.5 scale-zero text-black-contour">
            {t("tower.tune")}
          </div>
          <div
            className={`flex w-fit gap-x-10 mt-10 justify-between text-gold`}
          >
            <div
              onClick={() => {
                setShowPlay(true);
              }}
            >
              <CircleCheck
                size={"6rem"}
                color="green"
                className="cursor-pointer"
              />
            </div>
            <div
              onClick={() => {
                handleClose();
                handleSubmit();
              }}
            >
              <CircleX size={"6rem"} color="red" className="cursor-pointer" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10 flex-grow w-full justify-center items-center">
          <div className="uppercase inset-0 text-center absolute leading-[60px] top-0 text-gold text-[3rem] mt-3 px-2 scale-zero text-black-contour">
            {t("tower.play")}
          </div>
          <div className="relative -mt-[1.25rem]">
            <img
              src={assets.uxui.towerOff}
              alt="tower"
              style={{
                height: "47dvh",
                width: "45dvh",
                aspectRatio: "1 / 1.4",
              }}
            />
            {mythologies.map((item, index) => (
              <div
                onClick={() => {
                  if (clickedOrbs.length <= 6) {
                    handleClickHaptic(tele, enableHaptic);
                    playAudio();
                    setPlaySound(index + 1);
                    setShowEffect(index + 1);
                    setTimeout(() => {
                      setShowEffect(null);
                    }, 500);
                    setClickedOrbs((prev) =>
                      prev.length <= 6 ? [...prev, item] : prev
                    );
                  }
                }}
                key={index}
                className={`absolute cursor-pointer ${orbPos[index]}  pointer-events-auto z-50`}
              >
                <div
                  className={`flex relative transition-all duration-1000 glow-icon-${item.toLowerCase()} text-center justify-center ${
                    showEffect - 1 === index ? "w-[6dvh]" : "w-[5.5dvh]"
                  } items-center rounded-full `}
                >
                  <img
                    src={`${assets.uxui.baseOrb}`}
                    alt="orb"
                    className={`filter-orbs-${item.toLowerCase()} `}
                  />
                  <span
                    className={`absolute z-1 font-symbols ${
                      showEffect - 1 === index
                        ? ` transition-all duration-1000 opacity-100 text-${item.toLowerCase()}-text`
                        : "text-white opacity-50"
                    } text-[4dvh] mt-1 text-black-sm-contour`}
                  >
                    <>{mythSymbols[item.toLowerCase()]}</>
                  </span>
                </div>
              </div>
            ))}
            <div
              onClick={() => {
                playAudio();

                setPlaySound(-1);
                setShowEffect(-1);
                setTimeout(() => {
                  setShowEffect(null);
                }, 500);

                setClickedOrbs((prev) =>
                  prev.length <= 6 ? [...prev, "multiorb"] : prev
                );
              }}
              className="flex absolute items-center -mt-[27.5dvh] ml-[19dvh] z-50 pointer-events-auto"
            >
              <div
                className={`flex relative text-center justify-center ${
                  showEffect === -1
                    ? "w-[5.5dvh] glow-icon-lg-white"
                    : "w-[8dvh] glow-icon-white"
                } items-center rounded-full z-50 `}
              >
                <img src={`${assets.items.multiorb}`} alt="orb" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0">
            <CircleCheck
              size={"4rem"}
              color="white"
              onClick={handleKeys}
              className={`scale-icon mb-[15vh]`}
            />
          </div>
          <div className="absolute bottom-0 text-[3rem] text-white text-black-contour font-roboto flex gap-2">
            <div
              className={`cursor-pointer ${
                clickedOrbs.length === 0 ? "hidden" : ""
              } ${clickedOrbs.length === 1 ? "scale-point" : ""}`}
            >
              *
            </div>
            <div
              className={`cursor-pointer ${
                clickedOrbs.length < 2 ? "hidden" : ""
              } ${clickedOrbs.length === 2 ? "scale-point" : ""}`}
            >
              *
            </div>
            <div
              className={`cursor-pointer ${
                clickedOrbs.length < 3 ? "hidden" : ""
              } ${clickedOrbs.length === 3 ? "scale-point" : ""}`}
            >
              *
            </div>
            <div
              className={`cursor-pointer ${
                clickedOrbs.length < 4 ? "hidden" : ""
              } ${clickedOrbs.length === 4 ? "scale-point" : ""}`}
            >
              *
            </div>
            <div
              className={`cursor-pointer ${
                clickedOrbs.length < 5 ? "hidden" : ""
              } ${clickedOrbs.length === 5 ? "scale-point" : ""}`}
            >
              *
            </div>
            <div
              className={`cursor-pointer ${
                clickedOrbs.length < 6 ? "hidden" : ""
              } ${clickedOrbs.length === 6 ? "scale-point" : ""}`}
            >
              *
            </div>
          </div>
        </div>
      )}
      <div className="absolute">
        {playSound != 0 && (
          <>
            <ReactHowler
              src={
                assets.audio[
                  `orb.${playSound >= 0 ? elements[playSound - 1] : "multi"}`
                ]
              }
              playing={enableSound}
              preload={true}
              ref={howlerRef}
              onEnd={() => setPlaySound(0)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ConvertClaimCard;
