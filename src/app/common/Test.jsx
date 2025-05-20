import React from "react";
import HTMLFlipBook from "react-pageflip";

const backgroundImageUrl =
  "https://media.publit.io/file/BeGods/uxui/320px-info-background.jpg";

const Test = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-3/4 aspect-[3/5] max-w-[600px]">
          <HTMLFlipBook
            width={300}
            height={500}
            size="stretch"
            minWidth={300}
            maxWidth={600}
            minHeight={400}
            maxHeight={800}
            usePortrait={true}
            autoSize={true}
            className="w-full h-full"
          >
            {[1, 2, 3, 4].map((page) => (
              <div
                key={page}
                className="relative w-full h-full text-white rounded-2xl"
              >
                <img
                  src={backgroundImageUrl}
                  alt={`page ${page}`}
                  className="rounded-2xl h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-card">
                  Page {page}
                </div>
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>
    </div>
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
