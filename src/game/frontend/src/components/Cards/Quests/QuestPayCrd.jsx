import React, { useContext, useEffect, useState } from "react";
import Symbol from "../../Common/Symbol";
import MappedOrbs from "../../Common/MappedOrbs";
import { mythSections, mythSymbols } from "../../../utils/constants.fof";
import { FofContext } from "../../../context/context";
import OverlayLayout from "../../Layouts/OverlayLayout";
import { ButtonLayout } from "../../Layouts/ButtonLayout";

function PayCard({ quest, handlePay, activeMyth, handleClaimEffect }) {
  const { gameData, assets, section, setShowBack, setShowCard } =
    useContext(FofContext);
  const [deduct, setDeduct] = useState(false);
  const [scale, setScale] = useState(false);
  const [showNum, setShowNum] = useState(false);
  const [deductedValues, setDeductedValues] = useState({
    ...gameData.mythologies.reduce((acc, item) => {
      acc[item.name] = item.orbs;
      return acc;
    }, {}),
    multiColorOrbs: gameData.multiColorOrbs,
  });
  const filteredOrbsBal = Object.keys(quest.requiredOrbs);

  useEffect(() => {
    if (deduct) {
      const newValues = gameData.mythologies.reduce((acc, item) => {
        acc[item.name] =
          deductedValues[item.name] -
          (quest.requiredOrbs[item.name] ? quest.requiredOrbs[item.name] : 0);
        return acc;
      }, {});

      // Ensure that multiColorOrbs deduction is handled properly
      const requiredMultiOrbs = quest.requiredOrbs.MultiOrbs || 0;
      const updatedMultiColorOrbs =
        deductedValues.multiColorOrbs - requiredMultiOrbs;

      newValues.multiColorOrbs = Math.max(0, updatedMultiColorOrbs);
      setDeductedValues(newValues);
    }
  }, [deduct, gameData.mythologies, quest.requiredOrbs]);

  const handleOperation = async () => {
    const result = await handlePay();
    if (result) {
      setScale(true);
      setTimeout(() => {
        setScale(false);
      }, 500);
      setTimeout(() => {
        setShowNum(true);
        setTimeout(() => {
          setDeduct(true);
          setShowNum(false);
          setTimeout(() => {
            handleClaimEffect();
            setDeduct(false);
          }, 500);
        }, 500);
      }, 500);
    }
  };

  const getDisplayValue = (mythName) => {
    return deductedValues[mythName];
  };
  const getMultiOrbsDisplayValue = () => {
    return deductedValues.multiColorOrbs;
  };

  useEffect(() => {
    setShowBack(section);

    return () => {
      setShowBack(null);
    };
  }, []);

  return (
    <OverlayLayout>
      <div className="flex flex-col absolute pt-gamePanelTop">
        <div className="flex gap-3">
          {filteredOrbsBal.includes("MultiOrb") && (
            <div>
              <div
                className={`flex relative text-center justify-center text-black-sm-contour items-center glow-icon-white} `}
              >
                <img
                  src={assets.items.multiorb}
                  alt="orb"
                  className={`glow-icon-white max-w-orb`}
                />
                <div
                  className={`font-fof text-[28px] font-normal  text-black-sm-contour transition-all duration-1000 ${
                    deduct ? `scale-150` : "text-white"
                  }`}
                >
                  {getMultiOrbsDisplayValue()}
                </div>
              </div>
            </div>
          )}

          {gameData.mythologies
            .filter((itm) => filteredOrbsBal.includes(itm.name))
            .map((item, index) => (
              <div key={index} className="flex gap-1 items-center">
                <div
                  className={`flex relative text-center justify-center max-w-orb items-center rounded-full glow-icon-${item.name?.toLowerCase()}`}
                >
                  <img
                    src={assets.uxui.baseOrb}
                    alt="orb"
                    className={`filter-orbs-${item.name?.toLowerCase()}`}
                  />
                  <span
                    className={`absolute z-1 font-symbols  text-symbol-sm mt-1 text-black-sm-contour transition-all duration-1000 ${
                      scale
                        ? `transform scale-150 transition-transform duration-1000 opacity-100 text-${item.name?.toLowerCase()}-text`
                        : "text-white opacity-50"
                    }`}
                  >
                    <>{mythSymbols[item.name?.toLowerCase()]}</>
                  </span>
                </div>
                <div
                  className={`font-fof text-[28px] font-normal  text-black-sm-contour transition-all duration-1000 ${
                    deduct
                      ? `text-${item.name?.toLowerCase()}-text scale-150`
                      : "text-white"
                  }`}
                >
                  {getDisplayValue(item?.name)}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="center-section">
        <div
          className={`relative card-width  rounded-lg shadow-lg  flex flex-col z-50`}
        >
          <div className="relative">
            <div className="absolute  bg-black h-full w-full z-10 opacity-50 rounded-xl"></div>
            <img
              src={assets.questCards?.[mythSections[activeMyth]]?.[quest?.type]}
              alt="card"
              className="w-full h-full mx-auto grayscale rounded-[15px]"
            />
            <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
              <div className="flex w-full">
                <div className="m-2 z-50">
                  <MappedOrbs quest={quest} showNum={scale} />
                </div>
              </div>
              <div
                className={`flex relative items-center h-[19%] uppercase card-shadow-white-${mythSections[activeMyth]} text-white grayscale`}
              >
                <div
                  style={{
                    backgroundImage: `url(${assets.uxui.footer})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                  }}
                  className={`filter-paper-${mythSections[activeMyth]} rounded-b-[15px]`}
                />
                <div
                  className={`flex justify-between w-full h-full items-center glow-text-quest px-3 z-10`}
                >
                  <div>{quest?.questName}</div>
                  <div className="">
                    <Symbol myth={mythSections[activeMyth]} isCard={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute flex justify-center w-full bottom-0 mb-safeBottom">
        <ButtonLayout mode="default" onClick={handleOperation} />
      </div>
    </OverlayLayout>
  );
}

export default PayCard;
