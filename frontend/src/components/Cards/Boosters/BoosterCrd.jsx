import React, { useCallback, useContext, useRef } from "react";
import { mythologies, mythSections } from "../../../utils/constants";
import IconBtn from "../../Buttons/IconBtn";
import ReactHowler from "react-howler";
import { MyContext } from "../../../context/context";
import { ToggleLeft, ToggleRight } from "../../Common/SectionToggles";
import BoosterBtn from "../../Buttons/BoosterBtn";
import { showToast } from "../../Toast/Toast";
import {
  claimAutoAutomata,
  claimAutoBurst,
  claimAutomataBooster,
  claimBurstBooster,
  claimShardsBooster,
} from "../../../utils/api";
import { trackEvent } from "../../../utils/ga";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { Clapperboard } from "lucide-react";
import { useAdsgram } from "../../../hooks/Adsgram";
import { hasTimeElapsed } from "../../../helpers/booster.helper";

const tele = window.Telegram?.WebApp;

const BoosterClaim = ({
  activeCard,
  t,
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
  } = useContext(MyContext);
  const disableRef = useRef(false);
  const boostersData = gameData.mythologies[activeMyth].boosters;
  const adsgramId = import.meta.env.VITE_AD_BOOSTER;

  const handleClaimShards = async (isAdPlayed) => {
    if (disableRef.current === false) {
      disableRef.current === true;
      const mythologyName = {
        mythologyName: mythologies[activeMyth],
      };
      const adId = isAdPlayed ? adsgramId : null;

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
            multiColorOrbs: prevData.multiColorOrbs - 1,
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
            multiColorOrbs: prevData.multiColorOrbs - 1,
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

  const handleButton = () => {
    handleClickHaptic(tele, enableHaptic);
    const handleClaim = {
      automata: isAutoPay ? handleClaimAutoAutomata : handleClaimAutomata,
      minion: handleClaimShards,
      burst: isAutoPay ? handleClaimAutoBurst : handleClaimBurst,
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
    if (activeCard == "burst" && isAutoPay) {
      handleClaimAutoBurst(true);
    }
    if (activeCard == "minion") {
      handleClaimShards(true);
    }
  }, []);
  const onError = useCallback((result) => {
    console.log(result);

    showToast("ad_error");
  }, []);

  const showAd = useAdsgram({
    blockId: adsgramId,
    onReward,
    onError,
  });

  return (
    <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
      {((activeCard === "automata" && !boostersData?.isAutomataActive) ||
        (activeCard === "minion" && boostersData?.isShardsClaimActive) ||
        (activeCard === "burst" &&
          isAutoPay &&
          !boostersData.isBurstActive &&
          hasTimeElapsed(gameData.autoPayBurstExpiry))) && (
        <div
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            showAd();
          }}
          className="absolute flex items-center justify-center top-0 w-screen pt-2"
        >
          <div className="flex gap-2 w-fit">
            <div className="flex items-center justify-center">
              <Clapperboard color="white" size={"8vw"} />
            </div>
            <div className="flex flex-col text-white">
              <div className="font-semibold text-[4.5vw] text-gold">
                Click Here to Watch an Ad
              </div>
              <div className="text-[4.25vw] -mt-1">
                Claim your free booster!
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        onClick={handleButton}
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
                  !isAutoPay && mythSections[activeMyth]
                }`}
              />
              <div
                className={`flex justify-center ${
                  isAutoPay
                    ? "gradient-icon-multi"
                    : "text-white  glow-text-black"
                } text-[60px] w-full h-full items-center px-3 z-10 font-symbols`}
              >
                {activeCard === "automata"
                  ? "n"
                  : activeCard === "minion"
                  ? "9"
                  : "s"}
              </div>
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
