import React, { useContext, useEffect, useState } from "react";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import { useProfileGuide } from "../../../hooks/Tutorial";
import ProfileHeader from "./Header";
import { determineStreakBadge } from "../../../helpers/streak.helper";
import { hideBackButton } from "../../../utils/teleBackButton";
import { trackComponentView } from "../../../utils/ga";
import { CalendarCheck, Sigma, Wallet } from "lucide-react";
import { formatRankOrbs } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { connectLineWallet, connectTonWallet } from "../../../utils/api.fof";
import useWalletPayment from "../../../hooks/LineWallet";
import { showToast } from "../../../components/Toast/Toast";
import OrbInfoCard from "../../../components/Cards/Info/OrbInfoCard";
import HoldingsModal from "../../../components/Modals/Holdings";
import liff from "@line/liff";
import WalletsModal from "../../../components/Modals/Wallets";
import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";
import { useTonWalletConnector } from "../../../hooks/TonWallet";

const tele = window.Telegram?.WebApp;

const ProfileItem = ({ content, index, assets, userData }) => {
  return (
    <div
      onClick={content.handleClick}
      className={`flex items-center max-h-[70px] ${
        content.disabled
          ? "text-gray-300 border-gray-500"
          : "text-white border-white"
      } w-full bg-glass-black-lg border  rounded-primary p-4 shadow-md`}
    >
      {index == 5 ? (
        <div className="flex items-center rounded-full mr-3">
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
        <div className="text-[0.8rem] text-gray-300 uppercase">
          {content.label}
        </div>
        <div
          className={`${
            index == 4 ? "text-[1rem]" : "text-[1.25rem]"
          }  font-semibold`}
        >
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
    setShowBack,
    showCard,
  } = useContext(MainContext);
  const fofContext = useContext(FofContext);
  const rorContext = useContext(RorContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const [showToggles, setShowToggles] = useState(false);
  const streakBadge = determineStreakBadge(userData.streak.streakCount);
  const setShowCard =
    game === "fof" ? fofContext.setShowCard : rorContext.setShowCard;
  const setMinimize =
    game === "fof" ? fofContext.setMinimize : rorContext.setMinimize;
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

    // disable backbutton
    hideBackButton(tele);

    setTimeout(() => {
      setShowToggles(true);
    }, 300);
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
      const { accountAddress, signature, message } = await connectWallet();

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

  useEffect(() => {
    setShowBack(0);

    return () => {
      setShowBack(null);
    };
  }, [showCard]);

  return (
    <div className={`flex flex-col h-full overflow-hidden`}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        className="background-wrapper"
      >
        <div
          className={`absolute top-0 left-0 h-full w-full filter-other`}
          style={{
            backgroundImage: `url(${assets.uxui.baseBgA})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <ProfileHeader userData={userData} avatarColor={avatarColor} />

      <div className="flex flex-col justify-center items-center h-full mx-auto w-full mt-[10dvh] px-2.5">
        <div className="flex w-full min-h-[60dvh] max-w-[720px] justify-center items-center flex-col">
          <div className="grid grid-cols-2 gap-x-1.5 gap-y-[1.1dvh] w-full h-fit place-items-center">
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
      </div>
    </div>
  );
};

export default Profile;
