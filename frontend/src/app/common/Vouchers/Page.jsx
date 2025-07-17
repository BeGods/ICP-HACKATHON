import React, { useCallback, useContext, useEffect, useState } from "react";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../../components/Common/SectionToggles";
import { handleActiveParts } from "../../../helpers/quests.helper";
import {
  claimCustomReward,
  claimPlaysuperReward,
} from "../../../utils/api.fof";
import IconBtn from "../../../components/Buttons/IconBtn";
import PartnerCard from "../../../components/Cards/Info/PartnerInfoCrd";
import RedeemHeader from "./Header";
import confetti from "canvas-confetti";
import { showToast } from "../../../components/Toast/Toast";
import { trackComponentView } from "../../../utils/ga";
import BlackOrbRewardCrd from "../../../components/Cards/Reward/OrbCrd";
import BgLayout from "../../../components/Layouts/BgLayout";
import CanvasImage from "../../../components/Cards/Canvas/CrdCanvas";
import { CardWrap } from "../../../components/Layouts/Wrapper";
import { ButtonLayout } from "../../../components/Layouts/ButtonLayout";
import { ThumbsUp } from "lucide-react";
import { useAdsgram } from "../../../hooks/Adsgram";
import { useOpenAd } from "../../../hooks/DappAds";

const tele = window.Telegram?.WebApp;
const Redeem = (props) => {
  const {
    activeReward,
    userData,
    authToken,
    triggerConf,
    setTriggerConf,
    isTgMobile,
    game,
    isTelegram,
    setSection,
  } = useContext(MainContext);
  const fofContext = useContext(FofContext);
  const rorContext = useContext(RorContext);
  const setGameData =
    game === "fof" ? fofContext.setGameData : rorContext.setGameData;
  const setShowCard =
    game === "fof" ? fofContext.setShowCard : rorContext.setShowCard;
  const setRewards =
    game === "fof" ? fofContext.setRewards : rorContext.setRewards;
  const rewards = game === "fof" ? fofContext.rewards : rorContext.rewards;
  const setMinimize =
    game === "fof" ? fofContext.setMinimize : rorContext.setMinimize;
  const onboardIdx = game === "fof" ? 11 : 15;
  const [showToggles, setShowToggles] = useState(false);
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
    if (currReward.tokensCollected < 4) {
      const currLink = currReward.metadata.termsAndConditions;
      window.open(currLink, "_blank");
    } else if (currReward.partnerType == "playsuper") {
      if (userData.isPlaySuperVerified) {
        handleRedeen();
      } else {
        setSection(onboardIdx);
      }
    } else {
      if (currReward.isClaimed) {
        setShowCard(
          <div
            onClick={() => {
              setShowCard(null);
            }}
            className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50"
          >
            <img
              src={`https://media.publit.io/file/Partners/320px-${currReward.metadata.campaignAssets.bannerView}.png`}
              alt="campaign"
              className="w-full h-4/5"
            />
          </div>
        );
      } else {
        handleCustomRedeen();
      }
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

  const handleCustomRedeen = async () => {
    try {
      if (currReward.partnerType === "custom") {
        const response = await claimCustomReward(currReward.id, authToken);
        showToast("voucher_success");
        setShowCard(
          <BlackOrbRewardCrd
            reward={
              currReward.partnerType == "playsuper"
                ? `${currReward.metadata.campaignCoverImage}`
                : `https://media.publit.io/file/Partners/160px-${currReward.metadata.campaignCoverImage}.bubble.png`
            }
            blackorbs={3}
            value={0}
            handAction={() => {}}
          />
        );
        ``;

        setRewards((prevRewards) =>
          prevRewards.map((reward) =>
            reward.id === currReward.id
              ? {
                  ...reward,
                  isClaimed: true,
                }
              : reward
          )
        );
        setGameData((prev) => {
          return {
            ...prev,
            blackOrbs: prev.blackOrbs + 1,
          };
        });
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

  useEffect(() => {
    setMinimize(1);

    return () => {
      setMinimize(2);
    };
  }, []);

  const onError = useCallback((result) => {
    console.log(result);
    showToast("ad_error");
  }, []);

  const showAd = useAdsgram({
    blockId: import.meta.env.VITE_AD_BOOSTER,
    handleClick,
    onError,
  });

  const { loadAd, isReady } = useOpenAd({
    callReward: handleClick,
  });

  return (
    <BgLayout>
      {/* Header */}
      <RedeemHeader
        currIndex={currIndex}
        link={() => {
          const currLink = currReward.metadata.brandRedirectionLink;
          window.open(currLink, "_blank");
        }}
        isCharity={currReward.isCharity}
        pieces={currReward.tokensCollected}
        name={currReward.metadata.brandName}
        bubble={
          currReward.partnerType == "playsuper"
            ? `${currReward.metadata.campaignCoverImage}`
            : `https://media.publit.io/file/Partners/160px-${currReward.metadata.campaignCoverImage}.bubble.png`
        }
        action={() => {
          setShowCard(
            <div className="fixed inset-0  bg-black bg-opacity-85  backdrop-blur-[3px] flex justify-center items-center z-50">
              <div className="relative w-full  shadow-lg card-shadow-white">
                <img
                  src={`https://media.publit.io/file/Partners/320px-${currReward.category}.png`}
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

      <div className="center-section">
        <CardWrap
          isPacket={true}
          Front={
            <div
              className={`w-full h-full relative flex justify-center items-center`}
            >
              <CanvasImage
                isTgMobile={isTgMobile}
                grid={[2, 2]}
                imageUrl={
                  currReward.partnerType == "playsuper"
                    ? `${currReward.metadata.campaignAssets.bannerView}`
                    : `https://media.publit.io/file/Partners/320px-${currReward.metadata.campaignAssets.bannerView}.png`
                }
                activeParts={handleActiveParts(currReward.tokensCollected)}
                handleClick={() => {
                  if (currReward.tokensCollected === 4) {
                    window.open(
                      `https://media.publit.io/file/Partners/320px-${currReward.metadata.campaignAssets.bannerView}.png`,
                      "_blank"
                    );
                  }
                }}
              />
              <IconBtn
                isJigsaw={true}
                isInfo={true}
                activeMyth={4}
                handleClick={() => {
                  setShowCard(null);
                }}
                align={isTelegram ? 7 : 9}
              />
            </div>
          }
          Back={
            <div className="flex h-full w-full justify-center items-center">
              <PartnerCard reward={currReward} close={() => {}} />
            </div>
          }
        />
      </div>

      <div className="absolute flex justify-center w-full bottom-0 mb-safeBottom">
        {currReward.isClaimed &&
        userData.isPlaySuperVerified &&
        currReward.partnerType === "playsuper" ? (
          <ButtonLayout mode="info" centerContent={currReward.couponCode} />
        ) : (
          <ButtonLayout
            mode="default"
            centerContent={
              <ThumbsUp
                size={"1.75rem"}
                color={currReward.tokensCollected < 4 ? "gray" : "white"}
              />
            }
            handleNext={() => {}}
            handlePrev={() => {}}
            customMyth={8}
            handleCenterClick={() => {
              if (currReward.tokensCollected < 4) {
                if (isTelegram) {
                  showAd();
                } else {
                  if (isReady) {
                    loadAd();
                  }
                }
              }
            }}
          />
        )}
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
          <ToggleBack
            minimize={2}
            handleClick={() => {
              setSection(5);
            }}
            activeMyth={8}
          />
        </>
      )}
    </BgLayout>
  );
};

export default Redeem;
