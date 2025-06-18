import { useCallback, useRef, useState } from "react";

export const useOpenAd = ({
  zoneId,
  publisherId,
  userId,
  displayName,
  callReward,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [adStatus, setAdStatus] = useState("idle");

  const sdkRef = useRef(null);
  const adInfoRef = useRef(null); // ✅ store adInfo separately
  const showAdRef = useRef(null);

  const loadAd = useCallback(async () => {
    setAdStatus("loading");

    const liffId = import.meta.env.VITE_LINE_ID;
    if (!liffId || !window.OpenADLineJsSDK || !window.liff) {
      console.warn("❌ Missing LIFF SDK or OpenAD SDK or liffId");
      setAdStatus("error");
      return;
    }

    const adInfo = { zoneId, publisherId, eventId: 0 };
    const adParams = {
      line: {
        type: "LWA", // or LWA / web
        liffId,
        prototype: window.liff,
        isFullscreen: true,
      },
    };
    const userInfo = { userId, displayName };

    try {
      const sdk = window.OpenADLineJsSDK;
      sdkRef.current = sdk;
      adInfoRef.current = adInfo;

      const result = await sdk.interactive.init({ adInfo, adParams, userInfo });

      if (!result || result.code !== 0) {
        console.warn("❌ Ad init failed:", result);
        setIsReady(false);
        setAdStatus("notAvailable");
        return;
      }

      setIsReady(true);

      showAdRef.current = () => {
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
      };
    } catch (err) {
      console.error("❌ Error during ad loading", err);
      setAdStatus("error");
    }
  }, [zoneId, publisherId, userId, displayName, callReward]);

  const showAd = () => {
    if (showAdRef.current) {
      alert("📣 Showing ad now...");
      showAdRef.current();
    } else {
      alert("❌ Ad not ready or showAdRef is empty");
    }
  };

  return { loadAd, showAd, isReady, adStatus };
};
