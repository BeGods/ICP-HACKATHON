import React from "react";
import Symbol from "../../Common/Symbol";
import { mythSections } from "../../../utils/variables";
import ShareButton from "../../Buttons/ShareButton";
import IconButton from "../../Buttons/IconButton";
import MappedOrbs from "../../Common/MappedOrbs";

function OrbClaimCard({
  t,
  quest,
  handleOrbClaimReward,
  handleShowClaim,
  activeMyth,
}) {
  return (
    <div className="fixed inset-0  bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative w-[72%] rounded-lg shadow-lg mt-[70px] flex flex-col z-50">
        <div className="relative glow-card">
          {/* Card Image */}
          <img
            src={`/assets/cards/320px-${mythSections[activeMyth]}.quest.${quest?.type}.jpg`}
            alt="card"
            className="w-full h-full mx-auto rounded-[15px]"
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
                handleClick={handleShowClaim}
                align={1}
              />
            </div>
            <div
              className={`flex relative items-center h-[19%] uppercase glow-card-${mythSections[activeMyth]} text-white`}
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
                className={`filter-paper-${mythSections[activeMyth]} rounded-b-[15px]`}
              />
              <div
                className={`flex justify-between w-full h-full items-center glow-quest px-3 z-10`}
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
        <ShareButton
          isShared={false}
          isInfo={false}
          handleClaim={handleOrbClaimReward}
          activeMyth={activeMyth}
          t={t}
        />
      </div>
    </div>
  );
}

export default OrbClaimCard;
