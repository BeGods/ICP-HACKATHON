import { toUserFriendlyAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useContext, useRef } from "react";
import { MainContext } from "../context/context";
import { showToast } from "../components/Toast/Toast";
import { connectTonWallet } from "../utils/api.fof";

export const useTonWalletConnector = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { authToken, setUserData } = useContext(MainContext);

  const isSubscribedRef = useRef(false);

  const handleConnectTonWallet = () => {
    tonConnectUI.openModal();

    if (isSubscribedRef.current) return;

    isSubscribedRef.current = true;

    const unsubscribe = tonConnectUI.onStatusChange(async (wallet) => {
      if (wallet?.account?.address) {
        const userFriendly = toUserFriendlyAddress(wallet.account.address);

        try {
          await connectTonWallet({ tonAddress: userFriendly }, authToken);

          setUserData((prev) => ({
            ...prev,
            tonAddress: userFriendly,
          }));

          showToast("ton_connect_success");
        } catch (error) {
          const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            error.message ||
            "An unexpected error occurred";

          console.error(errorMessage);
          showToast("ton_connect_error");
        }
      }
    });

    return unsubscribe;
  };

  return { handleConnectTonWallet };
};
