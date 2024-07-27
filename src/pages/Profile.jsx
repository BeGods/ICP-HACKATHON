import { TonConnectButton } from "@tonconnect/ui-react";
import { ChevronRight, ChevronsRight } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toggleBackButton } from "../utils/teleBackButton";
import ProfileCard from "../components/ProfileCard";
import { MyContext } from "../context/context";

const tele = window.Telegram?.WebApp;

const Profile = (props) => {
  const { userData } = useContext(MyContext);
  const [activeTab, setActiveTab] = useState(true);
  const [section, setSection] = useState(true);

  useEffect(() => {
    toggleBackButton(tele);
  }, []);

  return (
    <div className="flex flex-col items-center w-full font-montserrat text-[10px] text-white bg-[#121212] h-screen overflow-auto px-[15px] py-2">
      {/* Tab */}
      <div className="flex border border-[#414141] w-full p-1 rounded-full h-[44px]">
        <div
          onClick={() => {
            setActiveTab(true);
          }}
          className={`flex justify-center items-center ${
            activeTab && "bg-borderGray"
          } h-full rounded-full w-1/2 text-[16px] py-1.5`}
        >
          PROFILE
        </div>
        <div
          onClick={() => {
            setActiveTab(false);
          }}
          className={`flex justify-center items-center ${
            !activeTab && "bg-borderGray"
          } h-full rounded-full w-1/2 text-[16px] py-1.5`}
        >
          TASKS
        </div>
      </div>
      {activeTab ? (
        <>
          {/* PROFILE DETAILS */}
          <div className="flex justify-center items-center flex-col">
            <img
              src="/images/profile.png"
              alt="profile"
              className="h-[100px] w-[100px] mt-4"
            />
            <h1 className="text-[14px] mt-2">
              {userData.telegramUsername.toUpperCase()}
            </h1>
            <h2 className="text-[10px] text-[#707579] -mt-1">FROGDOG GAMES</h2>
            <TonConnectButton className="mt-2" />
          </div>
          {/* SECTIONS */}
          <div className="flex w-full text-[14px] mt-6">
            <div
              onClick={() => {
                setSection(true);
              }}
              className={`w-full text-center ${
                section ? "border-b-2 text-white" : "text-[#414141]"
              }  py-1`}
            >
              DETAILS
            </div>
            <div
              onClick={() => {
                setSection(false);
              }}
              className={`w-full text-center ${
                !section ? "border-b-2 text-white" : "text-[#414141]"
              }  py-1`}
            >
              NOTIFICATIONS
            </div>
          </div>
          {/* DETAILS */}
          {section ? (
            <div className="flex gap-2 flex-col items-center justify-center w-full">
              {/* STATS */}
              <div className="text-center bg-black w-full p-[15px] mt-2 rounded-button">
                <h1 className="text-[16px]">STATS</h1>
                <div className="flex gap-[8px] mt-[8px]">
                  <div className="flex items-center gap-[20px] rounded-button bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="/icons/telegram.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[10px]">Game Rank</h3>
                      <h2 className="text-[14px]">#1</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-[20px] rounded-button bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="/icons/telegram.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[10px]">Squad Rank</h3>
                      <h2 className="text-[14px]">#1</h2>
                    </div>
                  </div>
                </div>
              </div>
              {/* INVITE */}
              <div className="text-center bg-black w-full p-[15px] rounded-button">
                <h1 className="text-[16px]">INVITE</h1>
                <div className="flex items-center w-full text-left mt-1">
                  <div className="w-full">
                    <h2 className="text-[14px]">Invite Your friends</h2>
                    <p className="text-[10px] -mt-1">
                      Share link to earn $ORB(S)
                    </p>
                  </div>
                  <ChevronsRight />
                </div>
                <div className="flex gap-[8px] mt-[8px]">
                  <div className="flex items-center gap-[20px] rounded-button bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="/icons/telegram.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[10px]">Direct</h3>
                      <h2 className="text-[14px]">
                        {userData.directReferralCount}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-[20px] rounded-button bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="/icons/telegram.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[10px]">Premium</h3>
                      <h2 className="text-[14px]">
                        {userData.premiumReferralCount}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              {/* SQUAD */}
              <div className="text-center bg-black w-full p-[15px] rounded-button">
                <h1 className="text-[16px]">SQUAD</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Faucibus vivamus odio
                  varius nibh risus sed pulvinar curabitur.
                </p>
                <div className="flex items-center w-full text-left my-2">
                  <div className="flex items-center gap-[20px] px-[10px] w-full">
                    <img
                      src="/icons/telegram.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[14px]">Create New Sqaud</h3>
                      <h2 className="text-[10px]">#+2 $ORB(S)</h2>
                    </div>
                  </div>
                  <ChevronRight />
                </div>
                <div className="flex gap-[8px] mt-[10px]">
                  <div className="flex items-center gap-[20px] rounded-button bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="/icons/telegram.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[10px]">Total Member</h3>
                      <h2 className="text-[14px]">#1</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-[20px] rounded-button bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="/icons/telegram.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[10px]">Total Orbs</h3>
                      <h2 className="text-[14px]">#1</h2>
                    </div>
                  </div>
                </div>
                <div className="flex gap-[8px] mt-[10px]">
                  <div className="flex items-center gap-[20px] rounded-button bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="/icons/telegram.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[10px]">Total Member</h3>
                      <h2 className="text-[14px]">#1</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-[20px] rounded-button bg-[#1D1D1D] w-full p-[10px]">
                    <img
                      src="/icons/telegram.png"
                      alt="telegram"
                      className="w-[28px] h-[28px]"
                    />
                    <div className="text-left">
                      <h3 className="text-[10px]">Total Orbs</h3>
                      <h2 className="text-[14px]">#1</h2>
                    </div>
                  </div>
                </div>
              </div>
              {/* GUIDE */}
              <div className="text-center bg-black w-full p-[15px] rounded-button">
                <h1 className="text-[16px]">GUIDES</h1>
                <div className="flex gap-[8px] mt-[8px]">
                  <div className="flex items-center gap-[20px] rounded-button w-full">
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
              </div>
            </div>
          ) : (
            <div className="flex gap-2 flex-col items-center justify-center w-full mt-2">
              <ProfileCard />
              <ProfileCard />
            </div>
          )}
        </>
      ) : (
        <div className="flex gap-2 flex-col items-center justify-center w-full mt-2">
          <ProfileCard />
          <ProfileCard />
        </div>
      )}
    </div>
  );
};

export default Profile;
