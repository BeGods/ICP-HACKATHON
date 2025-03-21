
export const getImage = (platform, avatar) => {

  if (platform === "line") {
    return avatar
  } else {
    return `https://media.publit.io/file/UserAvatars/${avatar}.jpg`
  }
}