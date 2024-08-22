import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import Footer from "../components/Footer";
import {
  claimAutomataBooster,
  claimLostQuest,
  claimQuestOrbsReward,
  claimShardsBooster,
  fetchLostQuests,
} from "../utils/api";

import ToastMesg from "../components/Toast/ToastMesg";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ToggleLeft, ToggleRight } from "../components/Common/SectionToggles";
import { mythologies, mythSections, elements } from "../utils/variables";
import BoosterCard from "../components/Cards/Boosters/BoosterCard";
import BoosterButtom from "../components/Buttons/BoosterButtom";
import MilestoneCard from "../components/MilestoneCard";
import AutomataCard from "../components/Cards/Boosters/AutomataCard";
import Symbol from "../components/Common/Symbol";

// const HeaderContent = ({ activeMyth, gameData, t, multiColorOrbs }) => {
//   return (
//     <div className="flex flex-col flex-grow justify-center items-center text-white pb-[20px]">
//       <h1 className={`glow-text-${mythSections[activeMyth]} uppercase`}>
//         {t(`sections.boosters`)}
//       </h1>
//       <div className="text-right -mt-[12px] font-medium text-primary">
//         {multiColorOrbs}{" "}
//         <span className="gradient-multi">{t(`keywords.orbs`)}</span>
//       </div>
//     </div>
//   );
// };

const HeaderContent = ({ activeMyth, gameData, t }) => {
  return (
    <>
      <div className="h-full -ml-[14%] mr-auto mt-1">
        <Symbol myth={mythSections[activeMyth]} isCard={false} />
      </div>
      <div className="flex flex-col flex-grow justify-start items-end text-white pr-5">
        <div className="text-right  gap-1 flex font-medium text-primary">
          {/* <span>{mythData[activeMyth].faith}</span> */}
          <span className={`text-${mythSections[activeMyth]}-text  uppercase`}>
            {/* <span className="text-white">
              {gameData.mythologies[activeMyth].faith}{" "}
            </span> */}
            <span>Faith</span>
          </span>
        </div>
        <h1
          className={`glow-text-${mythSections[activeMyth]} uppercase -mt-4 -mr-2`}
        >
          {t(`sections.boosters`)}
        </h1>
      </div>
    </>
  );
};

const Boosters = () => {
  const { t } = useTranslation();
  const [showCard, setShowCard] = useState(false);
  const [lostQuest, setLostQuest] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [quest, setQuest] = useState(0);
  const [showQuest, setShowQuest] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const { gameData, setGameData, activeMyth, setActiveMyth } =
    useContext(MyContext);
  const multiColorOrbs = gameData.multiColorOrbs;
  const mythData = gameData.mythologies[activeMyth].boosters;

  const handleCloseQuestButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
      setShowQuest(false);
    }, 100);
  };

  // Quests Functions
  const handleOrbClaimReward = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: lostQuest[quest]._id,
    };
    try {
      await claimQuestOrbsReward(questData, token);

      setShowClaim(false);

      lostQuest[quest].isOrbClaimed = true;

      // update game data
      const updatedGameData = {
        ...gameData,
        mythologies: gameData.mythologies.map((myth) =>
          myth.name === mythologies[activeMyth]
            ? {
                ...myth,
                orbs: myth.orbs + 1,
              }
            : myth
        ),
      };
      setGameData(updatedGameData);

      toast.success(
        <ToastMesg
          title={t("toasts.Quest_orb_claim.success.title")}
          desc={t("toasts.Quest_orb_claim.success.desc")}
          img={"/assets/icons/toast.success.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      toast.error(
        <ToastMesg
          title={t("toasts.Quest_orb_claim.error.title")}
          desc={t("toasts.Quest_orb_claim.error.desc")}
          img={"/assets/icons/toast.fail.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  const handleClaimQuest = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: lostQuest._id,
    };
    try {
      await claimLostQuest(questData, token);
      setShowQuest(false);
      setActiveCard(lostQuest[quest]?.type);
      setShowClaim(true);

      // update game data
      const updatedGameData = {
        ...gameData,
        mythologies: gameData.mythologies.map((myth) => {
          const requiredOrbs = lostQuest[quest].requiredOrbs || {};
          const orbsToDeduct = requiredOrbs[myth.name] || 0;

          if (myth.name === mythologies[activeMyth]) {
            return {
              ...myth,
              faith: myth.faith + 1,
              energyLimit: myth.energyLimit + 1000,
              orbs: myth.orbs - orbsToDeduct,
            };
          }

          return {
            ...myth,
            orbs: myth.orbs - orbsToDeduct,
          };
        }),
      };

      setGameData(updatedGameData);

      toast.success(
        <ToastMesg
          title={t("toasts.Quest_claim.success.title")}
          desc={t("toasts.Quest_claim.success.desc")}
          img={"/assets/icons/toast.success.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";

      toast.error(
        <ToastMesg
          title={t("toasts.Quest_claim_InsufficientOrbs.error.title")}
          desc={t("toasts.Quest_claim_InsufficientOrbs.error.desc")}
          img={"/assets/icons/toast.fail.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  // Boosters functions
  const handleLostQuest = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetchLostQuests(
        mythologies[activeMyth],
        accessToken
      );
      if (response.lostQuests.length !== 0) {
        setShowQuest(true);
        setLostQuest(response.lostQuests[0]);
      } else {
        toast.success(
          <ToastMesg
            title={t("toasts.Booster_Lost_Not_Available.error.title")}
            desc={t("toasts.Booster_Lost_Not_Available.error.desc")}
            img={"/assets/icons/toast.fail.svg"}
          />,
          {
            icon: false,
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";

      toast.error(
        <ToastMesg
          title={"There was a problem in loading quests."}
          desc={errorMessage}
          img={"/assets/icons/toast.fail.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  const handleClaimBooster = (e) => {
    e.preventDefault();

    if (activeCard === "shard") {
      handleClaimShards();
    } else if (activeCard === "automata") {
      handleClaimAutomata();
    }
  };

  const handleClaimShards = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      const response = await claimShardsBooster(mythologyName, accessToken);
      setGameData((prevData) => {
        const updatedData = {
          ...prevData,
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

      setShowCard(false);
      console.log("claimed succesfully");
      toast.success(
        <ToastMesg
          title={t("toasts.Booster_ShardsClaim.success.title")}
          desc={t("toasts.Booster_ShardsClaim.success.desc")}
          img={"/assets/icons/toast.success.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";

      toast.error(
        <ToastMesg
          title={t("toasts.Booster_InsufficientOrbs.error.title")}
          desc={t("toasts.Booster_InsufficientOrbs.error.desc")}
          img={"/assets/icons/toast.fail.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  const handleClaimAutomata = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const mythologyName = {
      mythologyName: mythologies[activeMyth],
    };
    try {
      const response = await claimAutomataBooster(mythologyName, accessToken);
      setGameData((prevData) => {
        const updatedData = {
          ...prevData,
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
      setShowCard(false);

      toast.success(
        <ToastMesg
          title={t("toasts.Booster_AutomataClaim.success.title")}
          desc={t("toasts.Booster_AutomataClaim.success.desc")}
          img={"/assets/icons/toast.success.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";

      toast.error(
        <ToastMesg
          title={t("toasts.Booster_InsufficientOrbs.error.title")}
          desc={t("toasts.Booster_InsufficientOrbs.error.desc")}
          img={"/assets/icons/toast.fail.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  useEffect(() => {}, [gameData, showInfo, showClaim, showPay]);

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
          className={`absolute top-0 left-0 h-full w-full filter-${mythSections[activeMyth]}`}
          style={{
            backgroundImage: `url(/assets/uxui/fof.base.background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <div
        style={{
          position: "relative",
          height: "18.5%",
          width: "100%",
        }}
        className="flex"
      >
        <div
          style={{
            backgroundImage: `url(/assets/uxui/fof.header.paper.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: -1,
          }}
          className={`filter-paper-${mythSections[activeMyth]} -mt-1`}
        />
        <HeaderContent
          activeMyth={activeMyth}
          gameData={gameData}
          t={t}
          multiColorOrbs={multiColorOrbs}
        />
      </div>
      {/* Content */}
      <div className="flex flex-grow justify-center items-center">
        <ToggleLeft
          handleClick={() => {
            setActiveMyth((prev) => (prev - 1 + 4) % 4);
          }}
          activeMyth={activeMyth}
        />
        {/* BOOSTER CARDS */}
        <div className="flex flex-col items-center justify-center w-full gap-[15px]">
          {/* AUTOMATA BOOSTER */}
          <BoosterCard
            isActive={!mythData.isAutomataActive}
            handleClick={() => {
              setShowCard(true);
              setActiveCard("automata");
            }}
            activeMyth={activeMyth}
            t={t}
            booster={0}
          />
          {/*  LOST QUESTS  */}
          <BoosterCard
            isActive={false}
            handleClick={handleLostQuest}
            activeMyth={activeMyth}
            t={t}
            booster={1}
          />
          {/* SHARDS BOOSTER */}
          <BoosterCard
            isActive={mythData.isShardsClaimActive}
            handleClick={() => {
              setShowCard(true);
              setActiveCard("shard");
            }}
            activeMyth={activeMyth}
            t={t}
            booster={2}
          />
        </div>
        <ToggleRight
          handleClick={() => {
            setActiveMyth((prev) => (prev + 1) % 4);
          }}
          activeMyth={activeMyth}
        />
      </div>
      {/* Footer */}
      <Footer />
      {/* Booster card */}
      {activeCard === "automata" && (
        <AutomataCard
          activeCard={activeCard}
          activeMyth={activeMyth}
          closeCard={() => setActiveCard(null)}
          Button={
            <BoosterButtom
              activeCard={activeCard}
              mythData={mythData}
              handleClaim={handleClaimBooster}
              activeMyth={activeMyth}
              t={t}
            />
          }
        />
      )}
      {activeCard === "shard" && (
        <MilestoneCard
          isOrb={false}
          isBlack={false}
          activeMyth={activeMyth}
          closeCard={() => {
            setActiveCard(null);
          }}
          booster={5}
          Button={
            <BoosterButtom
              activeCard={activeCard}
              mythData={mythData}
              handleClaim={handleClaimBooster}
              activeMyth={activeMyth}
              t={t}
            />
          }
        />
      )}
    </div>
  );
};

export default Boosters;

{
  /* <div className="text-right font-medium  -mt-1 text-secondary">
        {formatOrbsWithLeadingZeros(gameData.mythologies[activeMyth].orbs)}{" "}
        <span className={`text-${mythSections[activeMyth]}-text`}>
          {t(`keywords.orbs`)}
        </span>
      </div> */
}

{
  /* lost quests card */
}
{
  /* {showQuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div>
            <div className="relative">
              <img
                src={`/assets/cards/320px-${lostQuest.type}.png`}
                alt="card"
                className={`w-full h-[75%] grayscale blur-sm`}
              />
              <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
                <div className="flex w-full">
                  <div className="flex flex-grow">
                    <div className="flex w-full mt-2 ml-[0.7375rem] font-symbols text-white text-[2rem]">
                      {Object.entries(lostQuest.requiredOrbs).map(
                        ([key, value]) => (
                          <div className="flex" key={key}>
                            {Array.from({ length: value }, (_, index) => (
                              <div
                                key={index}
                                className={`flex relative text-center justify-center items-center w-[45px] -ml-1.5 rounded-full glow-icon-${key.toLowerCase()}`}
                              >
                                <img
                                  src="/assets/uxui/240px-orb.base.png"
                                  alt="orb"
                                  className={`filter-orbs-${key.toLowerCase()} }`}
                                />
                                <span
                                  className={`absolute z-1 text-[25px] ${
                                    key.toLowerCase() === "egyptian" &&
                                    "ml-[2px]"
                                  } ${
                                    key.toLowerCase() === "greek" && "ml-[5px]"
                                  }`}
                                >
                                  {mythSymbols[key.toLowerCase()]}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex absolute w-full justify-end">
                    <img
                      src="/assets/icons/close.svg"
                      alt="info"
                      className={`w-[55px] h-[55px] ml-auto -mt-6 rounded-full -mr-6 ${
                        isButtonGlowing === 3
                          ? `glow-button-${mythSections[activeMyth]}`
                          : ""
                      }`}
                      onClick={() => {
                        handleButtonClick(3);
                        setShowQuest(false);
                      }}
                    />
                  </div>
                </div>
                <div
                  className={`flex relative items-center h-[19%] uppercase glow-card-${mythSections[activeMyth]} text-white`}
                >
                  <div
                    style={{
                      backgroundImage: `url(/assets/uxui/footer.paper.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "100%",
                    }}
                    className={`filter-paper-${mythSections[activeMyth]} rounded-b-[15px]`}
                  />
                  <div className="flex justify-between w-full h-full items-center px-3 z-10">
                    <div>{lostQuest?.questName}</div>
                    <div className="">
                      <Symbol myth={mythSections[activeMyth]} isCard={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={handleClaimQuest}
              className={`flex items-center justify-between h-[45px] w-[192px] mx-auto bg-glass-black border border-${mythSections[activeMyth]}-primary z-50 text-white  rounded-primary`}
            >
              <div className="flex justify-center items-center w-1/4 h-full"></div>
              <div className="text-[16px] uppercase">Buy</div>
              <div className="flex justify-center items-center w-1/4  h-full"></div>
            </div>
          </div>
        </div> */
}

{
  /* // <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
        //   <div className="w-[72%] rounded-lg shadow-lg mt-10">
        //     <div className="relative">
        //       <img
        //         src={`/cards/${lostQuest[quest]?.type}_off.png`}
        //         alt="card"
        //         className="w-full h-[75%]"
        //       />
        //       <div className="absolute top-0 right-0 h-10 w-10 cursor-pointer">
        //         <img
        //           src="/assets/icons/close.svg"
        //           alt="close"
        //           className={`w-[38px] h-[38px] mt-1 ${
        //             isButtonGlowing === 5
        //               ? `glow-button-${mythSections[activeMyth]}`
        //               : ""
        //           }`}
        //           onClick={() => {
        //             handleCloseQuestButtonClick(5);
        //           }}
        //         />
        //       </div>
        //     </div>

        //     <div
        //       onClick={handleClaimQuest}
        //       className={`flex items-center justify-between h-[45px] w-[192px] mx-auto bg-glass-black z-50 text-white  rounded-primary`}
        //     >
        //       <div className="flex justify-center items-center w-1/4 h-full">
        //         <img
        //           src={`/images/multi-pay.png`}
        //           alt="orb"
        //           className="w-[32px] h-[32px]"
        //         />
        //       </div>
        //       <div className="text-[16px] uppercase">Buy</div>
        //       <div className="flex justify-center items-center w-1/4  h-full"></div>
        //     </div>
        //   </div>
        // </div>
      )} */
}
{
  /* 
      // {showClaim && (
      //   <OrbClaimCard
      //     activeCard={activeCard}
      //     handleOrbClaimReward={handleOrbClaimReward}
      //     handleShowClaim={() => {
      //       setShowClaim((prev) => !prev);
      //     }}
      //     activeMyth={activeMyth}
      //   />
      // )} */
}
// onClick={() => {
//   handleCloseQuestButtonClick(5);
// }}

{
  /* <div
            className={`flex gap-1 border 
            ${
              !mythData.isAutomataActive
                ? `border-${mythSections[activeMyth]}-primary text-white`
                : "border-cardsGray text-cardsGray"
            } ${
              isGlowing === 3 ? `glow-button-${mythSections[activeMyth]}` : ""
            } rounded-primary h-[90px] w-full bg-glass-black p-[15px] `}
            onMouseDown={() => handleClick(3)}
            onMouseUp={handleRemoveClick}
            onMouseLeave={handleRemoveClick}
            onTouchStart={() => handleClick(3)}
            onTouchEnd={handleRemoveClick}
            onTouchCancel={handleRemoveClick}
          >
            <div>
              <h1 className={`font-symbols text-[80px] p-0 -mt-7 -ml-2 `}>b</h1>{" "}
            </div>
            <div className={`flex flex-col flex-grow justify-center -ml-1 `}>
              <h1 className="text-[18px] uppercase">{t(`boosters.0.title`)}</h1>
              <h2 className="text-[14px]">{t(`boosters.0.desc`)}</h2>
            </div>
            <div className="flex justify-center items-center w-[8%] ">
              {!mythData.isAutomataActive ? (
                <ChevronRight
                  onClick={() => {
                    setShowCard(true);
                    setActiveCard("automata");
                  }}
                  className="h-[50px]"
                />
              ) : (
                <img src="/assets/icons/lock.svg" alt="lock" />
              )}
            </div>
          </div> */
}
