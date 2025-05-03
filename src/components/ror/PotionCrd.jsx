import React, { useContext, useState } from "react";
import { RorContext } from "../../context/context";
import IconBtn from "../Buttons/IconBtn";
import { elementMythNames, mythElementNames } from "../../utils/constants.ror";
import PotionBtn from "./PotionBtn";

const PotionCard = ({ potion }) => {
  const { assets, setShowCard, gameData, isTelegram } = useContext(RorContext);
  const [stage, setStage] = useState(false);
  const element = potion?.split(".")[1];
  const mythology = elementMythNames[element]?.toLowerCase();

  const cardHeight = isTelegram ? "h-[47vh] mt-[4.5vh]" : "h-[50dvh] mt-[2vh]";

  return (
    <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
      {!stage ? (
        <div className="flex flex-col absolute bottom-2 items-center ">
          <div className="flex mb-2 gap-x-3">
            <div
              className={`flex relative text-center justify-center text-black-sm-contour items-center glow-icon-white`}
            >
              <img
                src={`https://media.publit.io/file/BeGods/items/240px-shard.white.png`}
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
                src={`https://media.publit.io/file/BeGods/items/240px-shard.black.png`}
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
                    src={`https://media.publit.io/file/BeGods/items/240px-shard.${mythElementNames[
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
                src={`https://media.publit.io/file/BeGods/items/240px-gobcoin.png`}
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

      <div className="relative w-[72%] h-[57%] card-shadow-white rounded-lg shadow-lg flex flex-col z-50">
        <div className={`card  ${cardHeight} `}>
          <div className="card__face card__face--front relative flex justify-center items-center">
            <div
              className={`absolute inset-0 bg-cover bg-center filter-${mythology} rounded-primary z-0`}
              style={{ backgroundImage: `url(${assets.uxui.basebg})` }}
            />

            <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
              <div className="relative m-2 flex justify-center items-center w-[50px]">
                <img
                  src={`https://media.publit.io/file/BeGods/items/240px-gobcoin.png`}
                  alt="relic"
                  className="w-full"
                />
                <div
                  className="absolute text-num font-roboto font-bold text-shadow grayscale"
                  style={{
                    backgroundImage: "url('/assets/metal.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  1
                </div>
              </div>
              <div className="relative w-[240px] h-[240px] flex justify-center items-center">
                <div className="relative w-full h-full">
                  <img
                    src={`https://media.publit.io/file/BeGods/items/240px-${potion}.png`}
                    alt="relic"
                    className="z-10 w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="relative w-full h-[19%] mt-auto card-shadow-white z-10">
                <div
                  className={`absolute inset-0 bg-cover bg-center bg-no-repeat rounded-b-primary filter-paper-${mythology}`}
                  style={{ backgroundImage: `url(${assets.uxui.paper})` }}
                />
                <div className="absolute text-[50px] font-symbols flex justify-center items-center w-full h-full">
                  v
                </div>
              </div>
            </div>
            <IconBtn
              isInfo={false}
              activeMyth={4}
              handleClick={() => {
                setShowCard(null);
              }}
              align={0}
            />
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
