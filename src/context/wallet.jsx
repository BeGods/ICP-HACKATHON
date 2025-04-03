import { createContext, useContext, useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import { MainContext } from "./context";

export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const { lineWallet, setLineWallet, authToken } = useContext(MainContext);
  const [lineProvider, setLineProvider] = useState(null);
  const [dappSdk, setDappSdk] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [paymentProvider, setPaymentProvider] = useState(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        setIsInitializing(true);
        await liff.init({ liffId: import.meta.env.VITE_LINE_ID });

        const sdk = await DappPortalSDK.init({
          clientId: import.meta.env.VITE_LINE_WALLET_CLIENT,
          chainId: import.meta.env.VITE_LINE_CHAIN_ID || "8217",
        });

        setDappSdk(sdk);
        setLineProvider(sdk.getWalletProvider());
        setPaymentProvider(sdk.getPaymentProvider());

        console.log("SDK Initialized");
      } catch (error) {
        console.error("SDK Initialization Error:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSDK();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isInitializing,
        lineProvider,
        dappSdk,
        paymentProvider,
        setPaymentProvider,
        lineWallet,
        setLineWallet,
        authToken,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
