import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/context";
import GiftHeader from "./Header";
import GiftCarousel from "../../../components/Carousel/GiftCarousel";
import TaskCarousel from "../../../components/Carousel/TaskCarousel";
import RewardCarousel from "../../../components/Carousel/RewardCarousel";
// import { socket } from "../../../utils/socket";

const Gift = () => {
  const {
    globalRewards,
    payouts,
    setPayouts,
    assets,
    tasks,
    userData,
    isTgMobile,
  } = useContext(MainContext);
  const [category, setCategory] = useState(1);

  // useEffect(() => {
  //   if (!socket.connected) socket.connect();

  //   socket.on("connect", () => {
  //     console.log("Connected to socket server");
  //   });

  //   socket.on("reward_limit_updated", ({ rewardId, newLimit }) => {
  //     setPayouts((prevPayouts) =>
  //       prevPayouts.map((payout) =>
  //         payout.id === rewardId
  //           ? { ...payout, limit: newLimit ?? payout.limit }
  //           : payout
  //       )
  //     );
  //   });

  //   return () => {
  //     socket.off("reward_limit_updated");
  //   };
  // }, []);

  return (
    <div
      className={`flex flex-col ${
        isTgMobile ? "tg-container-height" : "browser-container-height"
      } overflow-hidden m-0`}
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
            backgroundImage: `url(${assets.uxui.baseBgA})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <GiftHeader category={category} setCategory={(idx) => setCategory(idx)} />
      <div className="flex flex-col justify-center items-center absolute h-full w-full bottom-0 px-2.5">
        <div className="flex w-[75%] flex-col gap-y-[15px]">
          {category == 0 ? (
            <GiftCarousel rewards={globalRewards} />
          ) : category == 1 ? (
            <TaskCarousel quests={tasks} userData={userData} />
          ) : (
            <RewardCarousel rewards={payouts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Gift;
