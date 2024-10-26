import React, { useContext, useRef, useState } from "react";
import {
  elements,
  mythSections,
  mythSymbols,
  mythologies,
  orbSounds,
} from "../../utils/constants";
import { CircleCheck, CircleX } from "lucide-react";
import ReactHowler from "react-howler";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";

const tele = window.Telegram?.WebApp;

const orbPos = [
  "mt-[45vw] mr-[32vw]",
  "-ml-[55vw] -mt-[18vw]",
  "-mt-[45vw] ml-[32vw]",
  "mt-[18vw] ml-[52vw]",
];

const ConvertClaimCard = ({ handleClose, handleSubmit }) => {
  const { t } = useTranslation();
  const { enableSound, assets } = useContext(MyContext);
  const [clickedOrbs, setClickedOrbs] = useState([]);
  const [showPlay, setShowPlay] = useState(false);
  const [showEffect, setShowEffect] = useState(null);
  const [playSound, setPlaySound] = useState(0);
  const howlerRef = useRef(null);

  console.log(playSound);

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
          <div className="uppercase text-center leading-[60px] top-0 text-gold text-[14.2vw] px-0.5 scale-zero text-black-contour">
            {t("tower.tune")}
          </div>
          <div className="flex text-[10vw] w-2/3 mt-10 justify-between text-gold">
            <div
              onClick={() => {
                setShowPlay(true);
              }}
            >
              <CircleCheck size={"18vw"} color="green" />
            </div>
            <div
              onClick={() => {
                handleClose();
                handleSubmit();
              }}
            >
              <CircleX size={"18vw"} color="red" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10 flex-grow w-full justify-center items-center">
          <div className="uppercase text-center absolute leading-[60px] top-0 text-gold text-[14.2vw] px-0.5 scale-zero text-black-contour">
            {t("tower.play")}
          </div>
          <div
            className={`relative flex justify-center ${
              showEffect && `glow-tap-${mythSections[showEffect - 1]}`
            } items-center w-full h-full pointer-events-none`}
            style={{
              backgroundImage: `url(${assets.uxui.tower})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {" "}
            {mythologies.map((item, index) => (
              <div
                onClick={() => {
                  if (clickedOrbs.length <= 6) {
                    tele.HapticFeedback.notificationOccurred("success");
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
                className={`absolute ${orbPos[index]} pointer-events-auto z-50`}
              >
                <div
                  className={`flex relative transition-all duration-1000 glow-icon-${item.toLowerCase()} text-center justify-center ${
                    showEffect - 1 === index ? "w-[12vw]" : "max-w-orb"
                  } items-center rounded-full `}
                >
                  <img
                    src={`${assets.uxui.baseorb}`}
                    alt="orb"
                    className={`filter-orbs-${item.toLowerCase()} `}
                  />
                  <span
                    className={`absolute z-1 font-symbols ${
                      showEffect - 1 === index
                        ? ` transition-all duration-1000 opacity-100 text-${item.toLowerCase()}-text`
                        : "text-white opacity-50"
                    } text-[30px] mt-1 text-black-sm-contour`}
                  >
                    <>{mythSymbols[item.toLowerCase()]}</>
                  </span>
                </div>
              </div>
            ))}
            <div
              onClick={() => {
                playAudio();
                if (!prev.includes("multiorb")) {
                  setPlaySound(4);
                }
                setClickedOrbs((prev) =>
                  prev.length <= 6 ? [...prev, "multiorb"] : prev
                );
              }}
              className="flex items-center"
            >
              <div
                className={`flex relative text-center ml-1 justify-center ${
                  clickedOrbs.includes("MultiOrb")
                    ? "w-[17vw] glow-icon-lg-white"
                    : "w-[15vw] glow-icon-white"
                } items-center rounded-full `}
              >
                <img src={`${assets.uxui.multiorb}`} alt="orb" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0">
            <CircleCheck
              size={"18vw"}
              color="white"
              onClick={handleKeys}
              className="scale-icon mb-[26vw]"
            />
          </div>
          <div className="absolute bottom-0 text-[14.2vw] text-white text-black-contour font-roboto flex gap-2">
            <div
              className={`${clickedOrbs.length === 0 ? "hidden" : ""} ${
                clickedOrbs.length === 1 ? "scale-point" : ""
              }`}
            >
              *
            </div>
            <div
              className={`${clickedOrbs.length < 2 ? "hidden" : ""} ${
                clickedOrbs.length === 2 ? "scale-point" : ""
              }`}
            >
              *
            </div>
            <div
              className={`${clickedOrbs.length < 3 ? "hidden" : ""} ${
                clickedOrbs.length === 3 ? "scale-point" : ""
              }`}
            >
              *
            </div>
            <div
              className={`${clickedOrbs.length < 4 ? "hidden" : ""} ${
                clickedOrbs.length === 4 ? "scale-point" : ""
              }`}
            >
              *
            </div>
            <div
              className={`${clickedOrbs.length < 5 ? "hidden" : ""} ${
                clickedOrbs.length === 5 ? "scale-point" : ""
              }`}
            >
              *
            </div>
            <div
              className={`${clickedOrbs.length < 6 ? "hidden" : ""} ${
                clickedOrbs.length === 6 ? "scale-point" : ""
              }`}
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
              src={assets.audio[`orb.${elements[playSound - 1]}`]}
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
