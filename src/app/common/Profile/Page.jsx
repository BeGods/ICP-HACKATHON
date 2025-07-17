import React, { useContext, useEffect, useState } from "react";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import ProfileHeader from "./Header";
import { trackComponentView } from "../../../utils/ga";
import { CalendarCheck, Sigma, Wallet } from "lucide-react";
import { formatRankOrbs } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { connectLineWallet } from "../../../utils/api.fof";
import useWalletPayment from "../../../hooks/LineWallet";
import { showToast } from "../../../components/Toast/Toast";
import OrbInfoCard from "../../../components/Cards/Info/OrbInfoCard";
import HoldingsModal from "../../../components/Modals/Holdings";
import liff from "@line/liff";
import WalletsModal from "../../../components/Modals/Wallets";
import { useTonAddress } from "@tonconnect/ui-react";
import { useTonWalletConnector } from "../../../hooks/TonWallet";
import BgLayout from "../../../components/Layouts/BgLayout";
import { useDisableWrapper } from "../../../hooks/disableWrapper";

const tele = window.Telegram?.WebApp;

const ProfileItem = ({ content, index, assets, userData }) => {
  const { wrapWithDisable } = useDisableWrapper();

  return (
    <div
      onClick={() => {
        wrapWithDisable(content.handleClick);
      }}
      className={`flex items-center h-[4.65rem] ${
        content.disabled
          ? "text-gray-300 border-gray-500"
          : "text-white border-white"
      } w-full bg-glass-black-lg border gap-x-1.25 rounded-primary p-4 shadow-md`}
    >
      {index == 5 ? (
        <div className="flex items-center  rounded-full mr-3">
          <div className="z-20">{content.icon}</div>
          <div className="z-10 -ml-3">
            {" "}
            <img
              src={assets.misc.usdt}
              alt="earn"
              className="w-[2rem] h-[2rem]"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-full mr-3">{content.icon}</div>
      )}
      <div>
        <div className="text-tertiary text-gray-300 uppercase">
          {content.label}
        </div>
        <div className={`text-tertiary font-semibold`}>
          {index == 5 ? (
            <div className="flex justify-between w-full">
              <span>{content.value}</span> <span>|</span>{" "}
              <span>{userData.holdings.usdt}</span>
            </div>
          ) : (
            content.value
          )}
        </div>
      </div>
    </div>
  );
};

const Profile = (props) => {
  const {
    userData,
    assets,
    game,
    lineWallet,
    isTelegram,
    enableHaptic,
    authToken,
    setSection,
    setShowCard,
  } = useContext(MainContext);
  const fofContext = useContext(FofContext);
  const rorContext = useContext(RorContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const gameData = game === "fof" ? fofContext.gameData : rorContext.gameData;
  const { connectWallet } = useWalletPayment();
  const [isConnecting, setIsConnecting] = useState(false);
  const userFriendlyAddress = useTonAddress();
  const { handleConnectTonWallet } = useTonWalletConnector();
  const walletLabel =
    isTelegram && userFriendlyAddress
      ? `${userFriendlyAddress.slice(0, 4)}...${userFriendlyAddress.slice(-4)}`
      : !isTelegram && lineWallet
      ? `${lineWallet?.slice(0, 6)}...${lineWallet.slice(-4)}`
      : "Connect";

  useEffect(() => {
    // ga
    trackComponentView("profile");
  }, []);

  const handleCopyLink = async () => {
    try {
      handleClickHaptic(tele, enableHaptic);

      if (isTelegram) {
        await navigator.clipboard.writeText(
          `https://t.me/BeGods_bot/games?startapp=${userData.referralCode}`
        );
      } else if (liff.isInClient()) {
        const permanentLink = await liff.permanentLink.createUrlBy(
          `${import.meta.env.VITE_CLIENT}?refer=${userData.referralCode}`
        );

        if (liff.isApiAvailable("shareTargetPicker")) {
          liff.shareTargetPicker([
            {
              type: "text",
              text: `🚀 Join BeGods Launcher! ${permanentLink}`,
            },
          ]);
        }

        await navigator.clipboard.writeText(permanentLink);
      } else {
        await navigator.clipboard.writeText(
          `${import.meta.env.VITE_CLIENT}?refer=${userData.referralCode}`
        );
      }

      showToast("copy_link");
    } catch (error) {
      alert(error?.message || String(error));
    }
  };

  const handleConnectLineWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      const { signature, message } = await connectWallet();

      await connectLineWallet(signature, message, authToken);
    } catch (error) {
      console.error("Wallet Connection Error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // dynamic icoon for rank
  // after wallet connected show ton/kaia
  const profileDetails = [
    {
      icon: <div className="font-symbols text-[1.8rem]">$</div>,
      label: "Rank",
      value: userData.orbRank ?? 0,
      handleClick: () => {
        setSection(7);
      },
    },
    {
      icon: <Sigma size={"1.8rem"} />,
      label: "Total Orbs",
      value:
        formatRankOrbs(
          1000 * gameData.blackOrbs +
            2 * gameData.multiColorOrbs +
            gameData.mythologies.reduce((sum, itm) => sum + itm.orbs, 0)
        ) ?? 0,
      handleClick: () => {
        setShowCard(
          <OrbInfoCard
            gameData={gameData}
            close={() => {
              setShowCard(null);
            }}
          />
        );
      },
    },
    {
      icon: <div className="font-symbols text-[1.8rem]">u</div>,
      label: "Referrals",
      value: userData.directReferralCount ?? 0,
      handleClick: () => {
        (async () => await handleCopyLink())();
      },
    },
    {
      icon: <CalendarCheck size={"1.8rem"} />,
      label: "Streak Day",
      value: userData.streak.streakCount ?? 0,
      handleClick: () => {},
    },
    {
      icon: <Wallet size={"1.8rem"} />,
      label: "Wallet",
      value: walletLabel,
      disabled: false,
      handleClick: () => {
        if (!isTelegram) {
          if (lineWallet) {
            setShowCard(<WalletsModal handleClose={() => setShowCard(null)} />);
          } else {
            (async () => await handleConnectLineWallet())();
          }
        } else {
          if (userFriendlyAddress) {
            setShowCard(<WalletsModal handleClose={() => setShowCard(null)} />);
          } else {
            handleConnectTonWallet();
          }
        }
      },
    },
    {
      icon: (
        <img
          src={isTelegram ? assets.misc.tgStar : assets.misc.kaia}
          alt="earn"
          className="w-[2.2rem] h-[2.2rem]"
        />
      ),
      label: "Holdings",
      value: isTelegram
        ? userData.holdings.stars ?? 0
        : userData.holdings.kaia ?? 0,
      handleClick: () => {
        setShowCard(<HoldingsModal handleClose={() => setShowCard(null)} />);
      },
    },
  ];

  return (
    <BgLayout>
      <ProfileHeader userData={userData} avatarColor={avatarColor} />

      <div className="absolute inset-x-0 flex top-gameMargins bottom-gameMargins justify-center items-center z-10 mx-auto max-w-[720px] px-[6px]">
        <div className="grid grid-cols-2 gap-item w-full h-fit place-items-center">
          {profileDetails.map((itm, idx) => (
            <ProfileItem
              key={idx}
              assets={assets}
              index={idx}
              content={itm}
              userData={userData}
            />
          ))}
        </div>
      </div>
    </BgLayout>
  );
};

export default Profile;
