import { useState, useEffect, useContext } from "react";
import liff from "@line/liff";
import DappPortalSDK, { WalletType } from "@linenext/dapp-portal-sdk";
import { Web3Provider as w3 } from "@kaiachain/ethers-ext/v6";
import { disconnectLineWallet, getPaymentId } from "../utils/api.fof";
import { MainContext } from "../context/context";

const useWalletPayment = () => {
  const { authToken, setLineWallet } = useContext(MainContext);
  const [lineProvider, setLineProvider] = useState(null);
  const [kaiaProvider, setKaiaProvider] = useState(null);
  const [paymentProvider, setPaymentProvider] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        setIsInitializing(true);
        await liff.init({ liffId: import.meta.env.VITE_LINE_ID });

        const sdk = await DappPortalSDK.init({
          clientId: import.meta.env.VITE_LINE_WALLET_CLIENT,
          chainId: import.meta.env.VITE_LINE_CHAIN_ID || "8217",
        });

        const walletProvider = sdk.getWalletProvider();
        setLineProvider(walletProvider);
        setKaiaProvider(new w3(walletProvider));
        setPaymentProvider(sdk.getPaymentProvider());
      } catch (error) {
        console.error("SDK Initialization Error:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSDK();
  }, []);

  const connectWallet = async () => {
    if (!lineProvider || !kaiaProvider || !WalletType) return null;

    try {
      const accounts = await kaiaProvider.send("kaia_requestAccounts", []);
      if (!accounts || accounts.length === 0) {
        alert("No wallet connected. Please try again.");
        return null;
      }
      return { accountAddress: accounts[0] };
    } catch (error) {
      console.error("Wallet Connection Error:", error);
      alert(
        error?.data?.message || `Unexpected Error: ${JSON.stringify(error)}`
      );
      return null;
    }
  };

  const fetchLinePayHistory = async () => {
    if (!paymentProvider || !lineProvider) {
      alert("Please connect your wallet");
      return false;
    }

    try {
      await paymentProvider.openPaymentHistory();
      return true;
    } catch (error) {
      console.error("Payment History Error:", error);
      return false;
    }
  };

  const createLinePayment = async (paymentMethod, authToken, booster) => {
    if (!paymentProvider || !lineProvider) {
      alert("Please connect your wallet");
      return false;
    }

    try {
      const paymentId = await getPaymentId(authToken, booster, paymentMethod);
      await paymentProvider.startPayment(paymentId);
      return true;
    } catch (error) {
      console.error("Payment Error:", error);
      return false;
    }
  };

  const disonnectWallet = async () => {
    try {
      await disconnectLineWallet(authToken);
      lineProvider.disconnectWallet();
      lineProvider.disconnect();
      setLineWallet(null);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isInitializing,
    lineProvider,
    kaiaProvider,
    paymentProvider,
    connectWallet,
    fetchLinePayHistory,
    createLinePayment,
    disonnectWallet,
  };
};

export default useWalletPayment;
