import config from "../config/config";
import CryptoJs from "crypto-js";

export const decryptHash = (hashedInput) => {
  try {
    const secretKey = config.security.HASH_KEY;

    const decryptedData = CryptoJs.AES.decrypt(hashedInput, secretKey);
    return JSON.parse(decryptedData.toString(CryptoJs.enc.Utf8));
  } catch (error) {
    throw Error("Failed to decrupt hash.");
  }
};
