import { useEffect, useState } from "react";
import { setTutKey, validateTutCookie } from "../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

export const useForgeGuide = (key) => {
  const [enableGuide, setEnableGuide] = useState(false);

  const checkTutExists = async () => {
    const itExists = await validateTutCookie(tele, key);
    if (!itExists) {
      setEnableGuide(true);
      setTutKey(tele, key, 1);
      return () => clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    (async () => await checkTutExists())();
  }, []);

  return [enableGuide, setEnableGuide];
};

export const useQuestGuide = (key) => {
  const [enableGuide, setEnableGuide] = useState(false);

  const checkTutExists = async () => {
    const itExists = await validateTutCookie(tele, key);
    if (!itExists) {
      setEnableGuide(true);
      setTimeout(() => {
        setEnableGuide(false);
        setTutKey(tele, key, 2);
      }, 3500);
    }
  };

  useEffect(() => {
    (async () => await checkTutExists())();
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

  const checkTutExists = async () => {
    const itExists = await validateTutCookie(tele, key);
    if (!itExists) {
      setEnableGuide(true);
      setTimeout(() => {
        setEnableGuide(false);
        handleActiveCard();
        setTutKey(tele, key, 3);
        // guideTimeoutId.current = setTimeout(() => {
        //   handleClaimAutomata();
        //   guideTimeoutId.current = null;
        //   clearTimeout(guideTimeoutId);
        // }, 1500);
      }, 2500);
    }
  };

  useEffect(() => {
    (async () => await checkTutExists())();
  }, []);

  return [enableGuide, setEnableGuide];
};

export const useProfileGuide = (key) => {
  const [enableGuide, setEnableGuide] = useState(false);

  const checkTutExists = async () => {
    const itExists = await validateTutCookie(tele, key);
    if (!itExists) {
      setEnableGuide(true);
      setTutKey(tele, key, 4);
    }
  };

  useEffect(() => {
    (async () => await checkTutExists())();
  }, []);

  return [enableGuide, setEnableGuide];
};

export const useTowerGuide = (key) => {
  const [enableGuide, setEnableGuide] = useState(false);

  const checkTutExists = async () => {
    const itExists = await validateTutCookie(tele, key);
    if (!itExists) {
      setEnableGuide(true);
      setTutKey(tele, key, 5);
    }
  };

  useEffect(() => {
    (async () => await checkTutExists())();
  }, []);

  return [enableGuide, setEnableGuide];
};


export const useRoRGuide = (key) => {
  const [enableGuide, setEnableGuide] = useState(false);

  const checkTutExists = async () => {
    const itExists = await validateTutCookie(tele, key);
    if (!itExists) {
      setEnableGuide(true);
      setTutKey(tele, key, 5);
    }
  };

  useEffect(() => {
    (async () => await checkTutExists())();
  }, []);

  return [enableGuide, setEnableGuide];
};
