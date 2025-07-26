
export const getImage = (platform, avatar) => {

  if (platform === "line") {
    return avatar
  } else {
    return `https://media.publit.io/file/UserAvatars/${avatar}.jpg`
  }
}

export const getKaiaValue = (usdAmount, kaiaExchangeRate) => {
  try {
    return (usdAmount / kaiaExchangeRate).toFixed(4);
  } catch (error) {
    console.log(error);
  }
};