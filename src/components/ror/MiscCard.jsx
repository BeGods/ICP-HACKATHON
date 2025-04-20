import React, { useContext } from "react";
import { RorContext } from "../../context/context";
import IconBtn from "../Buttons/IconBtn";

const MiscCard = ({ Button, img, icon }) => {
  const { assets, setShowCard, section } = useContext(RorContext);
  return (
    <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
      <div className="relative w-[72%] h-[55%] mt-[70px]  flex items-center justify-center rounded-primary card-shadow-white">
        <div
          className={`absolute inset-0 rounded-[15px]`}
          style={{
            backgroundImage: `${`url(${img ?? assets.boosters.burstCard})`}`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center ",
          }}
        />
        <IconBtn
          isInfo={false}
          activeMyth={4}
          handleClick={() => {
            setShowCard(null);
          }}
          align={0}
        />
        <div className="relative h-full w-full flex flex-col items-center">
          <div className="flex relative flex-col justify-center items-center h-full w-full">
            <div
              className={`flex relative  mt-auto items-center h-[19%] w-full`}
            >
              <div
                style={{
                  backgroundImage: `url(${assets.uxui.paper})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
                className={`rounded-b-primary`}
              />

              <div
                className={`flex justify-center text-[60px] text-white text-black-contour w-full h-full items-center px-3 z-10 font-symbols`}
              >
                {icon ?? "a"}
              </div>
            </div>
          </div>
        </div>
      </div>
      {Button}
    </div>
  );
};

export default MiscCard;
