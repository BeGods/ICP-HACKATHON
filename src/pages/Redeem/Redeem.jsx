import React, { useContext, useState } from "react";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import JigsawButton from "../../components/Buttons/JigsawBtn";
import JigsawImage from "../../components/Cards/Jigsaw/JigsawCrd";
import Header from "../../components/Common/Header";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { handleActiveParts } from "../../helpers/quests.helper";
import AuthenticatePlaySuper from "../../components/Modals/AuthOTP";
import { claimPlaysuperReward } from "../../utils/api";
import { toast } from "react-toastify";
import IconBtn from "../../components/Buttons/IconBtn";
import PartnerCard from "../../components/Cards/Info/PartnerInfoCrd";
import RedeemHeader from "./Header";

const Redeem = (props) => {
  const { t } = useTranslation();
  const { activeMyth, activeReward, userData, authToken, setShowCard } =
    useContext(MyContext);
  const [showAuth, setShowAuth] = useState(false);
  const [claimRedeem, setClaimRedeem] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    if (userData.isPlaySuperVerified) {
      handleRedeen(true);
    } else {
      setShowAuth(
        <AuthenticatePlaySuper
          handleClose={() => {
            setShowCard(null);
          }}
        />
      );
    }
  };

  const handleRedeen = async () => {
    try {
      if (activeReward.partnerType === "playsuper") {
        const reward = await claimPlaysuperReward(activeReward.id, authToken);
      }
    } catch (error) {
      console.log(error);
      toast.error("YOu failed");
    }
  };

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
            backgroundImage: `url(/assets/uxui/1280px-fof.base.background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <RedeemHeader
        pieces={activeReward.tokensCollected}
        name={activeReward.name}
      />
      {/* Content */}
      <div className="flex mt-7 justify-center items-center h-screen w-screen absolute mx-auto">
        <div className="flex items-center justify-center w-full">
          <div className="relative">
            <div className="h-full relative -mt-[66px] cursor-pointer z-20">
              <JigsawImage
                imageUrl={`/assets/partners/320px-${activeReward.category}.brand.jpg`}
                activeParts={handleActiveParts(activeReward.tokensCollected)}
                handleClick={() => {
                  if (activeReward.tokensCollected === 12) {
                    window.open("_blank", "dsifk");
                  }
                }}
              />
              <IconBtn
                isInfo={true}
                activeMyth={activeMyth}
                handleClick={() => {
                  setShowCard(
                    <PartnerCard
                      close={() => {
                        setShowCard(null);
                      }}
                    />
                  );
                }}
                align={1}
              />
            </div>
            <JigsawButton
              handleClick={() => {
                if (activeReward.tokensCollected === 12) {
                  setShowCard(
                    <div className="fixed inset-0  bg-black bg-opacity-85  backdrop-blur-[3px] flex justify-center items-center z-50">
                      <div className="relative w-full  shadow-lg card-shadow-white">
                        <img
                          src={`/assets/partners/320px-${activeReward.category}.campaign.jpg`}
                          alt="campaign"
                          className="w-full h-full rounded-primary"
                          onClick={() => {
                            setShowCard(null);
                            setShowAuth(
                              <AuthenticatePlaySuper
                                handleClose={() => {
                                  setShowCard(null);
                                }}
                              />
                            );
                          }}
                        />
                        <IconBtn
                          isInfo={false}
                          activeMyth={4}
                          handleClick={() => {
                            setShowCard(null);
                          }}
                          align={4}
                        />
                      </div>
                    </div>
                  );
                }
              }}
              activeMyth={4}
              handleNext={() => {}}
              handlePrev={() => {}}
              faith={activeReward.tokensCollected}
              disableLeft={true}
              t={t}
            />
          </div>
        </div>
      </div>

      <ToggleLeft handleClick={() => {}} activeMyth={activeMyth} />
      <ToggleRight handleClick={() => {}} activeMyth={activeMyth} />
    </div>
  );
};

export default Redeem;
