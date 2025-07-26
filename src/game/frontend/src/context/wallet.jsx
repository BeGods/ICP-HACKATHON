import { createContext, useContext, useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import { MainContext } from "./context";
import { deleteAuthCookie } from "../helpers/cookie.helper";
import { useNavigate } from "react-router-dom";

export const WalletContext = createContext(null);
const tele = window.Telegram?.WebApp;

export const WalletProvider = ({ children }) => {
  const { lineWallet, setLineWallet, authToken, isTelegram, userData } =
    useContext(MainContext);
  const navigate = useNavigate();
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

        const provider = sdk.getWalletProvider();

        setDappSdk(sdk);
        setLineProvider(provider);
        setPaymentProvider(sdk.getPaymentProvider());

        const accounts = await provider.request({
          method: "kaia_accounts",
        });
        const accountAddress = accounts?.[0];

        if (accountAddress) {
          setLineWallet(accountAddress);
          sessionStorage.setItem("accountAddress", accountAddress);
        } else {
          // if (!liff.isInClient() || !isTelegram || !userData.isOneWaveUser) {
          //   (async () => await deleteAuthCookie(tele))();
          //   setTimeout(() => {
          //     navigate("/");
          //   }, 200);
          // }
        }

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
