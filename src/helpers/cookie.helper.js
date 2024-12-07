import { isSafari } from "../utils/device.info";

// set auth
export const setAuthCookie = async (tele, token) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    tele.CloudStorage.setItem("accessToken", token);
  } else {
    localStorage.setItem("accessToken", token);
  }
};

// set lang
export const setLangCookie = async (tele, langCode) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    tele.CloudStorage.setItem("lang", langCode);
  } else {
    localStorage.setItem("lang", langCode);
  }
};

// set tut key
export const setTutKey = async (tele, key, value) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    tele.CloudStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, value);
  }
};

// set country
export const setCountryCookie = async (tele, countryCode) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    tele.CloudStorage.setItem("country_code", countryCode);
  } else {
    localStorage.setItem("country_code", countryCode);
  }
};

// set sound
export const setSoundStatus = async (tele, toRemove) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    if (toRemove) {
      tele.CloudStorage.removeItem("sound");
    } else {
      tele.CloudStorage.setItem("sound", false);
    }
  } else {
    localStorage.setItem("sound", toRemove);
  }
};

// get auth
export const validateSoundCookie = async (tele) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    return new Promise((resolve) => {
      tele.CloudStorage.getItem("sound", (err, item) => {
        if (err) {
          console.error(err);
          resolve(true);
        } else {
          if (item) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      });
    });
  } else {
    const cookieItem = localStorage.getItem("sound");
    if (cookieItem) {
      return cookieItem;
    }
  }

  return true;
};

// get country
export const validateCountryCode = async (tele) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    return new Promise((resolve) => {
      tele.CloudStorage.getItem("country_code", (err, item) => {
        if (err) {
          console.error(err);
          resolve("NA");
        } else {
          if (item) {
            resolve(item);
          } else {
            resolve(null);
          }
        }
      });
    });
  } else {
    const cookieItem = localStorage.getItem("country_code");
    if (cookieItem) {
      return cookieItem;
    }
  }

  return "NA";
};

// get lang
export const validateLang = async (tele) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    return new Promise((resolve) => {
      tele.CloudStorage.getItem("lang", (err, item) => {
        if (err) {
          console.error(err);
          resolve("en");
        } else {
          resolve(item || "en");
        }
      });
    });
  } else {
    const cookieItem = localStorage.getItem("lang");
    if (cookieItem) {
      return cookieItem;
    }
  }

  return "en";
};

// get auth
export const validateAuth = async (tele) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    return new Promise((resolve) => {
      tele.CloudStorage.getItem("accessToken", (err, item) => {
        if (err) {
          console.error(err);
          resolve(undefined);
        } else {
          resolve(item);
        }
      });
    });
  } else {
    const cookieItem = localStorage.getItem("accessToken");
    if (cookieItem) {
      return cookieItem;
    }
  }

  return undefined;
};

// get tut
export const validateTutCookie = async (tele, key) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    return new Promise((resolve) => {
      tele.CloudStorage.getItem("lang", (err, item) => {
        if (err) {
          resolve(false);
        } else {
          if (item) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  } else {
    const cookieItem = localStorage.getItem(key);
    if (cookieItem) {
      return cookieItem;
    }
  }
  return null;
};

// haptic on click
export const fetchHapticStatus = async (tele) => {
  await tele.ready();
  if (tele.platform === "ios" || tele.platform === "android") {
    return new Promise((resolve) => {
      tele.CloudStorage.getItem("disableHaptic", (err, item) => {
        if (err) {
          resolve(true);
        } else {
          if (item) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      });
    });
  } else {
    const cookieItem = localStorage.getItem("disableHaptic");
    if (cookieItem) {
      return false;
    }
  }

  return true;
};

// haptic on click
export const handleClickHaptic = (tele, isActive) => {
  if (isActive) {
    if (tele.platform === "ios" || tele.platform === "android") {
      tele.HapticFeedback.notificationOccurred("success");
    } else {
      window.navigator.vibrate(25);
    }
  }
};

// haptic on tap
export const handleTapHaptic = (tele, platform, isActive, value) => {
  if (isActive) {
    if (platform !== "ios" && !isSafari()) {
      window.navigator.vibrate(value);
    }
    if (platform === "ios") {
      tele.HapticFeedback.impactOccurred("light");
    }
  }
};

// set auth
export const setHapticCookie = async (tele) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    tele.CloudStorage.setItem("disableHaptic", true);
  } else {
    localStorage.setItem("disableHaptic", true);
  }
};

export const deleteHapticCookie = async (tele) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    tele.CloudStorage.removeItem("disableHaptic");
  } else {
    localStorage.removeItem("disableHaptic");
  }
};

export const clearAllGuideCookie = async (tele) => {
  await tele.ready();

  if (tele.platform === "ios" || tele.platform === "android") {
    tele.CloudStorage.removeItem("tutorial01");
    tele.CloudStorage.removeItem("tutorial02");
    tele.CloudStorage.removeItem("tutorial03");
    tele.CloudStorage.removeItem("tutorial04");
    tele.CloudStorage.removeItem("tutorial05");
  } else {
    localStorage.removeItem("tutorial01");
    localStorage.removeItem("tutorial02");
    localStorage.removeItem("tutorial03");
    localStorage.removeItem("tutorial04");
    localStorage.removeItem("tutorial05");
  }
};
