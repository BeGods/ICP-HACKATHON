import React, { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  LogOut,
  Settings,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../context/context";
import {
  deleteExpCookie,
  handleClickHaptic,
} from "../../helpers/cookie.helper";
import { connectLineWallet } from "../../utils/api.fof";
import { useTranslation } from "react-i18next";
import useWalletPayment from "../../hooks/LineWallet";

const tele = window.Telegram?.WebApp;

const TgHeader = ({ openSettings, hideExit, isLoaded, showMobileAuth }) => {
  const { connectWallet, fetchLinePayHistory, disonnectWallet } =
    useWalletPayment();
  const { enableHaptic, isTelegram, authToken, setLineWallet, lineWallet } =
    useContext(MainContext);
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dots, setDots] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleConnectLineWallet = async () => {
    try {
      const { accountAddress } = await connectWallet();
      if (accountAddress) {
        setLineWallet(accountAddress);
        await connectLineWallet(accountAddress, authToken);
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleDisconnectLineWallet = async () => {
    handleClickHaptic(tele, enableHaptic);
    try {
      await disonnectWallet();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleFetchLineHistory = async () => {
    handleClickHaptic(tele, enableHaptic);
    setShowLoading(true);
    try {
      await fetchLinePayHistory();
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setShowLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div
      className={`absolute flex gap-x-5 ${
        isTelegram ? "right-[94px] top-[-35px]" : "right-[20px] top-[-32px]"
      } text-white z-50`}
    >
      {!hideExit && !isTelegram && (
        <>
          {lineWallet && isLoaded ? (
            <div
              className="flex items-center bg-gray-800 pr-1 pl-3 py-0.5 -mt-0.5 rounded-full cursor-pointer"
              onClick={() => {
                handleClickHaptic(tele, enableHaptic);
                setShowModal((prev) => !prev);
              }}
            >
              <h1 className="text-gray-300">{lineWallet?.slice(0, 5)}</h1>
              {showModal ? (
                <ChevronUp size={20} strokeWidth={2} />
              ) : (
                <ChevronDown size={20} strokeWidth={2} />
              )}
            </div>
          ) : (
            <Wallet
              size={24}
              onClick={handleConnectLineWallet}
              className="cursor-pointer"
            />
          )}
        </>
      )}
      {!hideExit && (
        <LogOut
          onClick={async () => {
            handleClickHaptic(tele, enableHaptic);
            await deleteExpCookie(tele);
            navigate(-1);
          }}
          size={24}
          className="cursor-pointer"
        />
      )}
      <Settings
        size={24}
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          openSettings();
        }}
        className="cursor-pointer"
      />
      {showModal && (
        <div className="bg-black p-3 flex flex-col gap-y-4 rounded-md absolute mt-9">
          <button
            onClick={handleDisconnectLineWallet}
            className="bg-white px-2 py-1 rounded-md text-black text-md"
          >
            Disconnect
          </button>
          <button
            onClick={handleFetchLineHistory}
            className="bg-white px-2 py-1 rounded-md text-black text-md"
          >
            Payment History
          </button>
        </div>
      )}
      {showLoading && (
        <div className="fixed flex flex-col justify-center items-center inset-0 bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
          <div className="text-white font-fof text-black-contour text-[1.5rem] relative font-medium">
            {t("keywords.load")}
            <span className="absolute">{".".repeat(dots)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TgHeader;
