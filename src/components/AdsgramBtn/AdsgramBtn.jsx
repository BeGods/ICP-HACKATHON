import React, { useCallback } from "react";
import { useAdsgram } from "../../hooks/Adsgram";

export const BoosterAdsBtn = (props) => {
  const onReward = useCallback(() => {
    alert("Reward");
  }, []);
  const onError = useCallback((result) => {
    alert(JSON.stringify(result, null, 4));
  }, []);

  const showAd = useAdsgram({
    blockId: "int-6256",
    debug: true,
    onReward,
    onError,
  });

  return (
    <button
      className="bg-white text-black w-[8vw] h-[6vw]"
      onClick={() => {
        console.log("Hello");

        showAd();
      }}
    >
      Show Ad
    </button>
  );
};
