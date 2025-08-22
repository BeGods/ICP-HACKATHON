import { useEffect, useState } from "react";
import ProfileHeader from "./Header";
import { trackComponentView } from "../../../utils/ga";
import { CalendarCheck, Sigma, Wallet } from "lucide-react";
import { formatRankOrbs } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { connectLineWallet } from "../../../utils/api.fof";
import useDappWallet from "../../../hooks/useDappWallet";
import { showToast } from "../../../components/Toast/Toast";
import OrbInfoCard from "../../../components/Cards/Info/OrbInfoCard";
import HoldingsModal from "../../../components/Modals/Holdings";
import liff from "@line/liff";
import WalletsModal from "../../../components/Modals/Wallets";
import { useTonAddress } from "@tonconnect/ui-react";
import { useTonWallet } from "../../../hooks/useTonWallet";
import BgLayout from "../../../components/Layouts/BgLayout";
import { useDisableWrapper } from "../../../hooks/useDisableClick";
import { ItemLayout } from "../../../components/Layouts/CarouselLayout";
import { useStore } from "../../../store/useStore";

const tele = window.Telegram?.WebApp;

const ProfileItem = ({ content }) => {
  const { wrapWithDisable } = useDisableWrapper();

  return (
    <ItemLayout
      handleClick={() => {
        wrapWithDisable(content.handleClick);
      }}
      item={{
        icon: content.icon,
        title: content.label,
        desc: [content.value, ""],
        disable: content.disabled,
      }}
      isSmall={true}
    />
  );
};

const Profile = (props) => {
  const userData = useStore((s) => s.userData);
  const assets = useStore((s) => s.assets);
  const game = useStore((s) => s.game);
  const lineWallet = useStore((s) => s.lineWallet);
  const isTelegram = useStore((s) => s.isTelegram);
  const enableHaptic = useStore((s) => s.enableHaptic);
  const authToken = useStore((s) => s.authToken);
  const setSection = useStore((s) => s.setSection);
  const setShowCard = useStore((s) => s.setShowCard);
  const gameData = useStore((s) => s.gameData);

  // const fofContext = useContext(FofContext);
  // const rorContext = useContext(RorContext);
  // const gameData = game === "fof" ? fofContext.gameData : rorContext.gameData;

  const avatarColor = localStorage.getItem("avatarColor");
  const { connectWallet } = useDappWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const userFriendlyAddress = useTonAddress();
  const { handleConnectTonWallet } = useTonWallet();
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
        if (game == "fof") {
          setSection(7);
        } else {
          setSection(10);
        }
      },
    },
    {
      icon: <Sigma size={"1.8rem"} />,
      label: game == "fof" ? "ORB(S)" : "COIN(S)",
      value:
        (game == "fof"
          ? formatRankOrbs(
              1000 * gameData?.blackOrbs +
                2 * gameData?.multiColorOrbs +
                gameData.mythologies.reduce((sum, itm) => sum + itm.orbs, 0)
            )
          : formatRankOrbs(gameData.stats.gobcoin)) ?? 0,
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
      label: "INVITES",
      value: userData.directReferralCount ?? 0,
      handleClick: () => {
        (async () => await handleCopyLink())();
      },
    },
    {
      icon: <CalendarCheck size={"1.8rem"} />,
      label: "Streak",
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
      icon: <div className="font-symbols text-[1.8rem]">A</div>,
      label: "FUNDS",
      value: "USDT | KAIA",
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
