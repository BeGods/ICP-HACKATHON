import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Award, ChevronsRight, Globe, Settings, Trophy } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toggleBackButton } from "../utils/teleBackButton";
import ProfileCard from "../components/Cards/ProfileCard";
import { MyContext } from "../context/context";
import { toast } from "react-toastify";
import ToastMesg from "../components/Toast/ToastMesg";
import Avatar from "../components/Common/Avatar";
import { useTranslation } from "react-i18next";
import Language from "../components/Modals/Language";
import { showToast } from "../components/Toast/Toast";

const tele = window.Telegram?.WebApp;

const Profile = (props) => {
  const { t, i18n } = useTranslation();
  const { userData, setSection } = useContext(MyContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const [showLang, setShowLang] = useState(false);
  const userFriendlyAddress = useTonAddress();
  const [isAddressSent, setIsAddressSent] = useState(false);
  const [activeTab, setActiveTab] = useState(true);
  const [activeSection, setActiveSection] = useState(true);
  const [toggleSound, setToggleSound] = useState(() => {
    const savedSound = localStorage.getItem("sound");
    return savedSound !== null ? JSON.parse(savedSound) : false;
  });

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(
      `https://t.me/BeGods_bot/forgesoffaith?startapp=${userData.referralCode}`
    );
    showToast("copy_link");
  };

  // const handleConnectTon = async () => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   try {
  //     await connectTonWallet({ tonAddress: userFriendlyAddress }, accessToken);
  //     localStorage.setItem("tonnconnected", true);
  //     setIsAddressSent(true); // Update the state after successful connection
  //     localStorage.setItem("isAddressSent", "true"); // Persist state in localStorage

  //     toast.success(
  //       <ToastMesg
  //         title={"Wallet connected successfully!"}
  //         desc={"Ton wallet connected successfully."}
  //         img={"/assets/icons/toast.success.svg"}
  //       />,
  //       {
  //         icon: false,
  //         autoClose: 2000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       }
  //     );
  //   } catch (error) {
  //     const errorMessage =
  //       error.response.data.error ||
  //       error.response.data.message ||
  //       error.message ||
  //       "An unexpected error occurred";
  //     toast.error(
  //       <ToastMesg
  //         title={"There was a problem connecting your wallet."}
  //         desc={errorMessage}
  //         img={"/assets/icons/toast.fail.svg"}
  //       />,
  //       {
  //         icon: false,
  //         autoClose: 2000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       }
  //     );
  //   }
  // };

  useEffect(() => {
    toggleBackButton(tele, () => {
      setSection(0);
    });
  }, []);

  // useEffect(() => {
  //   const isAddressSentFlag = localStorage.getItem("isAddressSent");

  //   if (userFriendlyAddress && !isAddressSent && !isAddressSentFlag) {
  //     handleConnectTon(); // Only connect if the address hasn't been sent before
  //   }
  // }, [userFriendlyAddress, isAddressSent]);

  return (
    <div className="flex flex-col items-center w-full text-secondary text-white bg-[#121212] h-screen overflow-auto px-[15px] py-2">
      {/* Tab */}
      {activeTab ? (
        <div className="relative w-full">
          <div
            className="h-icon-primary w-icon-primary flex justify-center items-center left-0 mt-4 ml-2 absolute border rounded-full p-3.5"
            onClick={() => {
              setSection(4);
            }}
          >
            <Trophy />
          </div>

          <div
            className="h-icon-primary w-icon-primary flex justify-center items-center right-0 mt-4 mr-2 absolute border rounded-full p-3.5"
            onClick={() => {
              setShowLang(true);
            }}
          >
            <Settings size={"30px"} />
          </div>
          {/* PROFILE DETAILS */}
          <div className="flex justify-center items-center flex-col">
            {/* <img
              src="/images/profile.png"
              alt="profile"
              className="h-[100px] w-[100px] mt-4  rounded-full"
            /> */}
            <div className="w-[100px] h-[100px] mt-4">
              <Avatar
                name={userData.telegramUsername}
                profile={1}
                color={avatarColor}
              />
            </div>
            <h1 className="text-secondary mt-2">
              {userData.telegramUsername.toUpperCase()}
            </h1>
            <h2 className="text-textGray text-[12px] -mt-1">{t(`main.fdg`)}</h2>
            <TonConnectButton className="mt-2" />
          </div>
          {/* SECTIONS */}
          <div className="flex w-full text-tertiary mt-6">
            <div
              onClick={() => {
                setActiveSection(true);
              }}
              className={`w-full text-center ${
                activeSection ? "border-b-2 text-white" : "text-borderDark"
              }  py-1`}
            >
              {t(`profile.details`)}
            </div>
            <div
              onClick={() => {
                setActiveSection(false);
              }}
              className={`w-full text-center ${
                !activeSection ? "border-b-2 text-white" : "text-borderDark"
              }  py-1`}
            >
              {t(`profile.notifications`)}
            </div>
          </div>
          {/* DETAILS */}
          {activeSection ? (
            <div className="flex gap-2 flex-col items-center justify-center w-full">
              {/* STATS */}
              <div className="text-center bg-black w-full p-[15px] mt-2 rounded-primary">
                <h1 className="text-tertiary uppercase">
                  {t(`profile.stats`)}
                </h1>
                <div className="flex gap-[8px] mt-[8px]">
                  <div className="flex items-center gap-[20px] rounded-primary bg-dark w-full p-[10px]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-secondary">
                        {t(`profile.gameRank`)}
                      </h3>
                      <h2 className="text-secondary">
                        #{userData.overallRank === 0 ? 1 : userData.overallRank}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-[20px] rounded-primary bg-dark w-full p-[10px]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-secondary">
                        {t(`profile.squadRank`)}
                      </h3>
                      <h2 className="text-secondary">
                        #{userData.squadRank === 0 ? 1 : userData.squadRank}
                      </h2>
                    </div>
                  </div>
                </div>
                {/* <div
                  onClick={() => {
                    setSection(4);
                  }}
                  className="w-full text-center text-[12px] pt-3 uppercase"
                >
                  {t(`profile.leaderboard`)} {">"}
                </div> */}
              </div>
              {/* INVITE */}
              <div className="text-center bg-black w-full p-[15px] rounded-primary">
                <h1 className="text-tertiary uppercase">
                  {t(`profile.invite`)}
                </h1>
                <div className="flex items-center w-full text-left mt-1">
                  <div className="w-full" onClick={handleCopyLink}>
                    <h2 className="text-secondary">
                      {t(`profile.inviteYourFriends`)}
                    </h2>
                    <p className="text-[12px] -mt-1">
                      {t(`profile.shareLinkToEarnOrbs`)}
                    </p>
                  </div>
                  <ChevronsRight />
                </div>
                <div className="flex gap-[8px] mt-[8px]">
                  <div className="flex items-center gap-[20px] rounded-primary bg-dark w-full p-[10px]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-secondary">{t(`profile.direct`)}</h3>
                      <h2 className="text-secondary">
                        {userData.directReferralCount}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-[20px] rounded-primary bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-secondary">{t(`profile.premium`)}</h3>
                      <h2 className="text-secondary">
                        {userData.premiumReferralCount}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 flex-col items-center justify-center w-full mt-2">
              <ProfileCard />
              <ProfileCard />
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2 flex-col items-center justify-center w-full mt-2">
          <ProfileCard />
          <ProfileCard />
        </div>
      )}
      {showLang && (
        <Language
          close={() => {
            setShowLang(false);
          }}
        />
      )}
      <div className="fixed bottom-3 w-full px-[15px] mx-auto">
        <div className="flex border border-[#414141] w-full p-1 rounded-full h-[44px] uppercase">
          <div
            onClick={() => {
              setActiveTab(true);
            }}
            className={`flex justify-center items-center ${
              activeTab && "bg-borderGray"
            } h-full rounded-full w-1/2 text-[16px] py-1.5`}
          >
            {t(`profile.profile`)}
          </div>
          <div
            onClick={() => {
              setActiveTab(false);
            }}
            className={`flex justify-center items-center ${
              !activeTab && "bg-borderGray"
            } h-full rounded-full w-1/2 text-[16px] py-1.5`}
          >
            {t(`profile.tasks`)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

{
  /* SQUAD */
}
{
  /* <div className="text-center bg-black w-full p-[15px] rounded-primary">
                <h1 className="text-[16px]">SQUAD</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Faucibus vivamus odio
                  varius nibh risus sed pulvinar curabitur.
                </p>
                <div className="flex gap-[8px] mt-[10px]">
                  <div className="flex items-center gap-[20px] rounded-primary bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[10px]">Total Member</h3>
                      <h2 className="text-[14px]">#{userData.squadCount}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-[20px] rounded-primary bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[10px]">Total Orbs</h3>
                      <h2 className="text-[14px]">
                        #{userData.squadTotalOrbs}
                      </h2>
                    </div>
                  </div>
                </div>
              </div> */
}
{
  /* GUIDE */
}
{
  /* <div className="text-center bg-black w-full p-[15px] rounded-primary">
                <h1 className="text-[16px]">GUIDES</h1>
                <div className="flex gap-[8px] mt-[8px]">
                  <div className="flex items-center gap-[20px] rounded-primary w-full">
                    <img
                      src="/icons/fof.png"
                      alt="telegram"
                      className="w-[48px] h-[20px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[14px]">Game Guide</h3>
                    </div>
                  </div>
                  <ChevronRight />
                </div>
              </div> */
}
