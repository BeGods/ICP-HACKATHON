import React, { useContext, useState } from "react";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { MainContext } from "../../context/context";

const tele = window.Telegram?.WebApp;

export const CardWrap = ({ Front, Back, handleClick, isPacket }) => {
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
          setFlipped((prev) => !prev);
          handleClick();
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
            setFlipped((prev) => !prev);
            handleClick();
          }}
          className={`absolute flex justify-end w-full h-full z-[99]`}
        ></div>
      )}
    </div>
  );
};
