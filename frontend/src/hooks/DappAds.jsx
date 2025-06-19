import { useCallback, useState } from "react";
import liff from "@line/liff";
import { showToast } from "../components/Toast/Toast";

export const useOpenAd = ({ callReward }) => {
  const zoneId = liff.isInClient()
    ? import.meta.env.VITE_OPENAD_LMA_ZONE
    : import.meta.env.VITE_OPENAD_WEB_ZONE;
  const publisherId = import.meta.env.VITE_OPENAD_PUBLISHER_ID;
  const [isReady, setIsReady] = useState(false);
  const [adStatus, setAdStatus] = useState("idle");
  let type = liff.isInClient() ? "LMA" : "WEB";

  const loadAd = useCallback(async () => {
    setAdStatus("loading");

    const liffId = import.meta.env.VITE_LINE_ID;

    if (!window.OpenADLineJsSDK || !window.liff) {
      console.warn("❌ Missing OpenAD SDK or LIFF");
      alert("❌ Missing OpenAD SDK or LIFF");

      showToast("ad_error");
      setAdStatus("error");
      return;
    }

    try {
      // if (!window.liff.isLoggedIn()) {
      //   console.warn("❌ User not logged in to LINE");

      //   alert("❌ User not logged in to LINE");

      //   showToast("ad_error");
      //   setAdStatus("error");
      //   return;
      // }

      const profile = await window.liff.getProfile();
      const userInfo = {
        userId: profile.userId,
        displayName: profile.displayName,
      };

      const adInfo = { zoneId, publisherId, eventId: 0 };
      const adParams = {
        line: {
          type: type,
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
        alert("❌ Ad init failed:", result);

        showToast("ad_error");
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
          setAdStatus(e);
          if (e === "view" || e === "click") {
            callReward();
          } else {
            showToast("ad_watch_error");
          }
        },
      };

      await sdk.interactive.getRender({
        adInfo,
        cb: callbackFunc,
        clickReward: () => {
          callReward();
        },
      });
    } catch (err) {
      console.error("❌ Error during ad loading", err);
      showToast("ad_error");

      setAdStatus("error");
    }
  }, [zoneId, publisherId, callReward]);

  return { loadAd, isReady, adStatus };
};
