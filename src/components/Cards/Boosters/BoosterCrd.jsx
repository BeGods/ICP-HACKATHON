import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { mythologies, mythSections } from "../../../utils/constants.fof";
import IconBtn from "../../Buttons/IconBtn";
import ReactHowler from "react-howler";
import { FofContext } from "../../../context/context";
import {
  CustomToggleLeft,
  ToggleLeft,
  ToggleRight,
} from "../../Common/SectionToggles";
import BoosterBtn from "../../../app/fof/Booster/Button";
import { showToast } from "../../Toast/Toast";
import {
  claimAutoAutomata,
  claimAutoBurst,
  claimAutomataBooster,
  claimBurstBooster,
  claimMoonBoost,
  claimShardsBooster,
  fetchKaiaValue,
  generateStarInvoice,
} from "../../../utils/api.fof";
import { trackEvent } from "../../../utils/ga";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { Clapperboard, X } from "lucide-react";
import { useAdsgram } from "../../../hooks/Adsgram";
import { hasTimeElapsed } from "../../../helpers/booster.helper";
import { useTranslation } from "react-i18next";
import { getKaiaValue } from "../../../utils/line";
import { useOpenAd } from "../../../hooks/DappAds";
import { CardWrap } from "../../Layouts/Wrapper";
import { useDisableWrapper } from "../../../hooks/disableWrapper";
import useWalletPayment from "../../../hooks/LineWallet";
import OverlayLayout from "../../Layouts/OverlayLayout";

const tele = window.Telegram?.WebApp;

const PayModal = ({
  t,
  activeMyth,
  assets,
  activeCard,
  handlePayment,
  isLoading,
  authToken,
}) => {
  const [dots, setDots] = useState(1);
  const [tokens, setTokens] = useState(0);
  const { wrapWithDisable } = useDisableWrapper();

  const getUpdatedKaiaVal = async (req, res) => {
    try {
      const response = await fetchKaiaValue(authToken);

      setTokens(response.data);
    } catch (error) {
      console.log(err);
    }
  };

  const kaiaDisplayValue = useMemo(() => {
    const multiplier = activeCard === "automata" ? 1 : 3;
    return getKaiaValue(multiplier, tokens);
  }, [tokens, activeCard]);

  useEffect(() => {
    (async () => await getUpdatedKaiaVal())();
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="center-section">
      <div className="relative card-width flex items-center justify-center rounded-primary card-shadow-white">
        {!isLoading && (
          <div className="absolute text-card z-50 top-0 w-full text-center text-paperHead font-bold mt-2 uppercase">
            <div>{t(`buttons.pay`)}</div>
          </div>
        )}

        <div
          className={`absolute inset-0 rounded-primary`}
          style={{
            backgroundImage: `${`url(${assets.uxui.bgInfo})`}`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center ",
          }}
        />
        {!isLoading ? (
          <div className="relative h-full w-full flex flex-col justify-center items-center">
            <div className="flex flex-col gap-y-4 mt-6">
              <div
                onClick={() => wrapWithDisable(() => handlePayment("kaia"))}
                className="flex z-50 relative flex-col justify-center items-center w-full"
              >
                <div
                  className={`flex gap-x-2 justify-center items-center border border-${mythSections[activeMyth]}-primary h-button-primary w-button-primary bg-glass-black-lg text-white rounded-primary`}
                >
                  <img
                    src={assets.misc.kaia}
                    alt="kaia"
                    className="w-[2.5rem]"
                  />
                  <div className="font-medium text-[40px] text-white glow-text-black">
                    {kaiaDisplayValue}
                  </div>
                </div>
              </div>
              <div className="flex z-50 relative flex-col justify-center items-center w-full">
                <div
                  onClick={() => wrapWithDisable(() => handlePayment("stripe"))}
                  className={`flex gap-x-2 justify-center items-center border border-${mythSections[activeMyth]}-primary h-button-primary w-button-primary bg-glass-black-lg text-white rounded-primary`}
                >
                  <div className="font-medium text-[40px] text-white glow-text-black">
                    $
                  </div>
                  <div className="font-medium text-[40px] text-white glow-text-black">
                    {activeCard === "automata" ? 1 : 3}
                  </div>
                </div>
              </div>
              <div className="leading-para text-para mt-1 text-left mx-auto w-[93%] text-card font-[550]">
                <h2 className={`font-medium uppercase mb-1`}>Note: </h2>
                <p>1. You agree that the product(s) is/are non-refundable.</p>
                <p>
                  2. If paid via LINE IAP, you agree to providing encrypted ID
                  info to LY Corporation.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full flex flex-col justify-center items-center">
            <div className="text-card  font-fof">
              <div className="w-full relative font-medium text-[1.5rem]">
                {t("keywords.load")}
                <span className="absolute">{`${".".repeat(dots)}`}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BoosterClaim = ({
  activeCard,
  mythData,
  disableIcon,
  isAutoPay,
  booster,
}) => {
  const {
    gameData,
    section,
    setSection,
    setGameData,
    setShowBooster,
    enableSound,
    assets,
    setActiveMyth,
    activeMyth,
    authToken,
    setShowCard,
    enableHaptic,
    isTelegram,
    setShowBack,
  } = useContext(FofContext);
  const { createLinePayment } = useWalletPayment();
  const { t, i18n } = useTranslation();
  const disableRef = useRef(false);
  const [payIsActive, setPayIsActive] = useState(false);
  const boostersData = gameData?.mythologies[activeMyth].boosters;
  const adsgramId = import.meta.env.VITE_AD_VERIFY_ID;
  const myths = ["greek", "celtic", "norse", "egyptian", "other"];
  const [activeColor, setActiveColor] = useState(0);
  const [showPayModal, setShowPayModal] = useState(false);
  const [dots, setDots] = useState(1);
  const [isClicked, setIsClicked] = useState(false);
  const disableSoundRef = useRef();
  const boosterLvl =
    !isAutoPay && activeCard === "automata"
      ? Math.min((mythData?.automatalvl ?? 0) + 2, 99)
      : !isAutoPay && activeCard === "minion"
      ? Math.min((mythData?.shardslvl ?? 1) + 2, 99)
      : !isAutoPay && activeCard === "burst"
      ? Math.min((mythData?.burstlvl ?? 0) + 2, 99)
      : !isAutoPay && activeCard === "moon"
      ? "4x"
      : "4x";

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColor((prev) => (prev + 1) % myths.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [myths.length]);

  const handleClaimShards = async (isAdPlayed) => {
    if (disableRef.current === false) {
      disableRef.current === true;
      const mythologyName = {
        mythologyName: mythologies[activeMyth],
      };
      const adId = isAdPlayed ? adsgramId : null;
      const deductValue = isAdPlayed ? 0 : 1;

      try {
        const response = await claimShardsBooster(
          mythologyName,
          adId,
          authToken
        );
        trackEvent("purchase", "claim_alchemist", "success");
        setGameData((prevData) => {
          const updatedData = {
            ...prevData,
            multiColorOrbs: prevData.multiColorOrbs - deductValue,
            mythologies: prevData.mythologies.map((item) =>
              item.name === mythologies[activeMyth]
                ? {
                    ...item,
                    boosters: response.updatedBooster,
                  }
                : item
            ),
          };

          return updatedData;
        });

        setShowCard(null);
        showToast("booster_success");
        setShowBooster("minion");
        setSection(0);
        disableRef.current === false;
      } catch (error) {
        setShowCard(null);
        disableRef.current === false;
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        showToast("booster_error");
      }
    }
  };

  const handleClaimBurst = async () => {
    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      const response = await claimBurstBooster(mythologyName, authToken);
      trackEvent("purchase", "claim_burst", "success");

      setGameData((prevData) => {
        const updatedData = {
          ...prevData,
          multiColorOrbs: prevData.multiColorOrbs - 3,
          mythologies: prevData.mythologies.map((item) =>
            item.name === mythologies[activeMyth]
              ? {
                  ...item,
                  boosters: response.updatedBooster,
                }
              : item
          ),
        };

        return updatedData;
      });
      setShowCard(null);
      showToast("booster_success");
      setSection(0);
    } catch (error) {
      setShowCard(null);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("booster_error");
    }
  };

  const handleClaimAutomata = async (isAdPlayed) => {
    if (disableRef.current === false) {
      disableRef.current = true;
      const mythologyName = {
        mythologyName: mythologies[activeMyth],
      };

      const adId = isAdPlayed ? adsgramId : null;
      const deductValue = isAdPlayed ? 0 : 1;

      try {
        const response = await claimAutomataBooster(
          mythologyName,
          adId,
          authToken
        );
        trackEvent("purchase", "claim_automata", "success");

        setGameData((prevData) => {
          const updatedData = {
            ...prevData,
            isAutomataAutoActive: response.autoPayLock,
            multiColorOrbs: prevData.multiColorOrbs - deductValue,
            mythologies: prevData.mythologies.map((item) =>
              item.name === mythologies[activeMyth]
                ? {
                    ...item,
                    boosters: response.updatedBooster,
                  }
                : item
            ),
          };

          return updatedData;
        });
        setShowCard(null);
        disableRef.current = false;
        showToast("booster_success");
        setShowBooster("automata");
        setSection(0);
      } catch (error) {
        disableRef.current = false;
        setShowCard(null);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        showToast("booster_error");
      }
    }
  };

  const handleClaimAutoAutomata = async (isAdPlayed) => {
    if (disableRef.current === false) {
      disableRef.current = true;

      const adId = isAdPlayed ? adsgramId : null;
      const deductValue = isAdPlayed ? 0 : 3;

      try {
        await claimAutoAutomata(authToken, adId);
        trackEvent("purchase", "claim_auto_automata", "success");

        setGameData((prevData) => {
          const now = Date.now();

          const updatedData = {
            ...prevData,
            isAutomataAutoActive: Date.now(),
            multiColorOrbs: prevData.multiColorOrbs - deductValue,
            mythologies: prevData.mythologies.map((item) => ({
              ...item,
              boosters: {
                ...item.boosters,
                automatalvl: item.boosters.automatalvl + 1,
                isAutomataActive: true,
                automataLastClaimedAt: now,
                automataStartTime: now,
              },
            })),
          };

          return updatedData;
        });
        setShowCard(null);
        disableRef.current = false;
        showToast("booster_success");
        setShowBooster("automata");
        setSection(0);
      } catch (error) {
        disableRef.current = false;
        setShowCard(null);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        showToast("booster_error");
      }
    }
  };

  const handleClaimAutoBurst = async (isAdPlayed) => {
    if (disableRef.current === false) {
      disableRef.current = true;

      const adId = isAdPlayed ? adsgramId : null;
      const deductValue = isAdPlayed ? 0 : 3;

      try {
        await claimAutoBurst(authToken, adId);
        trackEvent("purchase", "claim_auto_burst", "success");
        setGameData((prevData) => {
          const now = Date.now();

          const updatedData = {
            ...prevData,
            multiColorOrbs: prevData.multiColorOrbs - deductValue,
            autoPayBurstExpiry: now,
            mythologies: prevData.mythologies.map((item) => ({
              ...item,
              boosters: {
                ...item.boosters,
                isBurstActive: true,
              },
            })),
          };

          return updatedData;
        });
        setShowCard(null);
        disableRef.current = false;
        showToast("booster_success");
        setShowBooster("automata");
        setSection(0);
      } catch (error) {
        disableRef.current = false;
        setShowCard(null);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        showToast("booster_error");
      }
    }
  };

  const handleClaimMoonBoost = async (isAdPlayed) => {
    if (disableRef.current === false) {
      disableRef.current === true;
      const adId = isAdPlayed ? adsgramId : null;
      const deductValue = isAdPlayed ? 0 : 3;

      try {
        await claimMoonBoost(authToken, adId);
        trackEvent("purchase", "claim_moon", "success");
        setGameData((prevData) => {
          const updatedData = {
            ...prevData,
            multiColorOrbs: prevData.multiColorOrbs - deductValue,
            isMoonActive: true,
            moonExpiresAt: Date.now(),
          };

          return updatedData;
        });

        setShowCard(null);
        showToast("booster_success");
        setSection(4);
        disableRef.current === false;
      } catch (error) {
        setShowCard(null);
        disableRef.current === false;
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        showToast("booster_error");
      }
    }
  };

  const handleButton = () => {
    handleClickHaptic(tele, enableHaptic);
    const handleClaim = {
      automata: isAutoPay ? handleClaimAutoAutomata : handleClaimAutomata,
      minion: handleClaimShards,
      burst: isAutoPay ? handleClaimAutoBurst : handleClaimBurst,
      moon: handleClaimMoonBoost,
    }[activeCard];

    return handleClaim();
  };

  const handleUpdatePayReward = () => {
    if (activeCard === "automata" && isAutoPay) {
      trackEvent("purchase", "claim_automata", "success");
      setGameData((prevData) => {
        const now = Date.now();
        const updatedData = {
          ...prevData,
          isAutomataAutoActive: true,
          multiColorOrbs: prevData.multiColorOrbs - 0,
          mythologies: prevData.mythologies.map((item) =>
            item.name === mythologies[activeMyth]
              ? {
                  ...item,
                  boosters: {
                    ...item.boosters,
                    automatalvl: Math.min(item.boosters.automatalvl + 2, 99),
                    isAutomataActive: true,
                    automataLastClaimedAt: now,
                    automataStartTime: now,
                  },
                }
              : item
          ),
        };
        return updatedData;
      });
      setShowCard(null);
      showToast("booster_success");
      setShowBooster("automata");
      setSection(0);
      setPayIsActive(false);
    } else if (activeCard === "burst" && isAutoPay) {
      trackEvent("purchase", "claim_auto_burst", "success");
      setGameData((prevData) => {
        const now = Date.now();
        const updatedData = {
          ...prevData,
          autoPayBurstExpiry: now,
          mythologies: prevData.mythologies.map((item) => ({
            ...item,
            boosters: {
              ...item.boosters,
              isBurstActive: true,
            },
          })),
        };
        return updatedData;
      });
      setShowCard(null);
      showToast("booster_success");
      setShowBooster("automata");
      setSection(0);
      setPayIsActive(false);
    }
  };

  const onReward = useCallback(() => {
    setPayIsActive(true);

    try {
      if (activeCard == "automata" && !isAutoPay) {
        handleClaimAutomata(true);
      }
      if (activeCard == "automata" && isAutoPay) {
        handleClaimAutoAutomata(true);
      }

      if (activeCard == "moon") {
        handleClaimMoonBoost(true);
      }
      if (activeCard == "burst" && isAutoPay) {
        handleClaimAutoBurst(true);
      }
      if (activeCard == "minion") {
        handleClaimShards(true);
      }
      setIsClicked(false);
    } catch (err) {
      console.log(err);
    } finally {
      setPayIsActive(false);
    }
  }, []);

  const onError = useCallback((result) => {
    showToast("ad_error");
  }, []);

  const handleGenerateInvoice = async () => {
    setPayIsActive(true);
    try {
      const response = await generateStarInvoice(authToken, activeCard);
      const invoice = `https://t.me/invoice/${response.invoice
        ?.split("/")
        .pop()
        .replace(/^\$/, "")}`;
      await tele.openInvoice(`${invoice}`, (status) => {
        if (status == "paid") {
          handleUpdatePayReward();
        } else if (status == "cancelled" || status == "failed") {
          showToast("error_payment");
          setPayIsActive(false);
          setShowCard(null);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinePayment = async (paymentMethod) => {
    setPayIsActive(true);

    try {
      const paymentPromise = createLinePayment(paymentMethod, activeCard);

      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve(false), 180000)
      );

      const paymentStatus = await Promise.race([
        paymentPromise,
        timeoutPromise,
      ]);

      if (paymentStatus) {
        handleUpdatePayReward();
      } else {
        showToast("error_payment");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      showToast("error_payment");
    } finally {
      setShowCard(null);
      setPayIsActive(false);
    }
  };

  const showAd = useAdsgram({
    blockId: import.meta.env.VITE_AD_BOOSTER,
    onReward,
    onError,
  });

  const { loadAd, isReady } = useOpenAd({
    callReward: onReward,
  });

  const addOns = {
    ads: {
      label: "Free via Ad",
      src: <Clapperboard color="white" size={"2rem"} />,
      isDisabled: !isTelegram && !isReady && !isClicked,
      condition:
        !isAutoPay &&
        ((activeCard === "automata" && !boostersData?.isAutomataActive) ||
          (activeCard === "minion" && boostersData?.isShardsClaimActive)),
      handleClick: () => {
        handleClickHaptic(tele, enableHaptic);
        if (isTelegram) {
          if (!isClicked) {
            setIsClicked(true);
            showAd();
            setTimeout(() => {
              setIsClicked(false);
            }, 9000);
          }
          showAd();
        } else {
          if (!isReady && !isClicked) {
            setIsClicked(true);
            loadAd();
            setTimeout(() => {
              setIsClicked(false);
            }, 9000);
          }
        }
      },
    },
    tgStars: {
      label: "Pay via Star",
      isDisabled: false,
      src: (
        <div className="flex relative items-center justify-center">
          <div className="text-white text-black-contour mt-1 z-10 absolute text-[2rem]">
            {activeCard === "automata" ? 1 : 3}
          </div>{" "}
          <img
            src={assets?.misc.tgStar}
            alt="star"
            className="w-[4rem] h-[4rem]"
          />
        </div>
      ),
      condition:
        isAutoPay &&
        !payIsActive &&
        isTelegram &&
        ((activeCard === "automata" &&
          gameData?.isEligibleToAutomataAuto &&
          gameData?.isAutomataAutoActive === -1 &&
          !boostersData.isAutomataActive) ||
          (activeCard === "burst" &&
            !boostersData.isBurstActive &&
            hasTimeElapsed(gameData.autoPayBurstExpiry))),
      handleClick: () => {
        handleClickHaptic(tele, enableHaptic);
        handleGenerateInvoice();
      },
    },
    dapp: {
      label: "Pay via Kaia",
      isDisabled: false,
      src: (
        <div className="flex uppercase flex-col items-center gap-2 w-fit">
          <div className="flex gap-x-1 relative items-center justify-center">
            <img src={assets?.misc.kaia} alt="star" className="w-3/4" />
          </div>
        </div>
      ),
      condition:
        isAutoPay &&
        !payIsActive &&
        !isTelegram &&
        ((activeCard === "automata" &&
          gameData?.isEligibleToAutomataAuto &&
          gameData?.isAutomataAutoActive === -1 &&
          !boostersData.isAutomataActive) ||
          (activeCard === "burst" &&
            !boostersData.isBurstActive &&
            hasTimeElapsed(gameData.autoPayBurstExpiry))),
      handleClick: () => {
        handleClickHaptic(tele, enableHaptic);
        setShowPayModal(true);
      },
    },
  };

  const activeAddOn = Object.values(addOns).find((item) => item.condition);

  return (
    <OverlayLayout>
      {!showPayModal ? (
        <>
          {/* Balance */}
          {section === 2 && (
            <div className="flex gap-1 pt-gamePanelTop w-full justify-center items-center">
              <div
                className={`flex relative text-center justify-center max-w-orb p-0.5 items-center rounded-full glow-icon-white`}
              >
                <img src={assets.items.multiorb} alt="orb" />
              </div>
              <div
                className={`font-fof text-[2rem] font-normal text-white text-black-sm-contour transition-all duration-1000`}
              >
                {gameData.multiColorOrbs}
              </div>
            </div>
          )}

          {/* Card */}
          <div className="z-[99] pointer-events-auto center-section">
            <CardWrap
              Front={
                <div className="w-full h-full relative flex justify-center items-center">
                  <div
                    className={`absolute inset-0 rounded-primary`}
                    style={{
                      backgroundImage: `${`url(${
                        assets?.boosters[
                          `${
                            activeCard === "minion" ? "alchemist" : activeCard
                          }Card`
                        ]
                      })`}`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center center ",
                    }}
                  />
                  <div
                    className={`absolute  top-0 left-3 ${
                      isAutoPay
                        ? "gradient-multi"
                        : "text-white  glow-text-black"
                    } text-[2.75rem] font-symbols z-10`}
                  >
                    {activeCard === "automata"
                      ? "n"
                      : activeCard === "minion"
                      ? "9"
                      : "s"}
                  </div>
                  <div className="relative h-full w-full flex flex-col items-center">
                    <div className="flex z-50 relative flex-col justify-center items-center h-full w-full">
                      {!disableIcon && (
                        <IconBtn
                          isInfo={true}
                          activeMyth={activeMyth}
                          align={0}
                        />
                      )}
                      <div
                        className={`flex relative  mt-auto items-center h-[19%] w-full card-shadow-white-celtic `}
                      >
                        <div
                          style={{
                            backgroundImage: `url(${assets?.uxui.footer})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: "100%",
                          }}
                          className={`rounded-b-primary filter-paper-${
                            !isAutoPay &&
                            activeCard !== "moon" &&
                            mythSections[activeMyth]
                          }`}
                        />
                        <div className="flex justify-center w-full h-full items-center glow-text-quest px-2 z-10">
                          <div className="flex gap-x-2 uppercase glow-text-quest text-white z-10">
                            {t(`boosters.${booster}.title`)}
                            <div
                              className={`flex text-${mythSections[activeMyth]}-text gap-x-1`}
                            >
                              <span>{!isAutoPay && "Lvl"}</span>
                              {boosterLvl}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              Back={
                <div className={`flex select-none justify-center items-center`}>
                  <div className="relative w-full h-full text-card">
                    <img
                      src={assets?.uxui.bgInfo}
                      alt="info background"
                      className="w-full h-full object-cover rounded-primary z-10"
                    />
                  </div>
                  <div className="absolute flex flex-col top-0 z-20 w-full">
                    <div className="flex flex-col leading-tight justify-center items-center flex-grow  text-card pt-[0.5dvh]">
                      <div className="text-left">
                        <h1 className="text-paperHead font-bold uppercase">
                          {t(`boosters.${booster}.title`)}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`absolute h-full pt-[35%] leading-para text-para -mt-[5px] text-center mx-auto w-[93%] text-card font-[550] ${
                      (i18n.language === "hi" ||
                        i18n.language === "th" ||
                        i18n.language === "ru") &&
                      "font-normal"
                    } ${i18n.language === "ru" && "leading-[2dvh]"}`}
                  >
                    {t(`boosters.${booster}.desc`)}
                  </div>
                  <IconBtn
                    isFlip={true}
                    isInfo={false}
                    activeMyth={5}
                    align={10}
                  />
                </div>
              }
              handleClick={() => {}}
            />
          </div>

          {/* Pay */}
          <div className="absolute flex flex-col justify-center bottom-0 mb-safeBottom">
            {payIsActive ? (
              <div className="flex items-center justify-center">
                <div className="flex uppercase flex-col items-center gap-2 w-fit">
                  <div className="flex pt-8 relative items-center justify-center">
                    <div className="text-white text-black-contour  text-[8vw]">
                      <div className="w-full text-center relative font-medium text-tertiary">
                        Processing
                        <span className="absolute">{`${".".repeat(
                          dots
                        )}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <BoosterBtn
                isAutoPay={isAutoPay}
                activeCard={activeCard}
                mythData={mythData}
                handleClaim={handleButton}
                activeMyth={activeMyth}
                boosterLvl={boosterLvl}
                t={t}
              />
            )}
          </div>
          {activeAddOn && (
            <>
              {showPayModal ? (
                <CustomToggleLeft
                  minimize={2}
                  label={"Close"}
                  src={<X color="white" size={"2rem"} />}
                  handleClick={() => {
                    setShowPayModal(false);
                  }}
                />
              ) : (
                <CustomToggleLeft
                  minimize={2}
                  label={activeAddOn.label}
                  src={activeAddOn.src}
                  handleClick={activeAddOn.handleClick}
                />
              )}
            </>
          )}
          <ToggleLeft
            minimize={2}
            handleClick={() => {
              setActiveMyth((prev) => (prev - 1 + 4) % 4);
            }}
            activeMyth={activeMyth}
          />
          <ToggleRight
            minimize={2}
            handleClick={() => {
              setActiveMyth((prev) => (prev + 1) % 4);
            }}
            activeMyth={activeMyth}
          />
        </>
      ) : (
        <PayModal
          isLoading={payIsActive}
          enableHaptic={enableHaptic}
          t={t}
          authToken={authToken}
          activeMyth={activeMyth}
          assets={assets}
          activeCard={activeCard}
          closeModal={() => {
            setShowPayModal(false);
          }}
          handlePayment={(method) => handleLinePayment(method)}
        />
      )}

      {assets.audio &&
        (activeCard === "automata" || activeCard === "minion") && (
          <ReactHowler
            src={
              assets.audio[activeCard === "automata" ? "automata" : "alchemist"]
            }
            playing={enableSound && !disableSoundRef.current}
            preload={true}
            loop={false}
            onEnd={() => {
              disableSoundRef.current = true;
            }}
          />
        )}
    </OverlayLayout>
  );
};

export default BoosterClaim;
