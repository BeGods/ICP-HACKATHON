import React, { useContext, useRef } from "react";
import { mythologies, mythSections } from "../../../utils/constants";
import IconBtn from "../../Buttons/IconBtn";
import ReactHowler from "react-howler";
import { MyContext } from "../../../context/context";
import { ToggleLeft, ToggleRight } from "../../Common/SectionToggles";
import BoosterBtn from "../../Buttons/BoosterBtn";
import { showToast } from "../../Toast/Toast";
import {
  claimAutoAutomata,
  claimAutomataBooster,
  claimBurstBooster,
  claimShardsBooster,
} from "../../../utils/api";

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
  } = useContext(MyContext);
  const disableRef = useRef(false);

  const handleClaimShards = async () => {
    if (disableRef.current === false) {
      disableRef.current === true;
      const mythologyName = {
        mythologyName: mythologies[activeMyth],
      };
      try {
        const response = await claimShardsBooster(mythologyName, authToken);
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

  const handleClaimAutomata = async () => {
    if (disableRef.current === false) {
      disableRef.current = true;
      const mythologyName = {
        mythologyName: mythologies[activeMyth],
      };
      try {
        const response = await claimAutomataBooster(mythologyName, authToken);

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

  const handleClaimAutoAutomata = async () => {
    if (disableRef.current === false) {
      disableRef.current = true;

      try {
        await claimAutoAutomata(authToken);

        setGameData((prevData) => {
          const now = Date.now();

          const updatedData = {
            ...prevData,
            multiColorOrbs: prevData.multiColorOrbs - 1,
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

  const handleButton = () => {
    tele.HapticFeedback.notificationOccurred("success");
    const handleClaim = {
      automata: isAutoPay ? handleClaimAutoAutomata : handleClaimAutomata,
      minion: handleClaimShards,
      burst: handleClaimBurst,
    }[activeCard];

    return handleClaim();
  };

  return (
    <div className="fixed flex flex-col justify-center items-center inset-0  bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
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
                className={`rounded-b-primary filter-paper-${mythSections[activeMyth]}`}
              />
              <div
                className={`flex justify-center ${
                  isAutoPay ? "gradient-multi" : "text-white  glow-text-black"
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
