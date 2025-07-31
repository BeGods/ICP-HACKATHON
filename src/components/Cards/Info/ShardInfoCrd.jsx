import { formatRankOrbs } from "../../../helpers/leaderboard.helper";
import OverlayLayout from "../../Layouts/OverlayLayout";
import { useStore } from "../../../store/useStore";

const ShardInfoCrd = ({ gameData }) => {
  const assets = useStore((s) => s.assets);

  const elementalOrbs = gameData.stats.mythologies.reduce(
    (sum, itm) => sum + itm.shards,
    0
  );
  const updatedOrbs =
    (gameData.stats.whiteShards ?? 0) +
    (gameData.stats.blackShards ?? 0) +
    (elementalOrbs ?? 0);

  return (
    <OverlayLayout customMyth={"other"}>
      <div className="center-section">
        <div
          className={`relative card-width rounded-lg shadow-lg card-shadow-white`}
        >
          <div className="relative w-full h-full text-card">
            <img
              src={assets.uxui.bgInfo}
              alt="info card background"
              className="w-full h-full object-cover rounded-primary z-10"
            />
          </div>
          <div className="absolute top-0 w-full text-center text-card text-paperHead font-bold mt-2 uppercase z-30">
            <h1>SHARD(S)</h1>

            <h2 className={`-mt-[1.5vh] text-paperSub font-medium uppercase`}>
              {formatRankOrbs(updatedOrbs)}
            </h2>
          </div>

          <div
            className={`absolute leading-[18px] text-paperSub text-card inset-0 w-[85%] mx-auto flex gap-[1.5dvh]  flex-col justify-start pt-[32%] font-[550] z-30 `}
          >
            <div className={`flex w-full`}>
              <div className="flex flex-col gap-y-[2.25dvh]  w-full">
                <div className="flex gap-2 items-center mt-[2.25dvh]">
                  <div className="font-symbols text-[2.5rem] text-black text-white-contour">
                    l
                  </div>
                  <div
                    className={`font-fof text-paperHead font-medium transition-all duration-1000 text-card`}
                  >
                    {gameData.stats.blackShards ?? 0}
                  </div>
                </div>
                <div className="flex gap-2 items-center mt-[2.25dvh]">
                  <div className="font-symbols text-[2.5rem] text-white text-black-contour">
                    l
                  </div>
                  <div
                    className={`font-fof text-paperHead font-medium transition-all duration-1000 text-card`}
                  >
                    {gameData.stats.whiteShards ?? 0}
                  </div>
                </div>
                {gameData.stats.mythologies.slice(0, 1).map((myth, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center mt-[2.25dvh]"
                  >
                    <div
                      className={`font-symbols text-[2.5rem]  text-${myth.name.toLowerCase()}-primary  text-black-contour`}
                    >
                      l
                    </div>
                    <div
                      className={`font-fof text-paperHead font-medium transition-all duration-1000 text-card`}
                    >
                      {myth.shards ?? 0}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-y-[2.25dvh] w-full">
                {gameData.stats.mythologies.slice(1, 4).map((myth, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center mt-[2.25dvh]"
                  >
                    <div
                      className={`font-symbols text-[2.5rem]  text-${myth.name.toLowerCase()}-primary  text-black-contour`}
                    >
                      l
                    </div>
                    <div
                      className={`font-fof text-paperHead font-medium transition-all duration-1000 text-card`}
                    >
                      {myth.shards ?? 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OverlayLayout>
  );
};

export default ShardInfoCrd;
