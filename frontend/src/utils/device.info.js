export const isSafari = () => {
  const ua = navigator.userAgent;

  return /Safari/.test(ua) && !/Chrome/.test(ua);
};


export const telegramGetSafeAreaInsets = () => {
  const rootStyle = getComputedStyle(document.documentElement);
  return {
    top:
      parseInt(rootStyle.getPropertyValue("--tg-safe-area-inset-top")) || 0,
    right:
      parseInt(rootStyle.getPropertyValue("--tg-safe-area-inset-right")) || 0,
    bottom:
      parseInt(rootStyle.getPropertyValue("--tg-safe-area-inset-bottom")) ||
      0,
    left:
      parseInt(rootStyle.getPropertyValue("--tg-safe-area-inset-left")) || 0,
  };
};

export const telegramGetContentSafeAreaInsets = () => {
  const rootStyle = getComputedStyle(document.documentElement);
  return {
    top:
      parseInt(rootStyle.getPropertyValue("--tg-content-safe-area-inset-top")) || 0,
    right:
      parseInt(rootStyle.getPropertyValue("--tg-content-safe-area-inset-right")) || 0,
    bottom:
      parseInt(rootStyle.getPropertyValue("--tg-content-safe-area-inset-bottom")) ||
      0,
    left:
      parseInt(rootStyle.getPropertyValue("--tg-content-safe-area-inset-left")) || 0,
  };
};