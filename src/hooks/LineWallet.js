import liff from "@line/liff";
import DappPortalSDK, { WalletType } from "@linenext/dapp-portal-sdk";



export const initializeWalletSDK = async () => {
    try {
        await liff.init({
            liffId: import.meta.env.VITE_LINE_ID,
        }).then(async () => {

            const sdk = await DappPortalSDK.init({
                clientId: import.meta.env.VITE_LINE_WALLET_CLIENT,
                chainId: import.meta.env.VITE_LINE_CHAIN_ID || "8217",
            });

            let walletProvider = sdk.getWalletProvider();
            return await connectLineWallet(walletProvider);
        })
    } catch (error) {
        console.error("SDK Initialization Error:", error);
        alert(`Initialize error: ${error}`);
    }
};

export const connectLineWallet = async (provider) => {
    if (!provider) {
        alert("Wallet provider not initialized.");
        return;
    }

    try {

        if (!WalletType) {
            alert("No wallet connected. Please connect a wallet first.");
            return;
        }

        const accounts = await provider.request({ method: "kaia_requestAccounts" });
        if (!accounts || accounts.length === 0) {
            alert("No wallet connected. Please try again.");
            return;
        }

        const accountAddress = accounts[0];
        alert(`Connected Wallet Address: ${accountAddress}`);

        const message = "Welcome to BeGods DApp";
        let signature;

        if (WalletType === "Liff" || WalletType === "Mobile") {
            signature = await provider.request({
                method: "kaia_connectAndSign",
                params: [{ message, account: accountAddress }],
            });
        } else {
            signature = await provider.request({
                method: "personal_sign",
                params: [message, accountAddress],
            });
        }

        console.log("Signature:", signature);
        return { accountAddress, signature };

    } catch (error) {
        console.error("Wallet Connection Error:", error);
        if (error?.data?.message) {
            alert(`Error: ${error.data.message}`);
        } else {
            alert(`Unexpected Error: ${JSON.stringify(error)}`);
        }
    }
};

