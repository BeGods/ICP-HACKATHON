import React, { useContext, useState } from "react";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { MainContext } from "../../context/context";
import CharacterCrd from "../Cards/Relics/CharacterCrd";
import { GridItemEmpty } from "./GridItem";

const tele = window.Telegram?.WebApp;

export const CardWrap = ({
  Front,
  Back,
  handleClick,
  isPacket,
  disableFlip,
}) => {
  const { enableHaptic } = useContext(MainContext);
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={{
        perspective: "1000px",
      }}
      onClick={() => {
        if (!isPacket) {
          handleClickHaptic(tele, enableHaptic);
          if (!disableFlip) {
            setFlipped((prev) => !prev);
          }
          if (typeof handleClick == "function") {
            handleClick();
          }
        }
      }}
      className={`relative ${
        isPacket ? "packet-width" : "card-width"
      } flex flex-col justify-center items-center`}
    >
      <div className={`card ${flipped ? "flipped" : ""}`}>
        <div className="card__face card__face--front relative">{Front}</div>
        <div className="card__face card__face--back">{Back}</div>
      </div>
      {isPacket && (
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            if (!disableFlip) {
              setFlipped((prev) => !prev);
            }
            if (typeof handleClick == "function") {
              handleClick();
            }
          }}
          className={`absolute flex justify-end w-full h-full z-[99]`}
        ></div>
      )}
    </div>
  );
};

export const GridOpenItem = ({ src }) => {
  return (
    <div className="flex flex-grow relative flex-col justify-center items-center h-full w-full">
      <div className="flex justify-center relative">
        <img src={src} alt="box" className={`glow-text-white w-item`} />
      </div>
    </div>
  );
};

export const GridWrap = ({ children }) => {
  const { assets } = useContext(MainContext);

  return (
    <div className="center-section-grid z-50">
      <div className={`grid-section h-full  w-full`}>
        <div
          className="absolute inset-0 rounded-md z-0"
          style={{
            backgroundImage: `url(${assets.uxui.baseBgA})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            opacity: 0.5,
          }}
        />
        {children}
      </div>
    </div>
  );
};

export const SecondaryFooter = ({
  children,
  items,
  id,
  isGrid,
  isItem,
  dropRef,
  src,
  handleItemClick,
}) => {
  return (
    <div className="h-full w-full z-0">
      {!isGrid && (
        <div className="center-section">
          {isItem ? (
            <div
              onClick={handleItemClick}
              className={`flex select-none justify-center items-center card-shadow-white`}
            >
              <img
                src={src}
                alt="info background"
                className="w-full h-full object-cover rounded-primary"
              />
            </div>
          ) : (
            <CharacterCrd id={id} />
          )}
        </div>
      )}
      {children ? (
        <div className="bottom-section-grid">
          <div className={`grid-section-expanded h-fit`}>{children}</div>
        </div>
      ) : (
        <div className="bottom-section-grid">
          <div className={`grid-section-expanded h-fit`}>
            {items.map((itm, index) => (
              <GridItemEmpty
                key={`placeholder-${index}`}
                handleClick={itm.handleClick}
                idx={index}
                dropRef={
                  itm.disable || !Array.isArray(dropRef) ? null : dropRef[index]
                }
                icon={itm.icon}
                label={itm.label}
                border={itm.border}
                disable={itm.disable}
                isHighlighted={itm.isHighlighted}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
