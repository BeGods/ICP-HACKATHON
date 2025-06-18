import { useCallback, useState } from "react";

export const useOpenAd = ({ zoneId, publisherId, callReward }) => {
  const [isReady, setIsReady] = useState(false);
  const [adStatus, setAdStatus] = useState("idle");

  const loadAd = useCallback(async () => {
    setAdStatus("loading");

    if (!window.OpenADLineJsSDK) {
      console.warn("❌ OpenAD SDK is missing");
      setAdStatus("error");
      return;
    }

    const adInfo = { zoneId, publisherId, eventId: 0 };

    const adParams = {
      web: {
        type: "web",
        isFullscreen: true, // optional
      },
    };

    const userInfo = {}; // You can add userId/displayName if needed

    try {
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

      // ✅ Immediately trigger the ad render after init
      sdk.interactive.getRender({ adInfo, cb: callbackFunc });
    } catch (err) {
      console.error("❌ Error during ad loading", err);
      setAdStatus("error");
    }
  }, [zoneId, publisherId, callReward]);

  return { loadAd, isReady, adStatus };
};
