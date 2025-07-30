import React, { useContext, useEffect, useState } from "react";
import { mythSections } from "../../utils/constants.fof";
import { FofContext, MainContext } from "../../context/context";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import MythInfoCard from "../Cards/Info/MythInfoCrd";
import Symbol from "../Common/Symbol";

const tele = window.Telegram?.WebApp;

export const HeadbarToggleLayout = ({ data }) => {
  const { enableHaptic } = useContext(MainContext);

  return (
    <>
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          data[0].handleClick();
        }}
        className="absolute top-0  left-0 w-button-primary slide-header-left flex z-[60]"
      >
        <div className="w-full relative">
          <div
            className={`flex cursor-pointer pr-0.5 justify-end items-center h-button-primary bg-white w-full rounded-r-primary border border-black`}
          >
            <div
              className={`flex font-symbols justify-center items-center bg-black text-white w-[3rem] h-[90%] text-symbol-sm rounded-primary`}
            >
              {data[0].icon}
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          data[1].handleClick();
        }}
        className="absolute top-0 right-0 w-button-primary slide-header-right flex z-[60]"
      >
        <div className="w-full relative">
          <div
            className={`flex  cursor-pointer pl-0.5 justify-start items-center h-button-primary bg-white w-full rounded-l-primary border border-black`}
          >
            <div
              className={`flex font-symbols justify-center items-center bg-black text-white w-[3rem] h-[90%] text-symbol-sm rounded-primary`}
            >
              {data[1].icon}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex text-white text-black-contour px-1 mt-[2.25rem]  w-full font-fof text-secondary uppercase">
        <div className={`mr-auto slide-in-out-left`}>{data[0].label}</div>
        <div className={`ml-auto slide-in-out-right`}>{data[1].label}</div>
      </div>
    </>
  );
};

export const HeaderMythSymbol = () => {
  const { setShowCard, enableHaptic } = useContext(MainContext);
  const { activeMyth } = useContext(FofContext);

  return (
    <div
      onClick={() => {
        handleClickHaptic(tele, enableHaptic);
        setShowCard(
          <MythInfoCard
            close={() => {
              setShowCard(false);
            }}
          />
        );
      }}
      className="flex cursor-pointer absolute justify-center w-full top-0 -mt-2 z-50"
    >
      <div
        className={`h-full flex justify-center items-center z-20 transition-all duration-500`}
      >
        <Symbol myth={mythSections[activeMyth]} isCard={2} />
      </div>
    </div>
  );
};

export const HeadbarLayout = ({ activeMyth, data, addOnEffect }) => {
  const { enableHaptic } = useContext(MainContext);

  return (
    <div className="flex w-full justify-center px-2 top-0 absolute">
      <div className="flex relative w-full max-w-[720px] px-7">
        <div
          className={`flex relative ${
            data[0].borderColor
              ? `border-${data[0].borderColor}`
              : `border-${mythSections[activeMyth]}-primary`
          }  gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black-sm border w-full`}
        >
          <div
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              data[0].handleClick();
            }}
            className={`font-symbols absolute -ml-[1.5rem] z-50 text-iconLg text-black-lg-contour  text-${mythSections[activeMyth]}-text`}
          >
            {data[0].icon}
          </div>
          <div className="flex items-center text-primary font-medium pl-headSides">
            {data[0].value}
          </div>
        </div>
        <div
          className={`flex relative justify-end ${
            data[1].borderColor
              ? `border-${data[1].borderColor}`
              : `border-${mythSections[activeMyth]}-primary`
          } gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black-sm border w-full`}
        >
          <div className="flex text-black-contour items-center text-primary font-medium pr-headSides">
            {data[1].value}
          </div>
          <div
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              data[1].handleClick();
            }}
            className={`font-symbols absolute -mr-[1.5rem] z-50 text-iconLg text-black-contour  text-${mythSections[activeMyth]}-text`}
          >
            {data[1].icon}
          </div>
        </div>
      </div>
      <div className="absolute flex text-white text-black-contour px-1 mt-[60px] w-full font-fof text-secondary uppercase">
        <div className={`mr-auto slide-in-out-left`}>{data[0].label}</div>
        <div className={`ml-auto slide-in-out-right`}>{data[1].label}</div>
      </div>
    </div>
  );
};

export const HeaderCategoryLayout = ({
  category,
  setCategory,
  iconMap,
  categoryCntArr,
}) => {
  const { enableHaptic } = useContext(MainContext);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setFadeOut(false);
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [category]);

  return (
    <div className="flex transition-all duration-500 -mt-[1.3rem] items-center justify-center max-w-[720px] w-[85%] z-50 mx-auto h-button-primary p-0.5 rounded-primary bg-white border border-black shadow">
      {iconMap.map((item, idx) => {
        const isActive = category === idx;

        return (
          <div
            key={idx}
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              setCategory(idx);
            }}
            className={`flex-1 relative flex items-center justify-center rounded-primary gap-x-2 h-full transition-all duration-200 ease-in-out cursor-pointer ${
              isActive ? "bg-black text-white" : "text-black"
            } font-symbols`}
          >
            {item.icon}

            {isActive && (
              <span className="absolute -top-1 -right-1 font-roboto text-[1rem] border border-black font-bold bg-white text-black w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                {categoryCntArr[idx]}
              </span>
            )}
          </div>
        );
      })}
      <div
        className={`font-fof w-full text-center mt-[6.25rem] absolute top-0 text-[4.5dvh] uppercase text-white text-black-contour drop-shadow z-50 ${
          fadeOut ? "disappear" : ""
        }`}
      >
        {iconMap[category].label}
      </div>
    </div>
  );
};

const HeaderLayout = ({
  activeMyth,
  title,
  titleColor,
  CenterChild,
  BottomChild,
  hideContour,
}) => {
  const { assets } = useContext(MainContext);

  return (
    <div className={`absolute w-screen top-0`}>
      {/* <img
        src={assets.uxui.footer}
        alt="paper"
        draggable={false}
        className={`w-full ${
          hideBg && "hidden"
        } absolute top-0 left-0 rotate-180 filter-paper-${
          mythSections[activeMyth]
        }  select-none h-[6rem]`}
      /> */}
      <div className="flex relative flex-col  gap-[5px] pt-headTop mt-10">
        <div
          className={`font-fof w-full text-[4.5dvh] disappear text-center absolute top-0 pt-[7rem] -mt-[12px] glow-icon-${
            mythSections[activeMyth]
          } uppercase text-${titleColor ?? "white"} drop-shadow z-50 ${
            !hideContour && "text-black-contour"
          }`}
        >
          {title}
        </div>
        {CenterChild}
        {BottomChild}
      </div>
    </div>
  );
};

export default HeaderLayout;
