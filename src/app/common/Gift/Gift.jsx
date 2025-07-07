import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/context";
import GiftHeader from "./Header";
import GiftCarousel from "../../../components/Carousel/GiftCarousel";
import TaskCarousel from "../../../components/Carousel/TaskCarousel";
import RewardCarousel from "../../../components/Carousel/RewardCarousel";
import {
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
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
    setShowBack,
  } = useContext(MainContext);
  const [category, setCategory] = useState(1);
  const filteredTasks = tasks.filter((itm) => !itm.isClaimed).length;
  const filteredVouchers = globalRewards.filter((itm) => !itm.isClaimed).length;
  const filteredPayouts = payouts.filter(
    (itm) => !itm.isClaimed && itm.limit > 0
  ).length;
  const categoryCntArr = [filteredVouchers, filteredTasks, filteredPayouts];

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

  useEffect(() => {
    setShowBack(3);

    return () => {
      setShowBack(null);
    };
  }, []);

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
      <GiftHeader
        categoryCntArr={categoryCntArr}
        category={category}
        setCategory={(idx) => setCategory(idx)}
      />
      <div className="relative flex flex-col justify-center items-center my-auto h-1/2 w-full">
        {category == 0 ? (
          <GiftCarousel rewards={globalRewards} />
        ) : category == 1 ? (
          <TaskCarousel quests={tasks} userData={userData} />
        ) : (
          <RewardCarousel rewards={payouts} />
        )}
      </div>
      <>
        <ToggleLeft
          minimize={2}
          handleClick={() => {
            setCategory((prev) => (prev - 1 + 3) % 3);
          }}
          activeMyth={4}
        />
        <ToggleRight
          minimize={2}
          handleClick={() => {
            setCategory((prev) => (prev + 1) % 3);
          }}
          activeMyth={4}
        />
      </>
    </div>
  );
};

export default Gift;
