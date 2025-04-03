import { useWallet } from "../context/wallet";
import { getPaymentId } from "../utils/api.fof";
import { Web3Provider as w3 } from "@kaiachain/ethers-ext/v6";
import { v4 as uuidv4 } from "uuid";

const useWalletPayment = () => {
  const {
    isInitializing,
    lineProvider,
    dappSdk,
    paymentProvider,
    lineWallet,
    setPaymentProvider,
    setLineWallet,
    authToken,
  } = useWallet();

  const connectWallet = async () => {
    if (!lineProvider) return null;

    try {
      const provider = new w3(lineProvider);
      const accounts = await provider.send("kaia_requestAccounts", []);

      if (!accounts || accounts.length === 0) {
        alert("No wallet connected. Please try again.");
        return null;
      }

      const accountAddress = accounts[0];

      setLineWallet(accountAddress);
      sessionStorage.setItem("accountAddress", accountAddress);

      const message = uuidv4();
      const signature = await lineProvider.request({
        method: "personal_sign",
        params: [message, accountAddress],
      });

      if (dappSdk) {
        console.log("Setting payment provider...");
        setPaymentProvider(dappSdk.getPaymentProvider());
      }

      return { accountAddress, signature, message };
    } catch (error) {
      console.error("Wallet Connection Error:", error);
      return null;
    }
  };

  const fetchLinePayHistory = async () => {
    if (!paymentProvider) {
      alert("Payment provider not initialized.");
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

  const createLinePayment = async (paymentMethod, booster) => {
    if (!paymentProvider || !lineWallet) {
      alert("Please connect your wallet.");
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

  const disconnectLineWallet = async () => {
    try {
      sessionStorage.removeItem("accountAddress");

      if (lineProvider) {
        await lineProvider.disconnectWallet();
        await lineProvider.disconnect();
      }
      setLineWallet(null);
      console.log("Wallet successfully disconnected.");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return {
    isInitializing,
    connectWallet,
    fetchLinePayHistory,
    createLinePayment,
    disconnectLineWallet,
  };
};

export default useWalletPayment;
