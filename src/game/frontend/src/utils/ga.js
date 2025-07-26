import ReactGA from "react-ga4";

export const trackComponentView = (componentName) => {
  try {
    ReactGA.send({
      hitType: "pageview",
      page: `/home/${componentName}`,
      title: `${componentName}`,
    });
  } catch (error) {
    console.error(
      `Failed to send tracking for component "${componentName}":`,
      error
    );
  }
};

export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

export const getDeviceAndOS = (isTMA) => {
  if (isTMA) {
    if (isTMA === "android") {
      return "tma.android";
    } else if (isTMA === "ios") {
      return "tma.ios";
    }
  }

  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  let deviceType = "";
  let osType = "";

  // check for ios
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    deviceType = "mobile";
    osType = "ios";
  }
  // check for android
  else if (/Android/i.test(userAgent)) {
    deviceType = "mobile";
    osType = "android";
  }
  // check for macOS
  else if (/Mac/i.test(platform)) {
    deviceType = "desktop";
    osType = "mac";
  }
  // check for windows
  else if (/Win/i.test(platform)) {
    deviceType = "desktop";
    osType = "windows";
  }
  // default to desktop if no match
  else {
    deviceType = "desktop";
    osType = "unknown";
  }

  return `${deviceType}.${osType}`;
};
