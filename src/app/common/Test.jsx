import React from "react";

const Test = (props) => {
  return (
    // <div
    //   className={`bg-white text-black flex w-screen text-wrap ${
    //     isTelegram ? "tg-container-height" : "browser-container-height"
    //   }`}
    // >
    //   <div
    //     className={`${
    //       isTelegram ? "tg-container-height" : "browser-container-height"
    //     }`}
    //     style={{
    //       background: `url(/assets/1280px-dod.loading.png)`,
    //       backgroundPosition: "45.5% 0%",
    //       backgroundRepeat: "no-repeat",
    //       backgroundSize: "cover",
    //       width: "100vw",
    //       position: "fixed",
    //       top: 0,
    //       left: 0,
    //     }}
    //   ></div>
    // </div>
    <></>
  );
};

export default Test;

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import liff from "@line/liff";
// import DappPortalSDK, { WalletType, PaymentProvider } from "@linenext/dapp-portal-sdk";
// import { Web3Provider as w3 } from "@kaiachain/ethers-ext/v6";

// export const useWalletSDK = () => {
//     const [provider, setProvider] = useState < w3 | undefined > (undefined);
//     const [pProvider, setPProvider] = useState < PaymentProvider | undefined > (undefined);
//     const [account, setAccount] = useState < string | null > (null);
//     const [isConnected, setIsConnected] = useState < boolean > (false);

//     const initializeWalletSDK = useCallback(async () => {
//         try {
//             await liff.init({
//                 liffId: import.meta.env.VITE_LINE_ID,
//             });

//             const sdk = await DappPortalSDK.init({
//                 clientId: import.meta.env.VITE_LINE_WALLET_CLIENT,
//                 chainId: import.meta.env.VITE_LINE_CHAIN_ID || "8217",
//             });

//             const walletProvider = sdk.getWalletProvider();
//             const paymentProvider = sdk.getPaymentProvider();

//             if (!walletProvider) {
//                 throw new Error("Wallet Provider initialization failed.");
//             }

//             setProvider(new w3(walletProvider));
//             setPProvider(paymentProvider);
//         } catch (error: any) {
//             console.error("SDK Initialization Error:", error);
//             alert(`SDK Initialization Error: ${error?.message || JSON.stringify(error)}`);
//         }
//     }, []);

//     const connectWallet = useCallback(async () => {
//         if (!provider) {
//             alert("Wallet provider not initialized.");
//             return;
//         }

//         try {
//             const accounts = await provider.request({ method: "kaia_requestAccounts" });

//             if (!accounts || accounts.length === 0) {
//                 alert("No wallet connected. Please try again.");
//                 return;
//             }

//             const accountAddress = accounts[0];
//             setAccount(accountAddress);
//             setIsConnected(true);
//             alert(`Connected Wallet Address: ${accountAddress}`);

//             const message = "Welcome to BeGods DApp";
//             const signature = await provider.request({
//                 method: "personal_sign",
//                 params: [message, accountAddress],
//             });

//             console.log("Signature:", signature);
//             return { accountAddress, signature };
//         } catch (error: any) {
//             console.error("Wallet Connection Error:", error);
//             alert(`Wallet Connection Error: ${error?.message || JSON.stringify(error)}`);
//         }
//     }, [provider]);

//     useEffect(() => {
//         initializeWalletSDK();
//     }, [initializeWalletSDK]);

//     return {
//         provider,
//         pProvider,
//         account,
//         isConnected,
//         connectWallet,
//     };
// };
