import React, { useContext, useState } from "react";
import { RorContext } from "../../context/context";
import IconBtn from "../Buttons/IconBtn";
import { mythElementNames } from "../../utils/constants.ror";
import PotionBtn from "./PotionBtn";

const PotionCard = ({ potion }) => {
  const { assets, setShowCard, gameData } = useContext(RorContext);
  const [stage, setStage] = useState(false);

  return (
    <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
      {!stage ? (
        <div className="flex flex-col absolute bottom-2 items-center ">
          <div className="flex mb-2 gap-x-3">
            <div
              className={`flex relative text-center justify-center text-black-sm-contour items-center glow-icon-white`}
            >
              <img
                src={`/assets/ror-cards/240px-shard.aether.white.png`}
                alt="shards"
                className=" max-w-orb "
              />
              <div
                className={`font-fof text-[28px] font-normal  text-black-sm-contour transition-all duration-1000 text-white`}
              >
                {gameData.stats.whiteShards}
              </div>
            </div>
            <div
              className={`flex relative text-center justify-center text-black-sm-contour items-center glow-icon-white`}
            >
              <img
                src={`/assets/ror-cards/240px-shard.aether.black.png`}
                alt="shards"
                className=" max-w-orb "
              />
              <div
                className={`font-fof text-[28px] font-normal  text-black-sm-contour transition-all duration-1000 text-white`}
              >
                {gameData.stats.blackShards}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {gameData.stats.mythologies.map((item, index) => (
              <div key={index} className="flex gap-1 items-center">
                <div
                  className={`flex relative text-center justify-center max-w-orb items-center rounded-full glow-icon-${item.name?.toLowerCase()}`}
                >
                  <img
                    src={`/assets/ror-cards/240px-shard.${mythElementNames[
                      item.name
                    ]?.toLowerCase()}.png`}
                    alt="shards"
                  />
                </div>
                <div
                  className={`font-fof text-[28px] font-normal  text-black-sm-contour transition-all duration-1000 text-white`}
                >
                  {item.shards}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col absolute bottom-2 items-center ">
          <div className="flex mb-2">
            <div
              className={`flex relative text-center justify-center text-black-sm-contour items-center glow-icon-white`}
            >
              <img
                src={`/assets/240px-gobcoin.png`}
                alt="shards"
                className=" max-w-orb"
              />
              <div
                className={`font-fof ml-2 text-[28px] font-normal  text-black-sm-contour transition-all duration-1000 text-white`}
              >
                {gameData.stats.gobcoin}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-[72%] h-[55%]  flex items-center justify-center rounded-primary card-shadow-white">
        <div
          className={`absolute inset-0 rounded-[15px]`}
          style={{
            backgroundImage: `${`url(/assets/320px-gemologist.jpeg)`}`,
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
                className={`flex justify-center text-white text-black-contour w-full h-full items-center  z-10 font-symbols`}
              >
                <img
                  src={`/assets/ror-cards/240px-${potion}_on.png`}
                  alt="potion"
                  className="w-[14vw]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PotionBtn
        stage={stage}
        potion={potion}
        showGobCoin={() => {
          setStage(true);
        }}
      />
    </div>
  );
};

export default PotionCard;
