import { useEffect, useState } from "react";

const tele = window.Telegram?.WebApp;

export const useForgeGuide = (key) => {
  const [enableGuide, setEnableGuide] = useState(false);

  useEffect(() => {
    tele.CloudStorage.getItem(key, (err, item) => {
      if (!item) {
        setEnableGuide(true);
        const timeoutId = setTimeout(() => {
          setEnableGuide(false);
          tele.CloudStorage.setItem(key, 1);
        }, 4000);

        return () => clearTimeout(timeoutId);
      }
    });
  }, []);

  return [enableGuide, setEnableGuide];
};

export const useQuestGuide = (key) => {
  const [enableGuide, setEnableGuide] = useState(false);

  useEffect(() => {
    tele.CloudStorage.getItem(key, (err, item) => {
      if (!item) {
        setEnableGuide(true);
        setTimeout(() => {
          setEnableGuide(false);
          tele.CloudStorage.setItem(key, 2);
        }, 3500);
      }
    });
  }, []);

  return [enableGuide, setEnableGuide];
};

export const useBoosterGuide = (
  key,
  handleClaimAutomata,
  handleActiveCard,
  guideTimeoutId
) => {
  const [enableGuide, setEnableGuide] = useState(false);

  useEffect(() => {
    tele.CloudStorage.getItem(key, (err, item) => {
      if (!item) {
        setEnableGuide(true);
        setTimeout(() => {
          setEnableGuide(false);
          handleActiveCard();
          tele.CloudStorage.setItem(key, 3);
          guideTimeoutId.current = setTimeout(() => {
            handleClaimAutomata();
            guideTimeoutId.current = null;
            clearTimeout(guideTimeoutId);
          }, 1500);
        }, 2500);
      }
    });
  }, []);

  return [enableGuide, setEnableGuide];
};

export const useProfileGuide = (key) => {
  const [enableGuide, setEnableGuide] = useState(false);

  useEffect(() => {
    tele.CloudStorage.getItem(key, (err, item) => {
      if (!item) {
        setEnableGuide(true);
        setTimeout(() => {
          setEnableGuide(false);
          tele.CloudStorage.setItem(key, 4);
        }, 4000);
      }
    });
  }, []);

  return [enableGuide, setEnableGuide];
};
