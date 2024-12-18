import { useCallback, useEffect, useRef } from "react";
import { showToast } from "../Toast/Toast";

export const callAdsgram = ({ blockId, onReward }) => {
  const AdControllerRef = useRef(null);

  // Initialize Adsgram only once
  useEffect(() => {
    AdControllerRef.current = window.Adsgram?.init({ blockId });
  }, [blockId]);

  const showAd = useCallback(async () => {
    if (AdControllerRef.current) {
      try {
        await AdControllerRef.current.show();
        onReward();
      } catch (error) {
        console.error("Adsgram Error:", error);
        showToast("ad_error");
      }
    } else {
      console.error("Adsgram is not initialized");
    }
  }, [onReward]);

  return showAd;
};
