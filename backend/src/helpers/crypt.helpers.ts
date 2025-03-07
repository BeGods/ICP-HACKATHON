import config from "../config/config";
import CryptoJs from "crypto-js";

export const encryptOneWaveHash = (input) => {
  try {
    const secretKey = config.security.ONEWAVE_KEY;

    const hashedData = CryptoJs.AES.encrypt(
      JSON.stringify(input),
      secretKey
    ).toString();

    return hashedData;
  } catch (error) {
    throw Error("Failed to decrupt hash.");
  }
};

export const decryptHash = (hashedInput) => {
  try {
    const secretKey = config.security.HASH_KEY;

    const decryptedData = CryptoJs.AES.decrypt(hashedInput, secretKey);
    return JSON.parse(decryptedData.toString(CryptoJs.enc.Utf8));
  } catch (error) {
    throw Error("Failed to decrupt hash.");
  }
};

export const decryptOneWaveHash = (hashedInput) => {
  try {
    const secretKey = config.security.ONEWAVE_KEY;

    const bytes = CryptoJs.AES.decrypt(hashedInput, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));

    if (decryptedData.expiresAt < Math.floor(Date.now() / 1000)) {
      throw new Error("Session has expired.");
    }

    if (decryptedData.platform !== "onewave") {
      throw new Error("Invalid Session");
    }

    return decryptedData;
  } catch (error) {
    throw new Error(error);
  }
};
