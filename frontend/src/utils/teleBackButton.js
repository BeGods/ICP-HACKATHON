export const toggleBackButton = async (tele, handleNavigate) => {
  try {
    if (tele) {
      await tele.ready();
      tele.setHeaderColor("#000000");
      tele.setBackgroundColor("#000000");
      tele.setBottomBarColor("#000000");
      tele.BackButton.show();
      tele.BackButton.onClick(handleNavigate);
    } else {
      console.error("Telegram WebApp API not available");
    }
  } catch (error) {
    console.error("Error fetching user data from Telegram:", error);
  }
};

export const hideBackButton = async (tele) => {
  try {
    if (tele) {
      await tele.ready();
      tele.setHeaderColor("#000000");
      tele.setBackgroundColor("#000000");
      tele.setBottomBarColor("#000000");
      tele.BackButton.hide();
    } else {
      console.error("Telegram WebApp API not available");
    }
  } catch (error) {
    console.error("Error fetching user data from Telegram:", error);
  }
};

export const tapHaptick = async (tele) => {
  try {
    if (tele) {
      await tele.ready();
      tele.hapticFeedback.impactOccurred("medium");
    } else {
      console.error("Telegram WebApp API not available");
    }
  } catch (error) {
    console.error("Error fetching user data from Telegram:", error);
  }
};
