import { useCallback, useState } from "react";

export const useOpenAd = ({ zoneId, publisherId, callReward }) => {
  const [isReady, setIsReady] = useState(false);
  const [adStatus, setAdStatus] = useState("idle");

  const loadAd = useCallback(async () => {
    setAdStatus("loading");

    const liffId = import.meta.env.VITE_LINE_ID;

    if (!window.OpenADLineJsSDK || !window.liff) {
      console.warn("❌ Missing OpenAD SDK or LIFF");
      setAdStatus("error");
      return;
    }

    try {
      if (!window.liff.isLoggedIn()) {
        console.warn("❌ User not logged in to LINE");
        setAdStatus("error");
        return;
      }

      const profile = await window.liff.getProfile(); // ⬅️ important!
      const userInfo = {
        userId: profile.userId,
        displayName: profile.displayName,
      };

      const adInfo = { zoneId, publisherId, eventId: 0 };
      const adParams = {
        line: {
          type: "LMA",
          liffId,
          prototype: window.liff,
          isFullscreen: true,
        },
        wallet: {
          type: "eth",
          provider: null,
          components: "",
        },
      };

      const sdk = window.OpenADLineJsSDK;
      const result = await sdk.interactive.init({ adInfo, adParams, userInfo });

      if (!result || result.code !== 0) {
        console.warn("❌ Ad init failed:", result);
        setIsReady(false);
        setAdStatus("notAvailable");
        return;
      }

      setIsReady(true);

      const callbackFunc = {
        onAdResourceLoad: (e) => console.log("✅ Ad resource loaded:", e),
        onAdOpening: (e) => console.log("Ad opening:", e),
        onAdOpened: (e) => console.log("Ad opened:", e),
        onAdTaskFinished: (e) => console.log("🎯 Ad task finished:", e),
        onAdClosing: (e) => console.log("Ad closing:", e),
        onAdClick: (e) => console.log("🖱️ Ad clicked:", e),
        onAdClosed: (e) => {
          console.log("🎬 Ad closed with status:", e);
          setAdStatus(e);
          if (e === "view" || e === "click") callReward();
        },
      };

      sdk.interactive.getRender({ adInfo, cb: callbackFunc });
    } catch (err) {
      console.error("❌ Error during ad loading", err);
      setAdStatus("error");
    }
  }, [zoneId, publisherId, callReward]);

  return { loadAd, isReady, adStatus };
};
