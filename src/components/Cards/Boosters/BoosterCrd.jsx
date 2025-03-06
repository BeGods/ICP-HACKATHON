import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  mythologies,
  mythSections,
  mythSymbols,
} from "../../../utils/constants.fof";
import IconBtn from "../../Buttons/IconBtn";
import ReactHowler from "react-howler";
import { FofContext } from "../../../context/context";
import { ToggleLeft, ToggleRight } from "../../Common/SectionToggles";
import BoosterBtn from "../../Buttons/BoosterBtn";
import { showToast } from "../../Toast/Toast";
import {
  claimAutoAutomata,
  claimAutoBurst,
  claimAutomataBooster,
  claimBurstBooster,
  claimMoonBoost,
  claimShardsBooster,
} from "../../../utils/api.fof";
import { trackEvent } from "../../../utils/ga";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { Clapperboard, Star } from "lucide-react";
import { useAdsgram } from "../../../hooks/Adsgram";
import { hasTimeElapsed } from "../../../helpers/booster.helper";
import { useTranslation } from "react-i18next";

const tele = window.Telegram?.WebApp;

const BoosterClaim = ({
  activeCard,
  mythData,
  closeCard,
  disableIcon,
  isAutoPay,
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
  } = useContext(FofContext);
  const { t } = useTranslation();
  const disableRef = useRef(false);
  const [payIsActive, setPayIsActive] = useState(false);
  const boostersData = gameData.mythologies[activeMyth].boosters;
  const adsgramId = import.meta.env.VITE_AD_BOOSTER;
  const myths = ["greek", "celtic", "norse", "egyptian", "other"];
  const [activeColor, setActiveColor] = useState(0);
  const [dots, setDots] = useState(1);

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

  const onReward = useCallback(() => {
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
                          automatalvl: Math.min(
                            item.boosters.automatalvl + 2,
                            99
                          ),
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

  const showAd = useAdsgram({
    blockId: adsgramId,
    onReward,
    onError,
  });

  return (
    <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
      {((activeCard === "automata" &&
        !boostersData?.isAutomataActive &&
        !isAutoPay) ||
        (activeCard === "minion" &&
          boostersData?.isShardsClaimActive &&
          !isAutoPay)) && (
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            showAd();
          }}
          className="absolute flex items-center justify-center top-0 w-screen pt-2"
        >
          <div className="flex uppercase flex-col items-center gap-2 w-fit">
            <div className="flex relative items-center justify-center">
              <Clapperboard color="#ffd660" size={"16vw"} />
            </div>
            <div className="flex flex-col text-white">
              <div className="text-[6vw] -mt-2">
                <span className="text-gold">Watch</span> {t("note.ad")}
              </div>
            </div>
          </div>
        </div>
      )}

      {((activeCard === "automata" &&
        !boostersData?.isAutomataActive &&
        isAutoPay) ||
        (activeCard === "burst" &&
          boostersData?.isShardsClaimActive &&
          isAutoPay)) &&
        !payIsActive && (
          <div
            onClick={() => {
              handleClickHaptic(tele, enableHaptic);
              handleGenerateInvoice();
            }}
            className="absolute flex items-center justify-center top-0 w-screen pt-2"
          >
            <div className="flex uppercase flex-col items-center gap-2 w-fit">
              <div className="flex relative items-center justify-center">
                <div className="text-white text-black-contour mt-1 z-10 absolute text-[8vw]">
                  {activeCard === "automata" ? 1 : 3}
                </div>{" "}
                <img
                  src="https://i.postimg.cc/2yztL9mh/tg-star.png"
                  alt="star"
                  className="w-[18vw] h-[18vw]"
                />
              </div>
              <div className="flex flex-col text-white">
                <div className="text-[6vw] -mt-2">
                  <span className="text-gold">{t("buttons.pay")}</span>{" "}
                  {t("note.ad")}
                </div>
              </div>
            </div>
          </div>
        )}

      {((activeCard === "automata" &&
        !boostersData?.isAutomataActive &&
        isAutoPay) ||
        (activeCard === "burst" &&
          boostersData?.isShardsClaimActive &&
          isAutoPay)) &&
        payIsActive && (
          <div className="absolute flex items-center justify-center top-0 w-screen pt-2">
            <div className="flex uppercase flex-col items-center gap-2 w-fit">
              <div className="flex pt-8 relative items-center justify-center">
                <div className="text-white text-black-contour  text-[8vw]">
                  <div className="w-full relative font-medium text-secondary">
                    {t("keywords.load")}
                    <span className="absolute">{`${".".repeat(dots)}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      <div
        onClick={() => {
          const conditions = {
            automata: [
              gameData?.isAutomataAutoActive === -1 && isAutoPay,
              !mythData?.isAutomataActive && !isAutoPay,
            ],
            minion: [mythData?.isShardsClaimActive],
            burst: [
              !mythData.isBurstActive,
              mythData?.isBurstActiveToClaim && !isAutoPay,
              hasTimeElapsed(gameData.autoPayBurstExpiry) && isAutoPay,
            ],
            moon: [!gameData.isMoonActive],
          };

          const shouldHandleButton = conditions[activeCard]?.some(Boolean);

          if (shouldHandleButton) {
            handleButton();
          }
        }}
        className="absolute  w-[72%] h-[50%] mt-10 cursor-pointer z-50 rounded-primary"
      ></div>
      {section === 2 && (
        <div className="flex gap-3 absolute bottom-5">
          <div className="flex gap-1 items-center">
            <div
              className={`flex relative text-center justify-center max-w-orb p-0.5 items-center rounded-full glow-icon-white`}
            >
              <img src={assets.uxui.multiorb} alt="orb" />
            </div>
            <div
              className={`font-fof text-[28px] font-normal text-white text-black-sm-contour transition-all duration-1000`}
            >
              {gameData.multiColorOrbs}
            </div>
          </div>
        </div>
      )}
      <div className="relative w-[72%] h-[55%] mt-[70px] flex items-center justify-center rounded-primary card-shadow-white">
        <div
          className={`absolute inset-0 rounded-primary`}
          style={{
            backgroundImage: `${`url(${
              assets.boosters[
                `${activeCard === "minion" ? "alchemist" : activeCard}Card`
              ]
            })`}`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center ",
          }}
        />
        <div className="relative h-full w-full flex flex-col items-center">
          <div className="flex z-50 relative flex-col justify-center items-center h-full w-full">
            {!disableIcon && (
              <IconBtn
                isInfo={false}
                activeMyth={activeMyth}
                handleClick={closeCard}
                align={0}
              />
            )}
            <div
              className={`flex relative  mt-auto items-center h-[19%] w-full card-shadow-white-celtic `}
            >
              <div
                style={{
                  backgroundImage: `url(${assets.uxui.paper})`,
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
              {activeCard === "moon" ? (
                <div className="flex justify-center items-center w-full">
                  <div
                    className={`flex relative text-center justify-center text-black-sm-contour items-center glow-icon-${mythSections[activeColor]} `}
                  >
                    <img
                      src={assets.uxui.baseorb}
                      alt="orb"
                      className={`filter-orbs-${mythSections[activeColor]} overflow-hidden max-w-[14vw]`}
                    />
                    <span
                      className={`absolute z-1  text-black-sm-contour transition-all duration-1000 text-white  font-symbols  text-[10vw] mt-1 opacity-50`}
                    >
                      {mythSymbols[mythSections[activeColor]]}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex w-full justify-center items-center">
                  <div
                    className={`${
                      isAutoPay
                        ? "gradient-multi"
                        : "text-white  glow-text-black"
                    } text-[60px] font-symbols z-10`}
                  >
                    {activeCard === "automata"
                      ? "n"
                      : activeCard === "minion"
                      ? "9"
                      : "s"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BoosterBtn
        isAutoPay={isAutoPay}
        activeCard={activeCard}
        mythData={mythData}
        handleClaim={handleButton}
        activeMyth={activeMyth}
        t={t}
      />
      {assets.audio &&
        (activeCard === "automata" || activeCard === "minion") && (
          <ReactHowler
            src={
              assets.audio[
                activeCard === "automata" ? "automataShort" : "alchemistShort"
              ]
            }
            playing={enableSound}
            preload={true}
          />
        )}

      <>
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
    </div>
  );
};

export default BoosterClaim;
