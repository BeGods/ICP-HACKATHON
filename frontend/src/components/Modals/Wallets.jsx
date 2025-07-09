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
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex relative modal-width w-fit -mt-[2.5rem] bg-[#1D1D1D] rounded-primary justify-center items-center flex-col card-shadow-white p-4`}
      >
        <div
          onClick={handleClose}
          className={`absolute cursor-pointer flex w-full justify-end top-0 right-0 -mt-4 -mr-4 `}
        >
          <div className="absolute flex justify-center items-center  bg-black rounded-full w-[40px] h-[40px]">
            <div className="text-white font-roboto text-black-contour text-[1.25rem]">
              {"\u2715"}
            </div>
          </div>
        </div>

        <div className="flex text-tertiary text-white text-left w-full mt-6 pl-4">
          <div className="flex justify-start -ml-3">
            <Wallet />
          </div>
          <div className="flex justify-between w-full">
            <div className="pl-3">{walletLabel}</div>
          </div>
        </div>

        <div className="flex text-tertiary text-white text-left w-full mt-6 pl-4">
          <div className="flex justify-start relative -ml-3">
            <Wallet className="text-gray-500" />
            <div className="border-[1.5px] -ml-3 -rotate-45"></div>
          </div>
          <div
            onClick={handleDisconnectWallet}
            className="flex justify-between w-full"
          >
            <div className="pl-6">Disconnect</div>
            <ChevronRight />
          </div>
        </div>

        {!isTelegram && (
          <div
            onClick={handleFetchLineHistory}
            className="flex text-tertiary text-white text-left w-full mt-6 pl-4"
          >
            <div className="flex justify-start -ml-3">
              <History />
            </div>
            <div className="flex justify-between w-full">
              <div className="pl-3">Dapp History</div>

              <ChevronRight />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletsModal;
