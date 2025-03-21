import React, { useContext, useState } from "react";
import { ChevronDown, ChevronUp, LogOut, Settings, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../context/context";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { connectLineWallet, disconnectLineWallet } from "../../utils/api.fof";
import { connectWallet, initializeWalletSDK } from "../../hooks/LineWallet";

const tele = window.Telegram?.WebApp;

const TgHeader = ({ openSettings, hideExit, isLoaded }) => {
  const { enableHaptic, isTelegram, authToken, setLineWallet, lineWallet } =
    useContext(MainContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleConnectLineWallet = async () => {
    handleClickHaptic(tele, enableHaptic);
    try {
      const { kaiaProvider } = await initializeWalletSDK();
      const account = await connectWallet(kaiaProvider);
      if (account) {
        setLineWallet(account);
        await connectLineWallet(account, authToken);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleDisconnectLineWallet = async () => {
    handleClickHaptic(tele, enableHaptic);
    try {
      setShowModal(false);
      const { lineProvider } = await initializeWalletSDK();
      await lineProvider.disconnectWallet();
      setLineWallet(null);
      await disconnectLineWallet(authToken);
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
            <Wallet onClick={handleConnectLineWallet} />
          )}
        </>
      )}
      {!hideExit && (
        <LogOut
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            navigate(-1);
          }}
        />
      )}
      <Settings
        size={"6vw"}
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          openSettings();
        }}
      />
      {showModal && (
        <div
          onClick={handleDisconnectLineWallet}
          className="bg-black p-3 rounded-md absolute mt-9"
        >
          <div className="bg-white px-2 py-1 rounded-md text-black">
            Disconnect
          </div>
        </div>
      )}
    </div>
  );
};

export default TgHeader;
