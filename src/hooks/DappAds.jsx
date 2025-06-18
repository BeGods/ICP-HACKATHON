import { useCallback, useState } from "react";

export const useOpenAd = ({
  zoneId,
  publisherId,
  userId,
  displayName,
  callReward,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [adStatus, setAdStatus] = useState("idle");

  const loadAd = useCallback(async () => {
    setAdStatus("loading");

    const liffId = import.meta.env.VITE_LINE_ID;
    if (!liffId || !window.OpenADLineJsSDK || !window.liff) {
      alert("❌ Missing LIFF SDK or OpenAD SDK or liffId");
      setAdStatus("error");
      return;
    }

    const LineAD = {
      adInfo: { zoneId, publisherId, eventId: 0 },
      adParams: {
        line: {
          type: "LWA",
          liffId,
          prototype: window.liff,
          isFullscreen: true,
        },
      },
      userInfo: { userId, displayName },
    };

    try {
      const sdk = window.OpenADLineJsSDK;
      const result = await sdk?.interactive?.init(LineAD);

      if (!result || result.code !== 0) {
        alert("no result");
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

      sdk.interactive.getRender({ adInfo: LineAD.adInfo, cb: callbackFunc });
    } catch (err) {
      alert("❌ Error during ad loading:", err);
      setAdStatus("error");
    }
  }, [zoneId, publisherId, userId, displayName, callReward]);

  return { loadAd, isReady, adStatus };
};
