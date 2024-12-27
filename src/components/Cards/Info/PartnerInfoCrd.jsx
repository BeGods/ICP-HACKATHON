import React, { useContext } from "react";

import IconBtn from "../../Buttons/IconBtn";
import { MyContext } from "../../../context/context";

const PartnerCard = ({ close, reward }) => {
  const { assets, platform } = useContext(MyContext);

  return (
    <div
      style={{
        backgroundImage: `url(${assets.uxui.info})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        top: 0,
        left: 0,
      }}
      className="flex flex-col rounded-[15px] w-full h-full items-center gap-4 card-shadow-black"
    >
      <div className="flex w-full relative">
        <div className="w-full h-full absolute flex flex-col leading-tight justify-start items-center flex-grow  text-card pt-[10px]">
          <div className="flex flex-col text-center">
            <h1 className="text-paperHead font-bold uppercase">
              {reward.metadata.brandName}
            </h1>
            <h2 className={`-mt-1 text-paperSub font-medium uppercase`}>
              {reward.metadata.brandCategory}
            </h2>
          </div>
          <div className="h-full w-full text-center px-3 pt-2">
            {reward.metadata.howToRedeem.replace(/<\/?p>/g, "")}
          </div>
        </div>
      </div>
      {platform === "ios" ? (
        <IconBtn isInfo={false} activeMyth={4} handleClick={close} align={6} />
      ) : (
        <IconBtn isInfo={false} activeMyth={4} handleClick={close} align={0} />
      )}
    </div>
  );
};

export default PartnerCard;
