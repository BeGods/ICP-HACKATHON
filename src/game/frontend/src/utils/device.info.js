export const isSafari = () => {
  const ua = navigator.userAgent;

  return /Safari/.test(ua) && !/Chrome/.test(ua);
};

export const isDesktop = () => {
  let userAgent = navigator.userAgent.toLowerCase();
  let isDesktop = true;

  if (userAgent.match(/android|iphone|ipad|ipod|blackberry|windows phone/i)) {
    isDesktop = false;
  }

  return isDesktop;
};

export const determineIsTelegram = (platform) => {
  const telegramPlatforms = ["macos", "windows", "tdesktop", "ios", "android"];
  return telegramPlatforms.includes(platform);
};

export const determineIsTgMobile = (platform) => {
  const telegramPlatforms = ["ios", "android"];
  return telegramPlatforms.includes(platform);
};

export const determineIsTgDesktop = (platform) => {
  const telegramPlatforms = ["macos", "windows", "tdesktop"];
  return telegramPlatforms.includes(platform);
};


export const telegramGetSafeAreaInsets = () => {
  const rootStyle = getComputedStyle(document.documentElement);
  return {
    top: parseInt(rootStyle.getPropertyValue("--tg-safe-area-inset-top")) || 0,
    right:
      parseInt(rootStyle.getPropertyValue("--tg-safe-area-inset-right")) || 0,
    bottom:
      parseInt(rootStyle.getPropertyValue("--tg-safe-area-inset-bottom")) || 0,
    left:
      parseInt(rootStyle.getPropertyValue("--tg-safe-area-inset-left")) || 0,
  };
};

export const telegramGetContentSafeAreaInsets = () => {
  const rootStyle = getComputedStyle(document.documentElement);
  return {
    top:
      parseInt(
        rootStyle.getPropertyValue("--tg-content-safe-area-inset-top")
      ) || 0,
    right:
      parseInt(
        rootStyle.getPropertyValue("--tg-content-safe-area-inset-right")
      ) || 0,
    bottom:
      parseInt(
        rootStyle.getPropertyValue("--tg-content-safe-area-inset-bottom")
      ) || 0,
    left:
      parseInt(
        rootStyle.getPropertyValue("--tg-content-safe-area-inset-left")
      ) || 0,
  };
};
