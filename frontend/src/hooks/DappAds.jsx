import { useCallback, useState } from "react";
import { showToast } from "../components/Toast/Toast";

export const useOpenAd = ({ callReward }) => {
  const zoneId = import.meta.env.VITE_OPENAD_LMA_ZONE;
  const publisherId = import.meta.env.VITE_OPENAD_PUBLISHER_ID;
  const [isReady, setIsReady] = useState(false);
  const [adStatus, setAdStatus] = useState("idle");
  const liffId = import.meta.env.VITE_LINE_ID;

  const loadAd = useCallback(async () => {
    setAdStatus("loading");

    if (!window.OpenADLineJsSDK) {
      console.warn("❌ Missing OpenAD SDK or LIFF");

      showToast("ad_error");
      setAdStatus("error");
      return;
    }

    try {
      let userInfo;
      let adParams;
      const sdk = window.OpenADLineJsSDK;
      const adInfo = {
        zoneId,
        publisherId,
        eventId: 0,
      };

      if (window.liff.isInClient()) {
        const profile = await window.liff.getProfile();

        userInfo = {
          userId: profile.userId,
          displayName: profile.displayName,
        };

        adParams = {
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
      } else {
        userInfo = {
          userId: "user122",
          displayName: "user",
        };

        // adParams = {
        //   line: {
        //     type: "WEB",
        //   },
        //   web: {
        //     api: `${import.meta.env.VITE_API_FOF_URL}/ads/id`,
        //     method: "GET",
        //     token: "data",
        //     valid: 171,
        //   },
        // };

        adParams = {
          line: {
            type: "WEB",
            isFullscreen: false,
          },
          web: {
            api: "https://2r2cf484-3001.inc1.devtunnels.ms/api/v1/ads/id",
            method: "GET",
            token: "data",
            valid: 171,
          },
        };
      }

      const result = await sdk.interactive.init({ adInfo, adParams, userInfo });

      if (!result || result.code !== 0) {
        console.warn("❌ Ad init failed:", JSON.stringify(result));

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
