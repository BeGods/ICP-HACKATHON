import React, { useContext, useState } from "react";
import Symbol from "../../Common/Symbol";
import MappedOrbs from "../../Common/MappedOrbs";
import IconButton from "../../Buttons/IconButton";
import { mythSections, mythSymbols } from "../../../utils/variables";
import Button from "../../Buttons/Button";
import { MyContext } from "../../../context/context";

function PayCard({ t, quest, handleShowPay, handlePay, activeMyth }) {
  const { gameData } = useContext(MyContext);
  const [deduct, setDeduct] = useState(false);
  const [scale, setScale] = useState(false);

  const handleOperation = async () => {
    setScale(true);
    setTimeout(() => {
      setDeduct(true);
      setScale(false);
    }, 1000);
    await handlePay();
  };

  return (
    <div className="fixed inset-0  bg-black bg-opacity-60  backdrop-blur-sm flex  flex-col justify-center items-center z-50">
      <div className="flex gap-3 absolute bottom-5">
        {gameData.mythologies.map((item, index) => (
          <div key={index} className="flex gap-1 items-center">
            <div
              className={`flex relative text-center justify-center max-w-orb items-center rounded-full glow-icon-${item.name.toLowerCase()}`}
            >
              <img
                src="/assets/uxui/240px-orb.base.png"
                alt="orb"
                className={`filter-orbs-${item.name.toLowerCase()}`}
              />
              <span
                className={`absolute z-1 font-symbols text-white text-[40px] mt-0.5 ml-1 opacity-50 orb-symbol-shadow ${
                  scale
                    ? "transform scale-125 transition-transform duration-1000"
                    : ""
                }`}
              >
                <>{mythSymbols[item.name.toLowerCase()]}</>
              </span>
            </div>
            <div
              className={`font-fof text-primary font-normal text-white glow-myth-${item.name.toLowerCase()} ${
                scale
                  ? "transform scale-125 transition-transform duration-1000"
                  : ""
              }`}
            >
              {deduct ? (
                <>
                  {item.orbs -
                    (quest.requiredOrbs[item.name]
                      ? quest.requiredOrbs[item.name]
                      : 0)}
                </>
              ) : (
                <>{item.orbs}</>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="relative w-[72%] rounded-lg shadow-lg mt-[70px] flex flex-col z-50">
        <div className="relative card-shadow-white">
          <div className="absolute  bg-black h-full w-full z-10 opacity-50 rounded-xl"></div>
          {/* Card Image */}
          <img
            src={`/assets/cards/320px-${mythSections[activeMyth]}.quest.${quest?.type}.jpg`}
            alt="card"
            className="w-full h-full mx-auto grayscale rounded-[15px]"
          />
          {/* Close Button */}
          <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
            <div className="flex w-full">
              <div className="m-2 z-50">
                <MappedOrbs quest={quest} />
              </div>
              <IconButton
                isInfo={false}
                activeMyth={activeMyth}
                handleClick={handleShowPay}
                align={1}
              />
            </div>
            <div
              className={`flex relative items-center h-[19%] uppercase card-shadow-white-${mythSections[activeMyth]} text-white grayscale`}
            >
              <div
                style={{
                  backgroundImage: `url(/assets/uxui/fof.footer.paper.png)`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
                className={`filter-paper-${mythSections[activeMyth]}  rounded-b-[15px]`}
              />
              <div
                className={`flex justify-between w-full h-full items-center glow-text-quest px-3 z-10`}
              >
                <div>{quest?.questName}</div>
                <div className="">
                  <Symbol myth={mythSections[activeMyth]} isCard={true} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <Button
          handleClick={handleOperation}
          message={t(`buttons.pay`)}
          activeMyth={activeMyth}
        />
      </div>
    </div>
  );
}

export default PayCard;
