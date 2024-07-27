export const toggleBackButton = async (tele) => {
  try {
    if (tele) {
      await tele.ready();
      tele.BackButton.show();
      tele.BackButton.onClick(() => navigate("/home"));
      tele.setHeaderColor("#302D1F");
    } else {
      console.error("Telegram WebApp API not available");
    }
  } catch (error) {
    console.error("Error fetching user data from Telegram:", error);
  }
};
