import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import JigsawButton from "../../components/Buttons/JigsawBtn";
import JigsawImage from "../../components/Cards/Jigsaw/JigsawCrd";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { handleActiveParts } from "../../helpers/quests.helper";
import { claimPlaysuperReward } from "../../utils/api";
import IconBtn from "../../components/Buttons/IconBtn";
import PartnerCard from "../../components/Cards/Info/PartnerInfoCrd";
import RedeemHeader from "./Header";
import confetti from "canvas-confetti";
import { showToast } from "../../components/Toast/Toast";
import { trackComponentView } from "../../utils/ga";
import { handleClickHaptic } from "../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const Redeem = (props) => {
  const {
    activeReward,
    userData,
    authToken,
    setShowCard,
    assets,
    setSection,
    rewards,
    setRewards,
    triggerConf,
    setTriggerConf,
  } = useContext(MyContext);
  const [showToggles, setShowToggles] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const index = rewards.findIndex((item) => item.id === activeReward.id);
  const [currIndex, setCurrIndex] = useState(index);
  const currReward = rewards[currIndex];

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#bb0000", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleClick = () => {
    if (activeReward.partnerType == "playsuper") {
      if (userData.isPlaySuperVerified) {
        handleRedeen();
      } else {
        setSection(11);
      }
    } else {
      setShowCard(
        <div
          onClick={() => {
            setShowCard(null);
          }}
          className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50"
        >
          <img
            src={`https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/320px-${currReward.metadata.campaignAssets.bannerView}.campaign.jpg`}
            alt="campaign"
            className="w-full h-4/5"
          />
        </div>
      );
    }
  };

  const handleRedeen = async () => {
    try {
      if (currReward.partnerType === "playsuper") {
        const response = await claimPlaysuperReward(currReward.id, authToken);
        showToast("voucher_success");
        setRewards((prevRewards) =>
          prevRewards.map((reward) =>
            reward.id === currReward.id
              ? {
                  ...reward,
                  couponCode: response.couponCode,
                  isClaimed: true,
                }
              : reward
          )
        );
      }
    } catch (error) {
      showToast("voucher_error");
      console.log(error);
    }
  };

  useEffect(() => {
    trackComponentView("partner");

    if (triggerConf) {
      triggerConfetti();
      setTimeout(() => {
        setTriggerConf(false);
      }, 3000);
    }
    setTimeout(() => {
      setShowToggles(true);
    }, 300);
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
            backgroundImage: `url(${assets.uxui.basebg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <RedeemHeader
        currIndex={currIndex}
        link={() => {
          window.open(
            currReward.partnerType == "playsuper"
              ? `${currReward.metadata.campaignAssets.bannerView}`
              : `https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/320px-${currReward.metadata.campaignAssets.bannerView}.brand.png`,
            "_blank"
          );
        }}
        isCharity={currReward.isCharity}
        pieces={currReward.tokensCollected}
        name={currReward.metadata.brandName}
        bubble={
          currReward.partnerType == "playsuper"
            ? `${currReward.metadata.campaignCoverImage}`
            : `https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/160px-${currReward.metadata.campaignCoverImage}.bubble.png`
        }
        action={() => {
          setShowCard(
            <div className="fixed inset-0  bg-black bg-opacity-85  backdrop-blur-[3px] flex justify-center items-center z-50">
              <div className="relative w-full  shadow-lg card-shadow-white">
                <img
                  src={`https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/320px-${currReward.category}.campaign.jpg`}
                  alt="campaign"
                  className="w-full h-full rounded-primary"
                  onClick={() => {
                    setShowCard(null);
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
        }}
      />
      {/* Content */}
      <div className="flex mt-7 justify-center items-center h-screen w-screen absolute mx-auto">
        <div className={`flex items-center justify-center w-full h-full`}>
          <div className="flex flex-col mt-[35px] gap-[28px] items-center justify-center w-full h-full">
            <div
              className={`card ${
                flipped ? "flipped" : ""
              } w-[70%] h-[55%] z-[99]`}
            >
              <div className="card__face card__face--front  relative flex justify-center items-center">
                <JigsawImage
                  imageUrl={
                    currReward.partnerType == "playsuper"
                      ? `${currReward.metadata.campaignAssets.bannerView}`
                      : `https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/320px-${currReward.metadata.campaignAssets.bannerView}.brand.jpg`
                  }
                  activeParts={handleActiveParts(currReward.tokensCollected)}
                  handleClick={() => {
                    if (currReward.tokensCollected === 12) {
                      window.open(
                        "_blank",
                        `https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/320px-${currReward.metadata.campaignAssets.bannerView}.campaign.jpg`
                      );
                    }
                  }}
                />
                <IconBtn
                  isInfo={true}
                  activeMyth={4}
                  handleClick={() => {
                    setShowCard(null);
                  }}
                  align={0}
                />
              </div>
              <div className="card__face card__face--back flex justify-center items-center">
                <PartnerCard close={() => {}} />
              </div>
            </div>

            {/* Jigsaw Button */}
            {currReward.isClaimed &&
            userData.isPlaySuperVerified &&
            currReward.partnerType === "playsuper" ? (
              <div
                className={`flex text-[20px] font-roboto text-white items-center justify-center h-button-primary w-button-primary mx-auto border border-white bg-glass-black  rounded-primary   top-0 left-0 right-0`}
                style={{ top: "100%", transform: "translateY(-50%)" }}
              >
                {currReward.couponCode}
              </div>
            ) : (
              <JigsawButton
                handleClick={handleClick}
                activeMyth={4}
                handleNext={() => {}}
                handlePrev={() => {}}
                faith={currReward.tokensCollected}
                disableLeft={true}
              />
            )}
          </div>
          <div
            onClick={() => {
              handleClickHaptic(tele);
              setFlipped((prev) => !prev);
            }}
            className="absolute -mt-[60px] flex justify-end w-[70%] h-[55%] z-[99]"
          >
            <div className="h-[60px] w-[60px] rounded-full -mt-[25px] -mr-[25px]"></div>
          </div>
        </div>
      </div>

      {showToggles && (
        <>
          <ToggleLeft
            minimize={2}
            handleClick={() => {
              setCurrIndex((prev) =>
                prev === 0 ? rewards.length - 1 : prev - 1
              );
            }}
            activeMyth={4}
          />
          <ToggleRight
            minimize={2}
            handleClick={() => {
              setCurrIndex((prev) => (prev + 1) % rewards.length);
            }}
            activeMyth={4}
          />
        </>
      )}
    </div>
  );
};

export default Redeem;

// {showLink && (
//   <div
//     onClick={() => {
//       window.open(
//         currReward.partnerType == "playsuper"
//           ? `${currReward.metadata.campaignAssets.bannerView}`
//           : `https://media.publit.io/file/BattleofGods/FoF/Assets/PARTNERS/320px-${currReward.metadata.campaignAssets.bannerView}.brand.png`,
//         "_blank"
//       );
//     }}
//     className="flex z-50 justify-center items-center bottom-0 text-paperSub absolute w-full mb-7 uppercase underline"
//   >
//     <div>Checkout</div>
//     <ExternalLink />
//   </div>
// )}
