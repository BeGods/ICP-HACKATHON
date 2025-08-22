import { useWallet } from "../context/DappWallet";
import { getPaymentId } from "../utils/api.fof";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../store/useStore";

const useDappWallet = () => {
  const {
    isInitializing,
    lineProvider,
    dappSdk,
    paymentProvider,
    lineWallet,
    setPaymentProvider,
    setLineWallet,
  } = useWallet();
  const authToken = useStore((s) => s.authToken);
  const setUserData = useStore((s) => s.setUserData);

  const connectWallet = async () => {
    if (!lineProvider) {
      alert("Wallet provider is missing. Please try again later.");
      return null;
    }

    try {
      const message = uuidv4();
      const [accountAddress, signature] = await lineProvider.request({
        method: "kaia_connectAndSign",
        params: [message],
      });

      if (!accountAddress || accountAddress.length === 0) {
        alert("No wallet connected. Please check your wallet and try again.");
        return null;
      }

      setUserData((prev) => {
        return {
          ...prev,
          kaiaAddress: accountAddress,
        };
      });
      setLineWallet(accountAddress);
      sessionStorage.setItem("accountAddress", accountAddress);

      if (dappSdk) {
        console.log("Setting payment provider...");
        setPaymentProvider(dappSdk.getPaymentProvider());
      }

      return { accountAddress, signature, message };
    } catch (error) {
      console.error("Wallet Connection Error:", error);

      let errorMessage = "An error occurred while connecting the wallet.";

      if (error?.message) {
        if (error.message.includes("user rejected")) {
          errorMessage = "Wallet connection request was rejected by the user.";
        } else if (error.message.includes("network")) {
          errorMessage =
            "Network issue detected. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Wallet connection timed out. Please try again.";
        } else {
          errorMessage = `Wallet connection failed: ${error.message}`;
        }
      }

      alert(errorMessage);
      return null;
    }
  };

  const fetchLinePayHistory = async () => {
    if (!paymentProvider) {
      alert(
        "Payment provider not initialized. Please connect your wallet first."
      );
      return false;
    }

    try {
      await paymentProvider.openPaymentHistory();
      return true;
    } catch (error) {
      console.error("Payment History Error:", error);

      let errorMessage = "An error occurred while fetching payment history.";

      if (error?.message) {
        if (error.message.includes("network")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("unauthorized")) {
          errorMessage = "Unauthorized access. Please log in again.";
        } else {
          errorMessage = `Payment history retrieval failed: ${error.message}`;
        }
      }

      alert(errorMessage);
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

      let errorMessage = "Payment failed. Please try again.";

      if (error?.message) {
        if (error.message.includes("insufficient funds")) {
          errorMessage = "Payment failed due to insufficient funds.";
        } else if (error.message.includes("user cancelled")) {
          errorMessage = "Payment was canceled by the user.";
        } else if (error.message.includes("network")) {
          errorMessage =
            "Payment failed due to a network issue. Please check your connection.";
        } else {
          errorMessage = `Payment failed: ${error.message}`;
        }
      }

      alert(errorMessage);
      return false;
    }
  };

  const disconnectLineWallet = async () => {
    try {
      if (!lineProvider) {
        alert(
          "No wallet provider found. Please refresh the page and try again."
        );
        return;
      }

      sessionStorage.removeItem("accountAddress");
      setLineWallet(null);

      if (lineProvider.disconnectWallet) {
        await lineProvider.disconnectWallet();
      }

      setUserData((prev) => {
        return {
          ...prev,
          kaiaAddress: null,
        };
      });

      if (lineProvider.disconnect) {
        await lineProvider.disconnect();
      }

      console.log("Wallet successfully disconnected.");
      alert("Wallet disconnected successfully.");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);

      let errorMessage = "An error occurred while disconnecting the wallet.";

      if (error?.message) {
        if (error.message.includes("already disconnected")) {
          errorMessage = "The wallet is already disconnected.";
        } else if (error.message.includes("network")) {
          errorMessage =
            "Network issue detected. Please check your connection and try again.";
        } else {
          errorMessage = `Wallet disconnection failed: ${error.message}`;
        }
      }

      alert(errorMessage);
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

export default useDappWallet;
