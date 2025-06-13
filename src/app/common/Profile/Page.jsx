import React, { useContext, useEffect, useState } from "react";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import { ProfileGuide } from "../../../components/Common/Tutorials";
import { useProfileGuide } from "../../../hooks/Tutorial";
import ProfileHeader from "./Header";
import TaskCarousel from "../../../components/Carousel/TaskCarousel";
import { determineStreakBadge } from "../../../helpers/streak.helper";
import {
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import { hideBackButton } from "../../../utils/teleBackButton";
import { trackComponentView } from "../../../utils/ga";
import { CalendarCheck, Sigma, Wallet } from "lucide-react";
import { formatRankOrbs } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import {
  connectLineWallet,
  disconnectLineWallet,
} from "../../../utils/api.fof";
import useWalletPayment from "../../../hooks/LineWallet";
import WalletsModal from "../../../components/Modals/Wallets";
import { showToast } from "../../../components/Toast/Toast";
import { toast } from "react-toastify";
import OrbInfoCard from "../../../components/Cards/Info/OrbInfoCard";

const tele = window.Telegram?.WebApp;

const ProfileItem = ({ content, index }) => {
  return (
    <div
      onClick={content.handleClick}
      className={`flex items-center max-h-[70px] ${
        content.disabled
          ? "text-gray-300 border-gray-500"
          : "text-white border-white"
      } w-full bg-glass-black border  rounded-primary p-4 shadow-md`}
    >
      <div className="rounded-full mr-3">{content.icon}</div>
      <div>
        <div className="text-[0.8rem] text-gray-300 uppercase">
          {content.label}
        </div>
        <div
          className={`${
            index == 4 ? "text-[1rem]" : "text-[1.25rem]"
          }  font-semibold`}
        >
          {content.value}
        </div>
      </div>
    </div>
  );
};

const Profile = (props) => {
  const {
    userData,
    assets,
    setSection,
    game,
    lineWallet,
    isTelegram,
    enableHaptic,
  } = useContext(MainContext);
  const fofContext = useContext(FofContext);
  const rorContext = useContext(RorContext);
  const [showModal, setShowModal] = useState(false);
  const avatarColor = localStorage.getItem("avatarColor");
  const [enableGuide, setEnableGuide] = useProfileGuide("tutorial04");
  const [showToggles, setShowToggles] = useState(false);
  const streakBadge = determineStreakBadge(userData.streak.streakCount);
  const setShowCard =
    game === "fof" ? fofContext.setShowCard : rorContext.setShowCard;
  const gameData = game === "fof" ? fofContext.gameData : rorContext.gameData;
  const { connectWallet } = useWalletPayment();
  const [isConnecting, setIsConnecting] = useState(false);

  // useEffect(() => {
  //   if (enableGuide) {
  //     setShowCard(
  //       <ProfileGuide
  //         Header={
  //           <ProfileHeader
  //             showGuide={0}
  //             userData={userData}
  //             avatarColor={avatarColor}
  //           />
  //         }
  //         currGuide={0}
  //         Toggles={
  //           <>
  //             <ToggleLeft
  //               minimize={2}
  //               handleClick={() => {
  //                 setSection(5);
  //               }}
  //               activeMyth={4}
  //             />
  //             <ToggleRight
  //               minimize={2}
  //               handleClick={() => {
  //                 setSection(5);
  //               }}
  //               activeMyth={4}
  //             />
  //           </>
  //         }
  //         currQuest={tasks[0]}
  //         handleClick={() => {
  //           setShowCard(null);
  //         }}
  //       />
  //     );
  //   }
  // }, [enableGuide]);

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
          liff.sendMessages([
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
      const walletData = await connectWallet();
      if (!walletData) {
        return;
      }
      const { signature, message } = walletData;
      await connectLineWallet(signature, message, authToken);
    } catch (error) {
      console.error("Wallet Connection Error:", error);
      alert("An error occurred while connecting the wallet.");
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
      value: userData.rank ?? 0,
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
      icon: <Sigma size={"1.8rem"} />,
      label: "Total Orbs",
      value: formatRankOrbs(userData.totalOrbs) ?? 0,
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
      value: userData.referrals ?? 0,
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
      value: isTelegram
        ? "Coming Soon"
        : lineWallet
        ? lineWallet?.slice(0, 5)
        : "Connect",
      disabled: !userData.kaiaAddress ? true : false,
      handleClick: () => {
        if (!isTelegram) {
          if (lineWallet) {
            setShowCard(<WalletsModal handleClose={() => setShowCard(null)} />);
          } else {
            (async () => await handleConnectLineWallet())();
          }
        } else {
          alert("Coming Soon.");
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
      label: "Earned",
      value: 0,
      handleClick: () => {
        toast.info("Atleast need 10 Kaia to withdraw");
      },
    },
  ];

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

      <div className="flex flex-col justify-center items-center absolute h-full w-full bottom-0 px-2.5">
        <div className="font-fof absolute top-0 text-[2rem] mt-[9rem] uppercase text-gold drop-shadow z-50 text-black-contour">
          {userData.username}
        </div>
        <div className="flex w-full min-h-[60dvh] max-w-[720px] justify-center items-center flex-col">
          <div className="grid grid-cols-2 gap-x-1.5 gap-y-4 w-full h-fit place-items-center">
            {profileDetails.map((itm, idx) => (
              <ProfileItem key={idx} index={idx} content={itm} />
            ))}
          </div>
        </div>
      </div>

      {/* <div className="bg-black p-3 flex flex-col gap-y-4 rounded-md absolute mt-9">
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
      </div> */}
    </div>
  );
};

export default Profile;
