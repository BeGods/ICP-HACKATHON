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
    setAdStatus("idle");

    const LineAD = {
      adInfo: { zoneId, publisherId, eventId: 0 },
      adParams: {
        line: {
          type: "LMA",
          liffId: import.meta.env.VITE_LINE_ID,
          prototype: window.liff,
          isFullscreen: true,
        },
      },
      userInfo: { userId, displayName },
    };

    const sdk = window.OpenADLineJsSDK;
    const result = await sdk?.interactive?.init(LineAD);

    if (result?.code !== 0) {
      setIsReady(false);
      setAdStatus("error");
      return;
    }

    setIsReady(true);

    const callbackFunc = {
      onAdResourceLoad: (e) => console.log("Ad resource loaded:", e),
      onAdOpening: (e) => console.log("Ad opening:", e),
      onAdOpened: (e) => console.log("Ad opened:", e),
      onAdTaskFinished: (e) => console.log("Ad task finished:", e),
      onAdClosing: (e) => console.log("Ad closing:", e),
      onAdClick: (e) => console.log("Ad clicked:", e),
      onAdClosed: (e) => {
        console.log("Ad closed:", e);
        setAdStatus(e);
        if (e === "view" || e === "click") callReward();
      },
    };

    sdk.interactive.getRender({ adInfo: LineAD.adInfo, cb: callbackFunc });
  }, [zoneId, publisherId, userId, displayName, callReward]);

  return { loadAd, isReady, adStatus };
};
