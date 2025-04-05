
export const getImage = (platform, avatar) => {

  if (platform === "line") {
    return avatar
  } else {
    return `https://media.publit.io/file/UserAvatars/${avatar}.jpg`
  }
}

export const getKaiaValue = (usdAmount) => {
  try {
    const kaiaExchangeRate = 0.107903;
    return (usdAmount / kaiaExchangeRate).toFixed(4);
  } catch (error) {
    console.log(error);
  }
};