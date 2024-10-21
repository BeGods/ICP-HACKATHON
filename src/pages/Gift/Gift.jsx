import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import GiftHeader from "./Header";
import GiftItemCrd from "../../components/Cards/Reward/GiftItemCrd";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";

const Gift = (props) => {
  const { rewards } = useContext(MyContext);
  const [currState, setCurrState] = useState(0);
  const [showToggles, setShowToggles] = useState(false);
  const totalSections = Math.ceil(rewards.length / 3);

  useEffect(() => {
    setTimeout(() => {
      setShowToggles(true);
    }, 300);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
      }}
      className="flex flex-col h-screen overflow-hidden m-0"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        className="background-wrapper"
      >
        <div
          className={`absolute top-0 left-0 h-full w-full filter-other`}
          style={{
            backgroundImage: `url(/assets/uxui/1280px-fof.base.background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <GiftHeader partners={rewards.length} />
      <div className="flex flex-col justify-center items-center absolute h-full w-full bottom-0 px-2.5">
        <div className="flex w-[75%] flex-col gap-y-[15px]">
          {rewards.slice(currState, currState + 3).map((item) => {
            return <GiftItemCrd key={item.id} item={item} />;
          })}
        </div>
      </div>

      <div className="flex absolute bottom-[15%] pb-6 gap-3 justify-center items-center pt-5 w-full">
        {Array.from({ length: totalSections }, (_, index) => (
          <div
            onClick={() => {
              setCurrState(index * 3);
            }}
            key={index}
            className={`h-3.5 w-3.5 ${
              Math.floor(currState / 3) === index
                ? "bg-white"
                : "border border-white"
            } rounded-full`}
          ></div>
        ))}
      </div>

      {/* Toggles */}
      {showToggles && (
        <>
          <ToggleLeft
            minimize={2}
            handleClick={() => {
              setCurrState((prev) => {
                const newState = prev - 3;
                return newState < 0 ? (totalSections - 1) * 3 : newState;
              });
            }}
            activeMyth={4}
          />
          <ToggleRight
            minimize={2}
            handleClick={() => {
              setCurrState((prev) => {
                const newState = prev + 3;
                return newState >= rewards.length ? 0 : newState;
              });
            }}
            activeMyth={4}
          />
        </>
      )}
    </div>
  );
};

export default Gift;
