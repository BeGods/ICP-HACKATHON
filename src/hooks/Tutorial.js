import { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";

const tele = window.Telegram?.WebApp;

export const useForgeGuide = (key) => {
  const [enableGuide, setEnableGuide] = useState(false);
  const { setShowCard } = useContext(MyContext);

  useEffect(() => {
    tele.CloudStorage.getItem(key, (err, item) => {
      if (!item) {
        setEnableGuide(true);
        tele.CloudStorage.setItem(key, 1);

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
        tele.CloudStorage.setItem(key, 4);
      }
    });
  }, []);

  return [enableGuide, setEnableGuide];
};

export const useTowerGuide = (key) => {
  const [enableGuide, setEnableGuide] = useState(false);
  const { setShowCard } = useContext(MyContext);

  useEffect(() => {
    tele.CloudStorage.getItem(key, (err, item) => {
      if (!item) {
        setEnableGuide(true);

        tele.CloudStorage.setItem(key, 5);
      }
    });
  }, []);

  return [enableGuide, setEnableGuide];
};
