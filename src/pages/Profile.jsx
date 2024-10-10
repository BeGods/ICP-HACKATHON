import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";
import { HeartHandshake, Settings, User, Users } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import { useTranslation } from "react-i18next";
import SettingModal from "../components/Modals/Settings";
import { showToast } from "../components/Toast/Toast";
import MilestoneCard from "../components/Cards/MilestoneCard";
import { connectTonWallet } from "../utils/api";
import Header from "../components/Headers/Header";
import Footer from "../components/Common/Footer";
import { ProfileGuide } from "../components/Common/Tutorial";
import { useProfileGuide } from "../hooks/Tutorial";

const tele = window.Telegram?.WebApp;

const HeaderContent = ({ userData, avatarColor, handleSection, t }) => {
  return (
    <div className="flex justify-between w-full">
      <div
        className={`text-primary -mt-1 mx-auto  w-full text-center top-0 absolute z-30 text-white text-black-lg-contour uppercase`}
      >
        {userData.telegramUsername}
      </div>
      <div className="relative flex justify-center w-full">
        {/* Left */}
        <div className="relative">
          <img
            src="/assets/uxui/390px-header-new.png"
            alt="left"
            className={`left-0 h-[36vw] `}
          />
          <div className="absolute flex w-full justify-center top-0 z-50">
            <div
              onClick={handleSection}
              className="flex flex-col items-end justify-between h-full mt-1 mr-[12vw] z-10"
            >
              <div className="font-symbols text-white text-[11vw] ml-2">u</div>
            </div>
          </div>
        </div>
        {/* Orb */}
        <div className="flex absolute justify-center w-full z-20">
          <div
            className={`h-[36vw] flex justify-center mt-0.5 items-center relative text-white w-[36vw] ${avatarColor} rounded-full`}
          >
            <div className="absolute flex flex-col text-center justify-center">
              <div className="text-primary uppercase">
                {userData.telegramUsername}
              </div>
              <h2 className="uppercase text-secondary text-black">
                {t(`main.fdg`)}
              </h2>
            </div>
          </div>
        </div>
        {/* Right */}
        <img
          src="/assets/uxui/390px-header-new.png"
          alt="left"
          className={`right-0 transform scale-x-[-1]  h-[36vw]`}
        />
        <div className="absolute ml-[60vw] mt-3 flex w-full justify-center top-0 z-50">
          <Settings size={"13vw"} color="white" />
        </div>
      </div>
    </div>
  );
};

const Profile = (props) => {
  const { t } = useTranslation();
  const { userData, setSection, authToken } = useContext(MyContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const [showLang, setShowLang] = useState(false);
  const [isClicked, setIsClicked] = useState(0);
  const userFriendlyAddress = useTonAddress();
  const [activeSection, setActiveSection] = useState(true);
  const [enableGuide, setEnableGuide] = useProfileGuide("tut4");
  const [playAudio, setPlayAudio] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const { state } = useTonConnectModal();

  const handleCopyLink = async () => {
    tele.HapticFeedback.notificationOccurred("success");

    await navigator.clipboard.writeText(
      `https://t.me/BeGods_bot/forgesoffaith?startapp=${userData.referralCode}`
    );
    showToast("copy_link");
  };

  const handleConnectTon = async () => {
    try {
      await connectTonWallet({ tonAddress: userFriendlyAddress }, authToken);
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

  useEffect(() => {
    setPlayAudio(true);
    setTimeout(() => {
      setPlayAudio(false);
    }, 1000);
  }, []);

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
            backgroundImage: `url(/assets/uxui/1160px-fof.base.background.jpg)`,
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
            showLang={() => {
              tele.HapticFeedback.notificationOccurred("success");
              setShowLang(true);
            }}
            handleSection={handleCopyLink}
          />
        }
      />
      <div className="flex flex-grow justify-center items-center"></div>

      {/* Content */}
      <div className="flex justify-center h-screen w-screen absolute mx-auto">
        <div className="flex flex-col w-full items-center justify-center gap-[15px]">
          <div>
            <div
              style={{
                backgroundImage: `url((/assets/cards/320px-info_background.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
              className="relative w-screen flex flex-col flex-grow"
            >
              <div className="flex px-2 text-white gap-2 mt-2.5 flex-col items-center justify-center w-full">
                <div
                  onClick={() => {
                    tele.HapticFeedback.notificationOccurred("success");
                    setSection(7);
                  }}
                  className="flex gap-2 -mt-1.5 justify-center items-center w-full"
                >
                  <div className="font-symbols text-gold">r</div>
                  <h1 className="mt-1 text-tertiary text-gold uppercase">
                    {t(`sections.leaderboard`)}
                  </h1>
                </div>
                <div
                  className={`text-center  text-tertiary w-full  rounded-primary`}
                >
                  <div className="flex  items-center justify-center gap-[8px]">
                    <div
                      onClick={() => {
                        tele.HapticFeedback.notificationOccurred("success");
                        setSection(7);
                      }}
                      className="flex  bg-glass-black h-button-primary border border-white items-center gap-[10px] rounded-primary w-full p-[10px]"
                    >
                      <User size={"13vw"} />
                      <div className="text-left">
                        <h3 className="text-tertiary">{t("profile.player")}</h3>
                        <h2 className="text-secondary">
                          #
                          {userData.overallRank === 0
                            ? 1
                            : userData.overallRank}
                        </h2>
                      </div>
                    </div>
                    <div className="flex  bg-glass-black h-button-primary items-center border border-cardsGray text-cardsGray  grayscale  gap-[10px] rounded-primary w-full p-[10px]">
                      <Users size={"13vw"} />
                      <div className="text-left">
                        <h3 className="text-tertiary">{t("profile.squad")}</h3>
                        <h2 className="text-secondary">
                          #{userData.squadRank === 0 ? 1 : userData.squadRank}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 bg-red justify-center items-center mt-2 w-full">
                  <div className="font-symbols text-gold">u</div>
                  <h1 className="mt-1 uppercase text-tertiary text-gold">
                    {t(`profile.invite`)}
                  </h1>
                </div>
                <div
                  className={`text-center  w-full text-tertiary  rounded-primary`}
                >
                  <div className="flex gap-[8px] ">
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
                      onClick={handleCopyLink}
                      className={`flex border h-button-primary border-white items-center gap-[10px] rounded-primary bg-glass-black w-full p-[10px] ${
                        isClicked === 2 ? `glow-button-white` : ""
                      }`}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                        alt="telegram"
                        className="w-[13vw]"
                      />
                      <div className="text-left w-full">
                        <h3 className="text-tertiary">
                          {t("profile.referrals")}
                        </h3>
                        <h2 className="text-secondary">
                          {userData.directReferralCount}
                        </h2>
                      </div>
                    </div>
                    <div className="flex border h-button-primary border-cardsGray text-cardsGray items-center grayscale gap-[10px] rounded-primary bg-glass-black w-full p-[10px]">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                        alt="telegram"
                        className="w-[13vw]"
                      />
                      <div className="text-left w-full">
                        <h3 className="text-tertiary">
                          {t(`profile.premium`)}
                        </h3>
                        <h2 className="text-secondary">
                          {userData.premiumReferralCount}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2  justify-center items-center mt-2 w-full">
                  <div className="font-symbols text-gold">t</div>
                  <h1 className="mt-1 text-tertiary text-gold uppercase">
                    {t("profile.rewards")}
                  </h1>
                  <h1 className="text-gold font-bold">|</h1>
                  <HeartHandshake size={"6vw"} color="#FFD660" />
                  <h1 className="mt-1 text-tertiary uppercase text-gold">
                    {t("profile.charity")}
                  </h1>
                </div>
                <div
                  onMouseDown={() => {
                    setIsClicked(3);
                  }}
                  onMouseUp={() => {
                    setIsClicked(0);
                  }}
                  onMouseLeave={() => {
                    setIsClicked(0);
                  }}
                  onTouchStart={() => {
                    setIsClicked(3);
                  }}
                  onTouchEnd={() => {
                    setIsClicked(0);
                  }}
                  onTouchCancel={() => {
                    setIsClicked(0);
                  }}
                  className={`text-center  w-full text-tertiary rounded-primary`}
                >
                  <div className="flex gap-[8px]">
                    <div
                      onClick={() => {
                        setSection(10);
                      }}
                      className={`flex ${enableGuide && "z-[60]"} ${
                        isClicked === 3 ? `glow-button-white` : ""
                      } bg-glass-black h-button-primary border border-white justify-center items-center gap-[20px] rounded-primary w-full p-[10px]`}
                    >
                      {t("profile.partner")}
                    </div>
                    <div className="flex  bg-glass-black h-button-primary items-center justify-center border border-cardsGray text-cardsGray  grayscale  gap-[20px] rounded-primary w-full p-[10px]">
                      {t("profile.causes")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {showClaim && (
        <MilestoneCard
          t={t}
          isMulti={true}
          isOrb={true}
          isBlack={false}
          activeMyth={4}
          isForge={true}
          closeCard={() => {}}
          handleClick={() => {
            tele.HapticFeedback.notificationOccurred("success");
            setShowClaim(false);
          }}
        />
      )}

      {enableGuide && (
        <ProfileGuide
          handleClick={() => {
            setEnableGuide(false);
          }}
        />
      )}

      {showLang && (
        <SettingModal
          close={() => {
            setShowLang(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
