import {
  TonConnectButton,
  useTonAddress,
  useTonConnectModal,
} from "@tonconnect/ui-react";
import { Settings, Speech, Trophy, User, UserPlus, Users } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import ProfileCard from "../components/Cards/ProfileCard";
import { MyContext } from "../context/context";
import Avatar from "../components/Common/Avatar";
import { useTranslation } from "react-i18next";
import Language from "../components/Modals/Language";
import { showToast } from "../components/Toast/Toast";
import { connectTonWallet } from "../utils/api";
import Header from "../components/Headers/Header";
import { mythSymbols } from "../utils/variables";
import Footer from "../components/Common/Footer";

const tele = window.Telegram?.WebApp;

const HeaderContent = ({ userData, avatarColor, t }) => {
  return (
    <div className="flex justify-between relative w-full">
      {/* Left */}
      <div className="flex flex-col justify-between h-full px-2 pt-1">
        <h1
          className={`text-head text-black-contour uppercase text-white
           `}
        >
          PLAYER
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
      <div className="flex flex-col items-end justify-between h-full px-2 pt-1">
        <h1 className={`text-head text-white-contour uppercase text-black`}>
          TASKS
        </h1>
      </div>
    </div>
  );
};

const Profile = (props) => {
  const { t } = useTranslation();
  const { userData } = useContext(MyContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const [showLang, setShowLang] = useState(false);
  const [isClicked, setIsClicked] = useState(0);
  const userFriendlyAddress = useTonAddress();
  const [activeSection, setActiveSection] = useState(true);
  const { state } = useTonConnectModal();

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
          <HeaderContent avatarColor={avatarColor} userData={userData} t={t} />
        }
      />
      {/* Content */}
      <div className="flex relative flex-grow justify-center items-center">
        <div
          className="h-icon-primary w-icon-primary flex justify-center items-center right-0 top-0 mr-[30px] mt-6 z-10 absolute border rounded-full p-3.5"
          onClick={() => {
            setShowLang(true);
          }}
        >
          <Settings size={"30px"} color="white" />
        </div>
        <div className="relative w-full">
          {activeSection ? (
            <div className="flex px-2 text-white gap-2 mt-2.5 flex-col items-center justify-center w-full">
              <h2 className="text-white uppercase text-tertiary mt-2">
                {t(`main.fdg`)}
              </h2>
              <h1 className="text-tertiary -mt-1 ">
                {userData.telegramUsername}
              </h1>
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
                className={`text-center outline outline-[0.5px] ${
                  isClicked == 1 ? "outline-gray-400" : "outline-gray-600"
                } bg-black text-tertiary w-full p-[15px] mt-2 rounded-primary`}
              >
                <div className="flex gap-2 -mt-1.5 uppercase justify-center items-center w-full">
                  <Trophy size={"6vw"} />
                  <h1 className="mt-1">Leaderboard</h1>
                </div>
                <div className="flex gap-[8px] mt-[8px]">
                  <div className="flex items-center gap-[20px] rounded-primary bg-dark w-full p-[10px]">
                    <User size={"6vw"} />
                    <div className="text-left">
                      <h3 className="text-tertiary">Player</h3>
                      <h2 className="text-secondary">
                        #{userData.overallRank === 0 ? 1 : userData.overallRank}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-[20px] rounded-primary bg-dark w-full p-[10px]">
                    <Users size={"6vw"} />
                    <div className="text-left">
                      <h3 className="text-tertiary">Team</h3>
                      <h2 className="text-secondary">
                        #{userData.squadRank === 0 ? 1 : userData.squadRank}
                      </h2>
                    </div>
                  </div>
                </div>
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
                className={`text-center outline outline-[0.5px] ${
                  isClicked == 2 ? "outline-gray-400" : "outline-gray-600"
                } bg-black w-full text-tertiary p-[15px] mt-2.5 rounded-primary`}
              >
                <div className="flex gap-2 uppercase -mt-2 justify-center items-center w-full">
                  <UserPlus size={"6vw"} />
                  <h1 className="mt-1">Invite</h1>
                </div>
                <div className="flex gap-[8px] mt-[8px]">
                  <div className="flex items-center gap-[20px] rounded-primary bg-dark w-full p-[10px]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-tertiary">Referrals</h3>
                      <h2 className="text-secondary">
                        {userData.directReferralCount}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center grayscale opacity-50 gap-[20px] rounded-primary bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-tertiary">Premium</h3>
                      <h2 className="text-secondary">
                        {userData.premiumReferralCount}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center grayscale opacity-50 outline outline-[0.5px] outline-gray-600 text-tertiary bg-black w-full p-[15px] mt-2.5 rounded-primary">
                <div className="flex gap-2 uppercase justify-center items-center w-full pb-1">
                  <Speech size={"6vw"} color="white" />
                  <h1 className="mt-1">KOL(s)</h1>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 flex-col items-center justify-center w-full mt-4">
              <ProfileCard />
              <ProfileCard />
            </div>
          )}
        </div>
      </div>
      <Footer />
      {showLang && (
        <Language
          close={() => {
            setShowLang(false);
          }}
        />
      )}
    </div>

    // <div className="flex flex-col items-center w-full text-secondary text-white bg-[#121212] h-screen overflow-auto px-[15px] py-2">
    //   {activeTab ? (
    //     <div className="relative w-full">
    //       <div
    //         className="h-icon-primary w-icon-primary flex justify-center items-center right-0 mt-4 mr-2 absolute border rounded-full p-3.5"
    //         onClick={() => {
    //           setShowLang(true);
    //         }}
    //       >
    //         <Settings size={"30px"} />
    //       </div>
    //       <div className="flex justify-center items-center flex-col">
    //         <div className="w-[100px] h-[100px] mt-4">
    //           <Avatar
    //             name={userData.telegramUsername}
    //             profile={1}
    //             color={avatarColor}
    //           />
    //         </div>
    //         <h2 className="text-textGray uppercase text-tertiary mt-2">
    //           {t(`main.fdg`)}
    //         </h2>
    //         <h1 className="text-tertiary -mt-1 ">
    //           {userData.telegramUsername}
    //         </h1>
    //       </div>
    //       <div className="flex w-full text-tertiary mt-4">
    //         <div
    //           onClick={() => {
    //             setActiveSection(true);
    //           }}
    //           className={`w-full text-center uppercase ${
    //             activeSection ? "border-b-2 text-white" : "text-borderDark"
    //           }  py-1`}
    //         >
    //           {t(`profile.profile`)}
    //         </div>
    //         <div
    //           onClick={() => {
    //             setActiveSection(false);
    //           }}
    //           className={`w-full text-center uppercase ${
    //             !activeSection ? "border-b-2 text-white" : "text-borderDark"
    //           }  py-1`}
    //         >
    //           {t(`profile.tasks`)}
    //         </div>
    //       </div>
    //       {activeSection ? (
    //         <div className="flex gap-2 mt-2.5 flex-col items-center justify-center w-full">
    //           <div
    //             onMouseDown={() => {
    //               setIsClicked(1);
    //             }}
    //             onMouseUp={() => {
    //               setIsClicked(0);
    //             }}
    //             onMouseLeave={() => {
    //               setIsClicked(0);
    //             }}
    //             onTouchStart={() => {
    //               setIsClicked(1);
    //             }}
    //             onTouchEnd={() => {
    //               setIsClicked(0);
    //             }}
    //             onTouchCancel={() => {
    //               setIsClicked(0);
    //             }}
    //             className={`text-center outline outline-[0.5px] ${
    //               isClicked == 1 ? "outline-gray-400" : "outline-gray-600"
    //             } bg-black text-tertiary w-full p-[15px] mt-2 rounded-primary`}
    //           >
    //             <div className="flex gap-2 -mt-1.5 uppercase justify-center items-center w-full">
    //               <Trophy size={"6vw"} />
    //               <h1 className="mt-1">Leaderboard</h1>
    //             </div>
    //             <div className="flex gap-[8px] mt-[8px]">
    //               <div className="flex  items-center gap-[20px] rounded-primary bg-dark w-full p-[10px]">
    //                 <User size={"6vw"} />
    //                 <div className="text-left">
    //                   <h3 className="text-tertiary">Player</h3>
    //                   <h2 className="text-secondary">
    //                     #{userData.overallRank === 0 ? 1 : userData.overallRank}
    //                   </h2>
    //                 </div>
    //               </div>
    //               <div className="flex items-center gap-[20px] rounded-primary bg-dark w-full p-[10px]">
    //                 <Users size={"6vw"} />
    //                 <div className="text-left">
    //                   <h3 className="text-tertiary">Team</h3>
    //                   <h2 className="text-secondary">
    //                     #{userData.squadRank === 0 ? 1 : userData.squadRank}
    //                   </h2>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div
    //             onMouseDown={() => {
    //               setIsClicked(2);
    //             }}
    //             onMouseUp={() => {
    //               setIsClicked(0);
    //             }}
    //             onMouseLeave={() => {
    //               setIsClicked(0);
    //             }}
    //             onTouchStart={() => {
    //               setIsClicked(2);
    //             }}
    //             onTouchEnd={() => {
    //               setIsClicked(0);
    //             }}
    //             onTouchCancel={() => {
    //               setIsClicked(0);
    //             }}
    //             className={`text-center outline outline-[0.5px] ${
    //               isClicked == 2 ? "outline-gray-400" : "outline-gray-600"
    //             } bg-black w-full text-tertiary p-[15px] mt-2.5 rounded-primary`}
    //           >
    //             <div className="flex gap-2 uppercase -mt-2 justify-center items-center w-full">
    //               <UserPlus size={"6vw"} />
    //               <h1 className="mt-1">Invite</h1>
    //             </div>
    //             <div className="flex gap-[8px] mt-[8px]">
    //               <div className="flex items-center gap-[20px] rounded-primary bg-dark w-full p-[10px]">
    //                 <img
    //                   src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
    //                   alt="telegram"
    //                   className="w-[28px] h-[28px]"
    //                 />
    //                 <div className="text-left">
    //                   <h3 className="text-tertiary">Referrals</h3>
    //                   <h2 className="text-secondary">
    //                     {userData.directReferralCount}
    //                   </h2>
    //                 </div>
    //               </div>
    //               <div className="flex items-center grayscale opacity-50 gap-[20px] rounded-primary bg-[#1D1D1D] w-full p-[10px]">
    //                 <img
    //                   src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
    //                   alt="telegram"
    //                   className="w-[28px] h-[28px]"
    //                 />
    //                 <div className="text-left">
    //                   <h3 className="text-tertiary">Premium</h3>
    //                   <h2 className="text-secondary">
    //                     {userData.premiumReferralCount}
    //                   </h2>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="text-center grayscale opacity-50 outline outline-[0.5px] outline-gray-600 text-tertiary bg-black w-full p-[15px] mt-2.5 rounded-primary">
    //             <div className="flex gap-2 uppercase justify-center items-center w-full pb-1">
    //               <Speech size={"6vw"} color="white" />
    //               <h1 className="mt-1">KOL(s)</h1>
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         <div className="flex gap-2 flex-col items-center justify-center w-full mt-4">
    //           <ProfileCard />
    //           <ProfileCard />
    //         </div>
    //       )}
    //     </div>
    //   ) : (
    //     <div className="flex gap-2 flex-col items-center justify-center w-full mt-2">
    //       <ProfileCard />
    //       <ProfileCard />
    //     </div>
    //   )}
    //   {showLang && (
    //     <Language
    //       close={() => {
    //         setShowLang(false);
    //       }}
    //     />
    //   )}
    // </div>
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
