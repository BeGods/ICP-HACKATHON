import React, { useContext, useEffect, useState } from "react";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import JigsawButton from "../../../components/Buttons/JigsawBtn";
import JigsawImage from "../../../components/Cards/Jigsaw/JigsawCrd";
import {
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
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import BlackOrbRewardCrd from "../../../components/Cards/Reward/BlackOrbCrd";

const tele = window.Telegram?.WebApp;

const Redeem = (props) => {
  const {
    activeReward,
    userData,
    authToken,
    assets,
    triggerConf,
    setTriggerConf,
    isTelegram,
    game,
    isBrowser,
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
  const setSection =
    game === "fof" ? fofContext.setSection : rorContext.setSection;
  const onboardIdx = game === "fof" ? 11 : 15;
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

  return (
    <div
      className={`flex flex-col ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      } overflow-hidden m-0 w-screen`}
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
            backgroundImage: `url(${assets.uxui.baseBgA})`,
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
          const currLink = currReward.metadata.brandRedirectionLink;
          window.open(currLink, "_blank");
          // reward.metadata.brandRedirectionLink
          // setShowCard(
          //   <div
          //     onClick={() => {
          //       setShowCard(null);
          //     }}
          //     className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50"
          //   >
          //     <img
          //       src={
          //         currReward.partnerType == "playsuper"
          //           ? `${currReward.metadata.campaignAssets.bannerView}`
          //           : `https://media.publit.io/file/Partners/320px-${currReward.metadata.campaignAssets.bannerView}.campaign.png`
          //       }
          //       alt="campaign"
          //       className="w-full h-4/5"
          //     />
          //   </div>
          // );
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
      {/* Content */}
      <div
        className={`flex mt-7 ${
          isTelegram ? "tg-container-height" : "browser-container-height"
        } justify-center items-center w-screen absolute mx-auto`}
      >
        <div className={`flex items-center justify-center w-full h-full`}>
          <div className="flex flex-col gap-[12px] items-center justify-center w-full h-full">
            <div
              className={`card ${
                isBrowser
                  ? "h-[59%] -mt-1"
                  : isTelegram
                  ? "h-[55%]"
                  : "h-[60%] -mt-1"
              } ${flipped ? "flipped" : ""} card-width z-[99]`}
            >
              <div className="card__face card__face--front  relative flex justify-center items-center">
                <JigsawImage
                  isTelegram={isTelegram}
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
                  align={7}
                />
              </div>
              <div className="card__face card__face--back flex justify-center items-center">
                <PartnerCard reward={currReward} close={() => {}} />
              </div>
            </div>

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
                limit={4}
                handleClick={handleClick}
                activeMyth={4}
                handleNext={() => {}}
                handlePrev={() => {}}
                isPartner={true}
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
            className="absolute -mt-[60px] flex justify-end card-width z-[99]"
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
//           : `https://media.publit.io/file/Partners/320px-${currReward.metadata.campaignAssets.bannerView}.brand.png`,
//         "_blank"
//       );
//     }}
//     className="flex z-50 justify-center items-center bottom-0 text-paperSub absolute w-full mb-7 uppercase underline"
//   >
//     <div>Checkout</div>
//     <ExternalLink />
//   </div>
// )}
