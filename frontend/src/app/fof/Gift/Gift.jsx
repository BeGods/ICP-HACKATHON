import React, { useContext, useEffect, useRef, useState } from "react";
import { FofContext } from "../../../context/context";
import GiftHeader from "./Header";
import {
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import GiftCarousel from "../../../components/Carousel/GiftCarousel";
import { trackComponentView } from "../../../utils/ga";

const Gift = () => {
  const { rewards, assets, setSection } = useContext(FofContext);
  const [showToggles, setShowToggles] = useState(false);
  // const adsgramId = import.meta.env.VITE_AD_GIFT_CLAIM;

  useEffect(() => {
    trackComponentView("gifts");
    setTimeout(() => {
      setShowToggles(true);
    }, 300);
  }, []);

  // const onReward = async () => {
  //   const lastValue = await validateGiftAdStatus(tele);
  //   setGiftAdStatus(tele, lastValue + 1);
  // };

  // const showAd = callAdsgram({
  //   blockId: adsgramId,
  //   onReward,
  // });

  // const checkGiftAdCookie = async () => {
  //   const lastValue = await validateGiftAdStatus(tele);

  //   // not even
  //   if (lastValue % 2 !== 0) {
  //     showAd();
  //   } else {
  //     setGiftAdStatus(tele, lastValue + 1);
  //   }
  // };

  // useEffect(() => {
  //   checkGiftAdCookie();
  // }, []);

  return (
    <div
      style={{
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
      className="flex flex-col overflow-hidden m-0"
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
            backgroundImage: `url(${assets.uxui.basebg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <GiftHeader partners={rewards.length} />
      <div className="flex flex-col justify-center items-center absolute h-full w-full bottom-0 px-2.5">
        <div className="flex w-[75%] flex-col gap-y-[15px]">
          <GiftCarousel rewards={rewards} />
        </div>
      </div>

      {/* Toggles */}
      {showToggles && (
        <>
          <ToggleLeft
            minimize={2}
            handleClick={() => {
              setSection(3);
            }}
            activeMyth={4}
          />
          <ToggleRight
            minimize={2}
            handleClick={() => {
              setSection(3);
            }}
            activeMyth={4}
          />
        </>
      )}
    </div>
  );
};

export default Gift;
