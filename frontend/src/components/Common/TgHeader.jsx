import React, { useContext, useState } from "react";
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
import { connectLineWallet, disconnectLineWallet } from "../../utils/api.fof";
import { connectWallet, initializeWalletSDK } from "../../hooks/LineWallet";

const tele = window.Telegram?.WebApp;

const TgHeader = ({ openSettings, hideExit, isLoaded, showMobileAuth }) => {
  const { enableHaptic, isTelegram, authToken, setLineWallet, lineWallet } =
    useContext(MainContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleConnectLineWallet = async () => {
    try {
      const { lineProvider } = await initializeWalletSDK();
      const { accountAddress, signature, message } = await connectWallet(
        lineProvider
      );
      if (accountAddress) {
        setLineWallet(accountAddress);
        await connectLineWallet(message, signature, authToken);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleDisconnectLineWallet = async () => {
    handleClickHaptic(tele, enableHaptic);
    try {
      await disconnectLineWallet(authToken);
      const { lineProvider } = await initializeWalletSDK();
      lineProvider.disconnectWallet();
      lineProvider.disconnect();
      setLineWallet(null);
      setShowModal(false);
    } catch (error) {
      console.log(error);
      alert(error);
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
              className="flex items-center bg-gray-800 pr-1 pl-3 py-0.5 -mt-0.5 rounded-full"
              onClick={() => {
                handleClickHaptic(tele, enableHaptic);
                setShowModal((prev) => !prev);
              }}
            >
              <h1 className="text-gray-300">{lineWallet?.slice(0, 5)}</h1>
              {showModal ? (
                <ChevronUp size={"20px"} strokeWidth={2} />
              ) : (
                <ChevronDown size={"20px"} strokeWidth={2} />
              )}
            </div>
          ) : (
            <Wallet size={"1.5rem"} onClick={handleConnectLineWallet} />
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
          size={"1.5rem"}
        />
      )}
      <Settings
        size={"1.5rem"}
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          openSettings();
        }}
      />
      {showModal && (
        <div className="bg-black p-3 flex-col gap-y-2 rounded-md absolute mt-9">
          <div
            onClick={handleDisconnectLineWallet}
            className="bg-white px-2 py-1 rounded-md text-black text-md"
          >
            Disconnect
          </div>
        </div>
      )}
    </div>
  );
};

export default TgHeader;
