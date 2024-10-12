import React, { useContext, useEffect, useRef, useState } from "react";
import { mythSymbols, mythologies, orbSounds } from "../../utils/constants";
import { CircleCheck, CircleX } from "lucide-react";
import ReactHowler from "react-howler";
import { MyContext } from "../../context/context";

const orbPos = [
  "mt-[45vw] mr-[32vw]",
  "-ml-[55vw] -mt-[18vw]",
  "-mt-[45vw] ml-[32vw]",
  "mt-[18vw] ml-[52vw]",
];

const ConvertClaimCard = ({ handleClose, handleSubmit }) => {
  const { enableSound } = useContext(MyContext);
  const [clickedOrbs, setClickedOrbs] = useState([]);
  const [showPlay, setShowPlay] = useState(false);
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

  // fof.orb.water.blue.wav
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
            className="relative flex justify-center items-center w-full h-full"
            style={{
              backgroundImage:
                "url(/assets/uxui/480px-fof.background.aether1.png)",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {" "}
            {mythologies.map((item, index) => (
              <div
                onClick={() => {
                  playAudio();
                  setPlaySound(index);
                  setClickedOrbs((prev) =>
                    prev.includes(item) ? prev : [...prev, item]
                  );
                }}
                key={index}
                className={`absolute ${orbPos[index]}`}
              >
                <div
                  className={`flex relative text-center justify-center ${
                    clickedOrbs.includes(item)
                      ? "w-[12vw] glow-icon-lg-white"
                      : "max-w-orb glow-icon-white"
                  } items-center rounded-full `}
                >
                  <img
                    src="/assets/uxui/240px-orb.base.png"
                    alt="orb"
                    className={`filter-orbs-${item.toLowerCase()}`}
                  />
                  <span
                    className={`absolute z-1 font-symbols ${
                      clickedOrbs.includes(item)
                        ? ` transition-all duration-1000 opacity-100 text-${item.toLowerCase()}-text`
                        : "text-white opacity-50"
                    } text-[30px] mt-1 text-black-sm-contour`}
                  >
                    <>{mythSymbols[item.toLowerCase()]}</>{" "}
                  </span>
                </div>
              </div>
            ))}
            <div
              onClick={() => {
                playAudio();
                if (!prev.includes("MultiOrb")) {
                  setPlaySound(4);
                }
                setClickedOrbs((prev) =>
                  prev.includes("MultiOrb") ? prev : [...prev, "MultiOrb"]
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
                <img src="/assets/uxui/240px-orb.multicolor.png" alt="orb" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 mb-8">
            <CircleCheck
              size={"18vw"}
              color="white"
              onClick={handleKeys}
              className="scale-icon"
            />
          </div>
        </div>
      )}
      <div className="absolute">
        {playSound != 0 && (
          <>
            <ReactHowler
              src={`/assets/audio/fof.orb.${orbSounds[playSound]}.wav`}
              playing={enableSound}
              preload={true}
              ref={howlerRef}
              onEnd={() => setPlaySound(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ConvertClaimCard;
