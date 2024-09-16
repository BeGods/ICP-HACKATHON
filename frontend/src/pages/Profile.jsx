import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";
import {
  Gift,
  Settings,
  Speech,
  Trophy,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import ProfileCard from "../components/Cards/ProfileCard";
import { MyContext } from "../context/context";
import Avatar from "../components/Common/Avatar";
import { useTranslation } from "react-i18next";
import Language from "../components/Modals/Language";
import { showToast } from "../components/Toast/Toast";
import { connectTonWallet } from "../utils/api";
import Header from "../components/Headers/Header";
import Footer from "../components/Common/Footer";
import { ProfileGuide } from "../components/Common/Tutorial";

const tele = window.Telegram?.WebApp;

const HeaderContent = ({
  userData,
  avatarColor,
  handleLeaderboard,
  handleSection,
  t,
  activeSection,
}) => {
  return (
    <div className="flex justify-between relative w-full">
      {/* Left */}
      <div
        onClick={() => {
          if (!activeSection) {
            handleSection();
          }
        }}
        className="flex flex-col justify-between h-full px-2 pt-1 z-10"
      >
        <h1
          className={`${
            activeSection
              ? "text-head text-black-contour uppercase text-white"
              : "text-head text-white-contour uppercase text-black"
          }
           `}
        >
          {t("profile.player")}
        </h1>
      </div>
      <div className="flex absolute justify-center w-full">
        <div className="h-[36vw] w-[36vw] -mt-5">
          <Avatar
            name={userData.telegramUsername}
            profile={1}
            color={avatarColor}
          />
        </div>
      </div>
      {/* Right */}
      <div
        onClick={handleSection}
        className="flex flex-col items-end justify-between h-full px-2 pt-1 z-10"
      >
        <h1
          className={`${
            !activeSection
              ? "text-head text-black-contour uppercase text-white"
              : "text-head text-white-contour uppercase text-black"
          }`}
        >
          {t("profile.tasks")}
        </h1>
      </div>
    </div>
  );
};

const Profile = (props) => {
  const { t } = useTranslation();
  const { userData, setSection } = useContext(MyContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const [showLang, setShowLang] = useState(false);
  const [isClicked, setIsClicked] = useState(0);
  const userFriendlyAddress = useTonAddress();
  const [activeSection, setActiveSection] = useState(true);
  const [enableGuide, setEnableGuide] = useState(false);
  const { state } = useTonConnectModal();

  useEffect(() => {
    let guide = JSON.parse(localStorage.getItem("guide"));
    if (!guide.includes(3)) {
      setEnableGuide(true);
      setTimeout(() => {
        setEnableGuide(false);
        guide.push(3);
        localStorage.setItem("guide", JSON.stringify(guide));
      }, 5000);
    }
  }, []);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(
      `https://t.me/BeGods_bot/forgesoffaith?startapp=${userData.referralCode}`
    );
    showToast("copy_link");
  };

  const handleConnectTon = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      await connectTonWallet({ tonAddress: userFriendlyAddress }, accessToken);
      localStorage.setItem("tonConnected", "true");
      showToast("ton_connect_success");
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("ton_connect_error");
    }
  };

  useEffect(() => {
    if (
      state.closeReason == "wallet-selected" &&
      state.status == "closed" &&
      !localStorage.getItem("tonConnected")
    ) {
      handleConnectTon();
    }
  }, [state]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
      }}
      className="flex flex-col h-screen overflow-hidden m-0"
    >
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
            backgroundImage: `url(/assets/uxui/fof.base.background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <Header
        children={
          <HeaderContent
            activeSection={activeSection}
            avatarColor={avatarColor}
            userData={userData}
            t={t}
            handleSection={() => {
              tele.HapticFeedback.notificationOccurred("success");
              setActiveSection((prev) => !prev);
            }}
          />
        }
      />
      {/* Content */}
      {activeSection ? (
        <div className="flex flex-col relative flex-grow justify-center items-center">
          <div className="top-0 flex justify-center relative w-full px-2">
            <div className="text-center top-0">
              <h2 className="text-white uppercase text-tertiary mt-2">
                {t(`main.fdg`)}
              </h2>
              <h1 className="text-tertiary -mt-1 ">
                {userData.telegramUsername}
              </h1>
            </div>
            <div
              className="h-icon-primary w-icon-primary bg-glass-black  flex justify-center items-center absolute right-0 mr-[30px]  z-10  border rounded-full p-3.5"
              onClick={() => {
                setShowLang(true);
              }}
            >
              <Settings size={"30px"} color="white" />
            </div>
          </div>
          <div className="relative w-full flex flex-col flex-grow">
            <div className="flex px-2 text-white gap-2 mt-2.5 flex-col items-center justify-center w-full">
              <div
                onClick={() => {
                  tele.HapticFeedback.notificationOccurred("success");
                  setSection(4);
                }}
                className="flex gap-2 -mt-1.5 uppercase justify-center items-center w-full"
              >
                <Trophy size={"6vw"} color="#FFD660" />
                <h1 className="mt-1 text-tertiary text-gold">
                  {t(`profile.leaderboard`)}
                </h1>
              </div>
              <div
                onMouseDown={() => {
                  setIsClicked(1);
                }}
                onMouseUp={() => {
                  setIsClicked(0);
                }}
                onMouseLeave={() => {
                  setIsClicked(0);
                }}
                onTouchStart={() => {
                  setIsClicked(1);
                }}
                onTouchEnd={() => {
                  setIsClicked(0);
                }}
                onTouchCancel={() => {
                  setIsClicked(0);
                }}
                className={`text-center  text-tertiary w-full  rounded-primary`}
              >
                <div className="flex  items-center justify-center gap-[8px]">
                  <div
                    onClick={() => {
                      tele.HapticFeedback.notificationOccurred("success");
                      setSection(4);
                    }}
                    className="flex  bg-glass-black h-button-primary border border-white items-center gap-[20px] rounded-primary w-full p-[10px]"
                  >
                    <User size={"13vw"} />
                    <div className="text-left">
                      <h3 className="text-tertiary uppercase">
                        {t("profile.player")}
                      </h3>
                      <h2 className="text-secondary">
                        #{userData.overallRank === 0 ? 1 : userData.overallRank}
                      </h2>
                    </div>
                  </div>
                  <div className="flex  bg-glass-black h-button-primary items-center border border-cardsGray text-cardsGray  grayscale  gap-[20px] rounded-primary w-full p-[10px]">
                    <Users size={"13vw"} />
                    <div className="text-left">
                      <h3 className="text-tertiary uppercase">
                        {t("profile.squad")}
                      </h3>
                      <h2 className="text-secondary">
                        #{userData.squadRank === 0 ? 1 : userData.squadRank}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 uppercase justify-center items-center mt-2 w-full">
                <UserPlus size={"6vw"} color="#FFD660" />
                <h1 className="mt-1 text-tertiary text-gold">
                  {t(`profile.invite`)}
                </h1>
              </div>
              <div
                onMouseDown={() => {
                  setIsClicked(2);
                }}
                onMouseUp={() => {
                  setIsClicked(0);
                }}
                onMouseLeave={() => {
                  setIsClicked(0);
                }}
                onTouchStart={() => {
                  setIsClicked(2);
                }}
                onTouchEnd={() => {
                  setIsClicked(0);
                }}
                onTouchCancel={() => {
                  setIsClicked(0);
                }}
                className={`text-center  w-full text-tertiary  rounded-primary`}
              >
                <div className="flex gap-[8px] ">
                  <div className="flex border h-button-primary border-white items-center gap-[20px] rounded-primary bg-glass-black w-full p-[10px]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-tertiary uppercase">Referrals</h3>
                      <h2 className="text-secondary">
                        {userData.directReferralCount}
                      </h2>
                    </div>
                  </div>
                  <div className="flex border h-button-primary border-cardsGray text-cardsGray items-center grayscale gap-[20px] rounded-primary bg-glass-black w-full p-[10px]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-tertiary uppercase">
                        {t(`profile.premium`)}
                      </h3>
                      <h2 className="text-secondary">
                        {userData.premiumReferralCount}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 uppercase justify-center items-center mt-2 w-full">
                <Gift size={"6vw"} color="#FFD660" />
                <h1 className="mt-1 text-tertiary text-gold">Rewards</h1>
              </div>
              <div
                onMouseDown={() => {
                  setIsClicked(2);
                }}
                onMouseUp={() => {
                  setIsClicked(0);
                }}
                onMouseLeave={() => {
                  setIsClicked(0);
                }}
                onTouchStart={() => {
                  setIsClicked(2);
                }}
                onTouchEnd={() => {
                  setIsClicked(0);
                }}
                onTouchCancel={() => {
                  setIsClicked(0);
                }}
                className={`text-center w-full text-tertiary rounded-primary`}
              >
                <div className="flex gap-[8px]">
                  <div className="flex justify-center border h-button-primary border-cardsGray text-cardsGray items-center grayscale gap-[20px] rounded-primary bg-glass-black w-full p-[10px]">
                    COMING SOON
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col px-2 gap-2 relative flex-grow justify-start items-cente pt-4">
          <ProfileCard />
          <ProfileCard />
        </div>
      )}

      {enableGuide && (
        <ProfileGuide
          handleClick={() => {
            setEnableGuide(false);
          }}
        />
      )}

      <Footer />
      {showLang && (
        <Language
          close={() => {
            setShowLang(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;

{
  /* <div className="text-center grayscale opacity-50 outline outline-[0.5px] outline-gray-600 text-tertiary bg-black w-full p-[15px] mt-2.5 rounded-primary">
                <div className="flex gap-2 uppercase justify-center items-center w-full pb-1">
                  <Speech size={"6vw"} color="white" />
                  <h1 className="mt-1">KOL(s)</h1>
                </div>
              </div> */
}
