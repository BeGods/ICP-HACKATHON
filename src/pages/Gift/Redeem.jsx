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

const HeaderContent = ({ imageUrl, title, handleClick }) => {
  return (
    <>
      <div className="flex flex-col flex-grow justify-start items-start text-white pl-5">
        <div className="text-left  gap-1 flex font-medium text-head">
          <span className={`text-white text-black-contour uppercase`}>
            PARTNERS
          </span>
        </div>
        <h1 className={`text-white text-black-contour text-[36px] uppercase`}>
          {title}
        </h1>
      </div>
      <div onClick={handleClick} className="h-full -mr-[10%] ml-auto mt-1">
        <img
          src={imageUrl}
          alt="turbo"
          className="h-symbol-primary rounded-full w-symbol-primary"
        />
      </div>
    </>
  );
};

const Redeem = (props) => {
  const { t } = useTranslation();
  const { activeMyth, activeReward, userData, authToken } =
    useContext(MyContext);
  const [showAuth, setShowAuth] = useState(false);
  const [claimRedeem, setClaimRedeem] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    if (userData.isPlaySuperVerified) {
      handleRedeen(true);
    } else {
      setShowAuth(true);
    }
  };

  const handleRedeen = async () => {
    try {
      if (activeReward.partnerType === "playsuper") {
        const reward = await claimPlaysuperReward(activeReward.id, authToken);
        console.log(reward);
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
      <Header
        children={
          <HeaderContent
            handleClick={() => {
              setShowRedeem(true);
            }}
            title={activeReward.name}
            imageUrl={`/assets/partners/160px-${activeReward.category}.bubble.png`}
          />
        }
      />
      {/* Content */}
      <div className="flex flex-grow justify-center items-center">
        {/* Quests */}
        <div className="flex items-center justify-center w-full">
          <div className="relative">
            <div className="h-full relative -mt-[40px] cursor-pointer z-20">
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
                  setShowInfo(true);
                }}
                align={1}
              />
            </div>
            <JigsawButton
              handleClick={() => {
                if (activeReward.tokensCollected === 12) {
                  setShowRedeem(true);
                  setClaimRedeem(true);
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

      {showAuth && (
        <AuthenticatePlaySuper
          handleClose={() => {
            setShowAuth(false);
            setClaimRedeem(false);
          }}
        />
      )}

      {showInfo && (
        <PartnerCard
          close={() => {
            setShowInfo(false);
          }}
        />
      )}

      {showRedeem && (
        <div className="fixed inset-0  bg-black bg-opacity-85  backdrop-blur-[3px] flex justify-center items-center z-50">
          <div className="relative w-full  shadow-lg card-shadow-white">
            <img
              src={`/assets/partners/320px-${activeReward.category}.campaign.jpg`}
              alt="campaign"
              className="w-full h-full rounded-primary"
              onClick={() => {
                if (claimRedeem) {
                  setShowRedeem(false);
                  setShowAuth(true);
                }
              }}
            />
            <IconBtn
              isInfo={false}
              activeMyth={4}
              handleClick={() => {
                setShowRedeem(false);
              }}
              align={4}
            />
          </div>
        </div>
      )}

      <ToggleLeft handleClick={() => {}} activeMyth={activeMyth} />
      <ToggleRight handleClick={() => {}} activeMyth={activeMyth} />
    </div>
  );
};

export default Redeem;
