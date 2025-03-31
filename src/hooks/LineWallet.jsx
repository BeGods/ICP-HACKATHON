import liff from "@line/liff";
import DappPortalSDK, { WalletType } from "@linenext/dapp-portal-sdk";
import { Web3Provider as w3 } from "@kaiachain/ethers-ext/v6";
import { getPaymentId } from "../utils/api.fof";
import { v4 as uuidv4 } from "uuid";

export const initializeWalletSDK = async () => {
  return liff
    .init({
      liffId: import.meta.env.VITE_LINE_ID,
    })
    .then(() => {
      return DappPortalSDK.init({
        clientId: import.meta.env.VITE_LINE_WALLET_CLIENT,
        chainId: import.meta.env.VITE_LINE_CHAIN_ID || "8217",
      });
    })
    .then((sdk) => {
      const lineProvider = sdk.getWalletProvider();
      const kaiaProvider = new w3(lineProvider);
      return { lineProvider, kaiaProvider };
    })
    .catch((error) => {
      console.error("SDK Initialization Error:", error);
      throw new Error(`Initialize error: ${error.message || error}`);
    });
};

export const connectWallet = async (provider) => {
  if (!provider) {
    return;
  }

  try {
    if (!WalletType) {
      return;
    }

    const accounts = await provider.request({ method: "kaia_requestAccounts" });

    if (!accounts || accounts.length === 0) {
      alert("No wallet connected. Please try again.");
      return;
    }

    const accountAddress = accounts[0];
    const message = uuidv4();
    const signature = await provider.request({
      method: "personal_sign",
      params: [message, accountAddress],
    });

    return { signature, accountAddress, message };
  } catch (error) {
    console.error("Wallet Connection Error:", error);
    if (error?.data?.message) {
      alert(`Error: ${error.data.message}`);
    } else {
      alert(`Unexpected Error: ${JSON.stringify(error)}`);
    }
  }
};

export const initializePaymentSDK = async () => {
  return liff
    .init({
      liffId: import.meta.env.VITE_LINE_ID,
    })
    .then(() => {
      return DappPortalSDK.init({
        clientId: import.meta.env.VITE_LINE_WALLET_CLIENT,
        chainId: import.meta.env.VITE_LINE_CHAIN_ID || "8217",
      });
    })
    .then((sdk) => {
      const paymentProvider = sdk.getPaymentProvider();
      const lineProvider = sdk.getWalletProvider();
      return { paymentProvider, lineProvider };
    })
    .catch((error) => {
      console.error("SDK Initialization Error:", error);
      throw new Error(`Initialize error: ${error.message || error}`);
    });
};

export const createLinePayment = async (
  paymentProvider,
  lineProvider,
  authToken,
  booster
) => {
  if (!paymentProvider || !lineProvider) {
    return false;
  }

  try {
    await lineProvider.request({ method: "kaia_requestAccounts" });
    const paymentId = await getPaymentId(authToken, booster);
    await paymentProvider.startPayment(paymentId);

    return true;
  } catch (error) {
    console.error("Wallet Connection Error:", error);
    return false;
  }
};
