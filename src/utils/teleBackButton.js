export const toggleBackButton = async (tele, handleNavigate) => {
  try {
    if (tele) {
      await tele.ready();
      tele.BackButton.show();
      tele.BackButton.onClick(handleNavigate);
    } else {
      console.error("Telegram WebApp API not available");
    }
  } catch (error) {
    console.error("Error fetching user data from Telegram:", error);
  }
};

// export const hideBackButton = async (tele) => {
//   try {
//     if (tele) {
//       await tele.ready();
//       tele.BackButton.hide();
//     } else {
//       console.error("Telegram WebApp API not available");
//     }
//   } catch (error) {
//     console.error("Error fetching user data from Telegram:", error);
//   }
// };
