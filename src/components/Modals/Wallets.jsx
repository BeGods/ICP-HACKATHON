import React, { useContext, useEffect } from "react";
import { MainContext } from "../../context/context";
import {
  deleteAuthCookie,
  handleClickHaptic,
} from "../../helpers/cookie.helper";
import useWalletPayment from "../../hooks/LineWallet";
import { ChevronRight, History, Wallet } from "lucide-react";
import liff from "@line/liff";
import { useNavigate } from "react-router-dom";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import ModalLayout, { ModalItemLyt } from "../Layouts/ModalLayout";

const tele = window.Telegram?.WebApp;

const WalletsModal = ({ handleClose }) => {
  const navigate = useNavigate();
  const { fetchLinePayHistory, disconnectLineWallet } = useWalletPayment();
  const {
    enableHaptic,
    lineWallet,
    isTelegram,
    setUserData,
    setShowBack,
    section,
  } = useContext(MainContext);
  const userFriendlyAddress = useTonAddress();
  const [tonConnectUI, setOptions] = useTonConnectUI();

  const walletLabel =
    isTelegram && userFriendlyAddress
      ? `${userFriendlyAddress.slice(0, 9)}...${userFriendlyAddress.slice(-6)}`
      : !isTelegram && lineWallet
      ? `${lineWallet?.slice(0, 9)}...${lineWallet.slice(-6)}`
      : "Not Connected";

  const handleDisconnectWallet = async (e) => {
    handleClickHaptic(tele, enableHaptic);
    try {
      if (isTelegram) {
        await tonConnectUI.disconnect();
        setUserData((prev) => {
          return {
            ...prev,
            tonAddress: null,
          };
        });
      } else {
        await disconnectLineWallet();

        if (!liff.isInClient() || !isTelegram) {
          (async () => await deleteAuthCookie(tele))();
          setTimeout(() => {
            navigate("/");
          }, 200);
        }
      }
      handleClose();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      alert("Failed to disconnect the wallet. Please try again.");
    }
  };

  const handleFetchLineHistory = async (e) => {
    handleClickHaptic(tele, enableHaptic);

    try {
      await fetchLinePayHistory();
    } catch (error) {
      console.error("Payment History Error:", error);
      alert("Failed to fetch payment history.");
    } finally {
      handleClose();
    }
  };

  useEffect(() => {
    setShowBack(section);

    return () => {
      setShowBack(null);
    };
  }, []);

  return (
    <ModalLayout>
      <ModalItemLyt
        icon={<Wallet />}
        label={walletLabel}
        handleClick={(e) => {
          if (userData.kaiaAddress) {
            setIsHistory((prev) => !prev);
          } else {
            showToast("wallet_unlinked");
          }
        }}
      />

      <ModalItemLyt
        icon={
          <div className="flex relative pr-3">
            <Wallet className="text-gray-500" />
            <div className="border-[1.5px] -ml-3 -rotate-45"></div>
          </div>
        }
        label={"Disconnect"}
        handleClick={handleDisconnectWallet}
        placeholder={<ChevronRight />}
      />

      <ModalItemLyt
        icon={
          <div className="flex relative pr-3">
            <Wallet className="text-gray-500" />
            <div className="border-[1.5px] -ml-3 -rotate-45"></div>
          </div>
        }
        label={"Disconnect"}
        handleClick={(e) => {
          if (userData.kaiaAddress) {
            setIsHistory((prev) => !prev);
          } else {
            showToast("wallet_unlinked");
          }
        }}
        placeholder={<ChevronRight />}
      />

      {!isTelegram && (
        <ModalItemLyt
          icon={<History />}
          label={"Dapp History"}
          handleClick={handleFetchLineHistory}
          placeholder={<ChevronRight />}
        />
      )}
    </ModalLayout>
  );
};

export default WalletsModal;
