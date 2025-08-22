import { useEffect, useState } from "react";
import OverlayLayout from "../../Layouts/OverlayLayout";
import Confetti from "react-confetti";
import { CardWrap } from "../../Layouts/Wrapper";
import { useStore } from "../../../store/useStore";
import { mythSections, mythSymbols } from "../../../utils/constants.fof";

const BattleResultCrd = ({
  status,
  updatedXP = {},
  orbRewards = {},
  data,
  endBattle,
}) => {
  const myth = data.myth;
  const assets = useStore((c) => c.assets);
  const mythIdx = mythSections.indexOf(data.myth);
  const [attack, setAttack] = useState(data.attack);
  const [defense, setDefense] = useState(data.defense);
  const [highlight, setHighlight] = useState({ attack: false, defense: false });
  const [showConfetti, setShowConfetti] = useState(false);
  const [imgError, setImgError] = useState(false);
  const parts = data?.cardId.split(".");
  const type = parts[1];
  const code = parts[2];

  const animateValue = (from, to, setter, onDone) => {
    const duration = 800;
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(from + (to - from) * progress);
      setter(value);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        onDone?.();
      }
    };

    requestAnimationFrame(step);
  };

  const handleUpdateValue = () => {
    if (typeof updatedXP.attack === "number") {
      const final = data.attack + updatedXP.attack;
      setHighlight((h) => ({ ...h, attack: true }));

      animateValue(data.attack, final, setAttack, () =>
        setHighlight((h) => ({ ...h, attack: false }))
      );
    } else {
      setAttack(data.attack);
    }

    if (typeof updatedXP.defense === "number") {
      const final = data.defense + updatedXP.defense;
      setHighlight((h) => ({ ...h, defense: true }));

      animateValue(data.defense, final, setDefense, () =>
        setHighlight((h) => ({ ...h, defense: false }))
      );
    } else {
      setDefense(data.defense);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleUpdateValue();
    }, 1000);
  }, [updatedXP, data]);

  useEffect(() => {
    setShowConfetti(true);

    const timer = setTimeout(() => setShowConfetti(false), 9000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <OverlayLayout handleBack={endBattle} customMyth={mythIdx}>
      <div className="bonus-heading-text pt-gamePanelTop">
        {status === 1 ? "Won" : status === 2 ? "Lost" : "Draw"}
      </div>

      <div className="center-section">
        <div
          className={`relative card-width ${
            status !== 1 && "grayscale"
          } rounded-lg shadow-lg flex flex-col z-50`}
        >
          <CardWrap
            Front={
              <div className="card-shadow-black">
                {!imgError ? (
                  <img
                    src={`/assets/chars/240px-${data?.cardId}.png`}
                    alt="active card"
                    className="slot-image"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div
                    className={`placeholder-card card-width flex items-center justify-center bg-${myth}-primary text-black rounded-md w-full h-full`}
                  >
                    {type} <br />
                    {code}
                  </div>
                )}
                <div className="flex text-xl mt-1 justify-between w-full">
                  <div
                    className={`transition-all duration-500 ${
                      highlight.attack
                        ? `scale-150 text-${myth}-primary`
                        : "text-white"
                    } text-black-contour`}
                  >
                    A: {attack}
                  </div>
                  <div
                    className={`transition-all duration-500 ${
                      highlight.defense
                        ? `scale-150 text-${myth}-primary`
                        : "text-white"
                    } text-black-contour`}
                  >
                    D: {defense}
                  </div>
                </div>
              </div>
            }
            Back={
              <img
                src={"/assets/chars/240px-celtic.char.C06.png"}
                alt="card"
                className="w-full h-full mx-auto rounded-[15px]"
              />
            }
          />
        </div>
      </div>

      {status == 1 && orbRewards && Object.keys(orbRewards).length > 0 && (
        <div className="absolute flex justify-center w-full bottom-0 mb-safeBottom">
          {Object.entries(orbRewards).map(([key, value], index) => (
            <div key={index} className="flex gap-x-2 items-center">
              <div
                className={`flex relative text-center justify-center max-w-xs-orb items-center rounded-full glow-icon-${key}`}
              >
                <img
                  src={assets.uxui.baseOrb}
                  alt="orb"
                  className={`filter-orbs-${key}`}
                />
                <span className="absolute z-1 font-symbols text-symbol-sm mt-1 text-black-sm-contour text-white opacity-70">
                  {mythSymbols[key]}
                </span>
              </div>
              <div className="font-fof text-[28px] font-normal text-black-sm-contour text-white">
                {value}
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 10, position: "fixed", top: 0, left: 0 }}
        />
      )}
    </OverlayLayout>
  );
};

export default BattleResultCrd;
