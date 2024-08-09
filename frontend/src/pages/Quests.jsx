import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import { categorizeQuestsByMythology } from "../utils/categorizeQuests";
import {
  claimQuest,
  claimQuestOrbsReward,
  claimShareReward,
  completeQuest,
} from "../utils/api";
import QuestButton from "../components/Buttons/QuestButton";
import {
  ChevronsLeft,
  ChevronsRight,
  CornerUpLeft,
  CornerUpRight,
} from "lucide-react";
import Footer from "../components/Footer";
import JigsawImage from "../components/Pieces";
import InfoCard from "../components/QuestCards/InfoCard";
import OrbClaimCard from "../components/QuestCards/OrbClaimCard";
import ToastMesg from "../components/Toast/ToastMesg";
import { toast } from "react-toastify";
import Symbol from "../components/Symbol";
import { formatOrbsWithLeadingZeros } from "../utils/gameManipulations";
import QuestSymbol from "../components/QuestCards/QuestSymbol";

const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];
const mythSections = ["celtic", "egyptian", "greek", "norse"];
const symbols = {
  greek: 4,
  celtic: 2,
  norse: 5,
  egyptian: 1,
};

const Quests = () => {
  const [showClaim, setShowClaim] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [isButtonGlowing, setIsButtonGlowing] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [secretInfo, setSecretInfo] = useState(null);
  const [currQuest, setCurrQuest] = useState(0);
  const {
    questsData,
    setQuestsData,
    gameData,
    setGameData,
    activeMyth,
    setActiveMyth,
  } = useContext(MyContext);
  const mythData = gameData.mythologies;
  const quests = categorizeQuestsByMythology(questsData)
    [activeMyth][mythologies[activeMyth]].filter(
      (item) => item?.secret !== true
    )
    .sort((a, b) => a.isQuestClaimed - b.isQuestClaimed);
  const completedQuests = quests.filter((item) => item.isQuestClaimed === true);

  const quest = quests[currQuest];

  const secretQuests = categorizeQuestsByMythology(questsData)[activeMyth][
    mythologies[activeMyth]
  ].filter((item) => item?.secret === true);

  const handleButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
    }, 100);
  };

  const handleClaimShareReward = async (id) => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: id,
    };
    try {
      await claimShareReward(questData, token);

      toast.success(
        <ToastMesg
          title={"Link Copied Successfully!"}
          desc={"Share it on X to earn an extra $ORB"}
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

      // update quest data
      const updatedQuestData = questsData.map((item) =>
        item._id === id ? { ...item, isShared: true } : item
      );

      // update game data
      const updatedGameData = {
        ...gameData,
        multiColorOrbs: gameData.multiColorOrbs + 1,
      };
      setQuestsData(updatedQuestData);
      setGameData(updatedGameData);
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      toast.error(
        <ToastMesg
          title={"Failed to share quest."}
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

  const handleOrbClaimReward = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: quest._id,
    };
    try {
      await claimQuestOrbsReward(questData, token);
      setShowClaim(false);

      // update quest data
      const updatedQuestData = questsData.map((item) =>
        item._id === quest._id ? { ...item, isOrbClaimed: true } : item
      );

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
      setQuestsData(updatedQuestData);
      setGameData(updatedGameData);

      toast.success(
        <ToastMesg
          title={"Congratulations ypu earned an extra orb!"}
          desc={"Orb credited to your account."}
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
          title={"Failed to claim orbs."}
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

  const handleCompleteQuest = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: quest._id,
    };

    if (!quest.isCompleted) {
      try {
        await completeQuest(questData, token);
        setShowComplete(false);
        setShowPay(true);

        // update quest data
        const updatedQuestData = questsData.map((item) =>
          item._id === quest._id ? { ...item, isCompleted: true } : item
        );

        setQuestsData(updatedQuestData);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "An unexpected error occurred";

        toast.error(
          <ToastMesg
            title={"Failed claim to claim quest."}
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
    } else {
      setShowPay(true);
    }
  };

  const handleClaimQuest = async () => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: quest._id,
    };
    try {
      await claimQuest(questData, token);
      setShowComplete(false);
      setActiveCard(quest?.type);
      setShowClaim(true);
      setShowPay(false);

      // update quest data
      const updatedQuestData = questsData.map((item) =>
        item._id === quest._id ? { ...item, isQuestClaimed: true } : item
      );

      // update game data
      const updatedGameData = {
        ...gameData,
        mythologies: gameData.mythologies.map((myth) => {
          const requiredOrbs = quest.requiredOrbs || {};
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

      setQuestsData(updatedQuestData);
      setGameData(updatedGameData);

      toast.success(
        <ToastMesg
          title={"Quest claimed successfuly!"}
          desc={"Enerbar bla blab bla"}
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
      setShowPay(false);

      toast.error(
        <ToastMesg
          title={"Failed claim to claim quest."}
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

  const handlePrev = () => {
    if (currQuest > 0) {
      setCurrQuest((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currQuest < quests.length) {
      setCurrQuest((prev) => prev + 1);
    }
  };

  const handleActiveParts = (faith) => {
    const activeParts = [];
    for (let i = 0; i < faith; i++) {
      activeParts.push(i);
    }

    return activeParts;
  };

  useEffect(() => {}, [questsData, showClaim, showPay]);

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
            backgroundImage: `url(/assets/uxui/base.background_tiny.jpg)`,
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
            backgroundImage: `url(/assets/uxui/header.paper_tiny.png)`,
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
        <div className="h-full -ml-[14%] mr-auto mt-1">
          <Symbol myth={mythSections[activeMyth]} />
        </div>
        <div className="flex flex-col flex-grow justify-center items-end text-white  pr-5 -mt-1.5">
          <h1 className={`glow-${mythSections[activeMyth]}`}>
            {mythSections[activeMyth].toUpperCase()}
          </h1>
          <div className="text-right font-medium font-montserrat text-[22px] -mt-3">
            {formatOrbsWithLeadingZeros(mythData[activeMyth].faith)}{" "}
            <span className={`text-${mythSections[activeMyth]}-text`}>
              FAITH
            </span>
          </div>
          <div className="text-right font-medium font-montserrat -mt-1 text-[14px]">
            {formatOrbsWithLeadingZeros(completedQuests.length)}/12{" "}
            <span className={`text-${mythSections[activeMyth]}-text`}>
              QUESTS
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-grow justify-center items-center">
        <div className="flex justify-center items-center w-[20%]">
          <div
            onClick={() => {
              handleButtonClick(1);
              setCurrQuest(0);
              setActiveMyth((prev) => (prev - 1 + 4) % 4);
              setShowPay(false);
              setShowInfo(false);
              setShowClaim(false);
            }}
            className={`bg-glass-black p-[6px] ${
              isButtonGlowing === 1
                ? `glow-button-${mythSections[activeMyth]}`
                : ""
            } rounded-full cursor-pointer`}
          >
            <ChevronsLeft color="white" className="h-[30px] w-[30px]" />
          </div>
        </div>
        <div className="flex items-center justify-center w-full">
          {currQuest < quests.length ? (
            <>
              {!showPay ? (
                <div className="relative">
                  <div className="relative">
                    <img
                      src={`/assets/cards/320px-${quest?.type}_tiny.png`}
                      alt="card"
                      className={`w-full h-[75%] ${
                        !quest.isQuestClaimed && "grayscale"
                      }`}
                    />
                    <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
                      <div className="flex w-full">
                        <div className="flex flex-grow">
                          <div className="flex w-full mt-2 ml-[0.7375rem] font-symbols text-white text-[2rem]">
                            {Object.entries(quest.requiredOrbs).map(
                              ([key, value]) => (
                                <div className="flex" key={key}>
                                  {Array.from({ length: value }, (_, index) => (
                                    <div
                                      key={index}
                                      className={`flex relative text-center justify-center items-center w-[45px] -ml-1.5 rounded-full glow-icon-${key.toLowerCase()}`}
                                    >
                                      <img
                                        src="/assets/myths-orbs/orb.base-tiny.png"
                                        alt="orb"
                                        className={`filter-orbs-${key.toLowerCase()} }`}
                                      />
                                      <span
                                        className={`absolute z-1 text-[25px] ${
                                          key.toLowerCase() === "egyptian" &&
                                          "ml-[2px]"
                                        } ${
                                          key.toLowerCase() === "greek" &&
                                          "ml-[5px]"
                                        }`}
                                      >
                                        {symbols[key.toLowerCase()]}
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
                            src="/assets/icons/info.svg"
                            alt="info"
                            className={`w-[55px] h-[55px] ml-auto -mt-6 -mr-6 rounded-full  ${
                              isButtonGlowing === 3
                                ? `glow-button-${mythSections[activeMyth]}`
                                : ""
                            }`}
                            onClick={() => {
                              handleButtonClick(3);
                              setShowInfo((prev) => !prev);
                              setActiveCard(quest?.type);
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={`flex relative items-center h-[19%] uppercase glow-card-${mythSections[activeMyth]} text-white`}
                      >
                        <div
                          style={{
                            backgroundImage: `url(/assets/uxui/footer.paper_tiny.png)`,
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
                          <div>{quest?.questName}</div>
                          <div className="">
                            <QuestSymbol myth={mythSections[activeMyth]} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {quest.isCompleted || showComplete ? (
                    <QuestButton
                      handlePrev={handlePrev}
                      handleNext={handleNext}
                      message={"Complete"}
                      isCompleted={quest?.isQuestClaimed}
                      activeMyth={activeMyth}
                      action={handleCompleteQuest}
                    />
                  ) : (
                    <QuestButton
                      handlePrev={handlePrev}
                      handleNext={handleNext}
                      message={"Claim"}
                      isCompleted={quest?.isQuestClaimed}
                      activeMyth={activeMyth}
                      action={() => {
                        setShowComplete(true);
                        window.open(quest?.link, "_blank");
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <img
                      src={`/assets/cards/320px-${quest?.type}_tiny.png`}
                      alt="card"
                      className={`w-full h-[75%] grayscale blur-sm`}
                    />
                    <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
                      <div className="flex w-full">
                        <div className="flex flex-grow">
                          <div className="flex w-full mt-2 ml-[0.7375rem] font-symbols text-white text-[2rem]">
                            {Object.entries(quest.requiredOrbs).map(
                              ([key, value]) => (
                                <div className="flex" key={key}>
                                  {Array.from({ length: value }, (_, index) => (
                                    <div
                                      key={index}
                                      className={`flex relative text-center justify-center items-center w-[45px] -ml-1.5 rounded-full glow-icon-${key.toLowerCase()}`}
                                    >
                                      <img
                                        src="/assets/myths-orbs/orb.base-tiny.png"
                                        alt="orb"
                                        className={`filter-orbs-${key.toLowerCase()} }`}
                                      />
                                      <span
                                        className={`absolute z-1 text-[25px] ${
                                          key.toLowerCase() === "egyptian" &&
                                          "ml-[2px]"
                                        } ${
                                          key.toLowerCase() === "greek" &&
                                          "ml-[5px]"
                                        }`}
                                      >
                                        {symbols[key.toLowerCase()]}
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
                            className={`w-[55px] h-[55px] ml-auto -mt-6 -mr-6 ${
                              isButtonGlowing === 3
                                ? `glow-button-${mythSections[activeMyth]}`
                                : ""
                            }`}
                            onClick={() => {
                              handleButtonClick(3);
                              setShowPay(false);
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={`flex justify-start items-center px-3 h-[18%] uppercase glow-card-${mythSections[activeMyth]} text-white`}
                      >
                        {quest?.questName}
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={handleClaimQuest}
                    className={`flex items-center justify-between h-[54px] w-[192px] mx-auto -mt-2 bg-glass-black z-50 text-white font-montserrat rounded-button`}
                  >
                    <div className="flex justify-center items-center w-1/4 h-full"></div>
                    <div className="text-[16px] uppercase">Pay</div>
                    <div className="flex justify-center items-center w-1/4  h-full"></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="relative">
              <div className="h-full relative -mt-12">
                <JigsawImage
                  imageUrl={`/assets/cards/320px-${secretQuests[0].type}_tiny.png`}
                  activeParts={handleActiveParts(
                    gameData.mythologies[activeMyth].faith
                  )}
                />
                <div className="flex absolute w-full top-0 z-10 justify-end">
                  <img
                    src="/assets/icons/info.svg"
                    alt="info"
                    className={`w-[55px] h-[55px] ml-auto -mt-6 -mr-6 rounded-full  ${
                      isButtonGlowing === 5
                        ? `glow-button-${mythSections[activeMyth]}`
                        : ""
                    }`}
                    onClick={() => {
                      handleButtonClick(5);
                      setSecretInfo((prev) => !prev);
                      setActiveCard(secretQuests[0].type);
                    }}
                  />
                </div>
              </div>
              <div className="absolute flex justify-center items-center w-full -mt-2">
                <div className="bg-black  h-[60px] w-[60px] rounded-full z-1"></div>
              </div>
              <div
                className="flex items-center justify-between h-[45px] w-[192px] mx-auto mt-[23px] border border-black bg-glass-black text-white font-montserrat rounded-button  absolute top-0 left-0 right-0"
                style={{ top: "100%", transform: "translateY(-50%)" }}
              >
                <div className="flex justify-center items-center w-1/4 border-r-[0.5px] border-borderGray h-full">
                  <CornerUpLeft
                    color="white"
                    className="h-[20px] w-[20px]"
                    onClick={handlePrev}
                  />
                </div>
                <div className="text-[16px] uppercase px-2">Complete</div>
                <div className="flex justify-center items-center w-1/4 border-l-[0.5px] border-borderGray h-full">
                  <CornerUpRight
                    color="white"
                    className="h-[20px] w-[20px]"
                    onClick={handleNext}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center w-[20%]">
          <div
            onClick={() => {
              setCurrQuest(0);
              handleButtonClick(2);
              setActiveMyth((prev) => (prev + 1) % 4);
              setShowPay(false);
              setShowInfo(false);
              setShowClaim(false);
            }}
            className={`bg-glass-black p-[6px] rounded-full ${
              isButtonGlowing === 2
                ? `glow-button-${mythSections[activeMyth]}`
                : ""
            } cursor-pointer`}
          >
            <ChevronsRight color="white" className="h-[30px] w-[30px]" />
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
      {secretInfo && (
        <InfoCard
          activeCard={activeCard}
          isShared={secretQuests[0]?.isShared}
          quest={secretQuests[0]}
          handleClaimShareReward={() =>
            handleClaimShareReward(secretQuests[0]._id)
          }
          handleShowInfo={() => {
            setSecretInfo((prev) => !prev);
          }}
          activeMyth={activeMyth}
          isButtonGlowing={isButtonGlowing}
        />
      )}
      {showInfo && (
        <InfoCard
          activeCard={activeCard}
          isShared={quest?.isShared}
          quest={quest}
          handleClaimShareReward={() => handleClaimShareReward(quest._id)}
          handleShowInfo={() => {
            setShowInfo((prev) => !prev);
          }}
          activeMyth={activeMyth}
          isButtonGlowing={isButtonGlowing}
        />
      )}
      {showClaim && (
        <OrbClaimCard
          activeCard={activeCard}
          handleOrbClaimReward={handleOrbClaimReward}
          handleShowClaim={() => {
            setShowClaim((prev) => !prev);
          }}
          activeMyth={activeMyth}
        />
      )}
    </div>
  );
};

export default Quests;
