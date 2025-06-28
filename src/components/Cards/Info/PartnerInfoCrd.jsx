import React, { useContext } from "react";
import IconBtn from "../../Buttons/IconBtn";
import { MainContext } from "../../../context/context";
import { extractBotName, formatDate } from "../../../helpers/game.helper";

const PartnerCard = ({ close, reward }) => {
  const { assets, platform, isTgMobile } = useContext(MainContext);

  return (
    <div
      style={{
        backgroundImage: `url(${assets.uxui.bgInfo})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        top: 0,
        left: 0,
      }}
      className="flex flex-col rounded-[15px] w-full h-[90%] items-center gap-4 card-shadow-black"
    >
      <div className="flex w-full relative">
        <div className="w-full h-full absolute flex flex-col leading-tight justify-start items-center flex-grow  text-card pt-[10px]">
          <div className="flex flex-col text-center">
            <h1 className="text-paperHead font-bold uppercase">
              {reward.metadata.brandName}
            </h1>
            <h2 className={`-mt-1 text-paperSub font-medium uppercase`}>
              GAME
            </h2>
          </div>
          <div className="flex flex-col gap-3 h-full w-full text-center px-3 pt-2">
            {/* {reward.metadata.howToRedeem.replace(/<\/?p>/g, "")} */}
            <h1>{reward.description}</h1>
            <h1>{reward.metadata.campaignDetails}</h1>
            <div className="w-full text-center text-wrap">
              <h1
                className="mt-3 font-semibold break-words overflow-wrap-normal"
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              >
                {extractBotName(reward.metadata.brandRedirectionLink)}
              </h1>
            </div>
            {/* <h1
              dangerouslySetInnerHTML={{
                __html: reward.metadata.brandRedirectionLink,
              }}
            ></h1> */}
          </div>
        </div>
      </div>

      <IconBtn
        isJigsaw={true}
        isInfo={false}
        isFlip={true}
        activeMyth={4}
        handleClick={close}
        align={7}
      />

      <div
        className={`absolute font-semibold italic ${
          isTgMobile ? "bottom-0" : "bottom-6"
        } text-para leading-para text-card mx-auto px-2 py-1`}
      >
        {formatDate(reward.endDate)}
      </div>
    </div>
  );
};

export default PartnerCard;
