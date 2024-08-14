import React, { useContext, useEffect, useState } from "react";
import { convertOrbs } from "../utils/api";
import { MyContext } from "../context/context";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Footer from "../components/Footer";
import ConvertButton from "../components/Buttons/ConvertButton";
import { formatOrbsWithLeadingZeros } from "../utils/gameManipulations";
import ConvertInfo from "../components/ConvertInfo";
import { toast } from "react-toastify";
import ToastMesg from "../components/Toast/ToastMesg";
import { useTranslation } from "react-i18next";

const mythSections = ["celtic", "egyptian", "greek", "norse", "other"];
const mythologies = ["Celtic", "Egyptian", "Greek", "Norse", "Other"];

const Convert = () => {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [isButtonGlowing, setIsButtonGlowing] = useState(0);
  const { setActiveMyth, setGameData, gameData } = useContext(MyContext);
  const [myth, setMyth] = useState(4);
  const mythData = gameData.mythologies;

  const handleCloseButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      setIsButtonGlowing(0);
      setShowInfo((prev) => !prev);
    }, 100);
  };

  const handleButtonClick = (num) => {
    setIsButtonGlowing(num);

    setTimeout(() => {
      if (num === 1) {
        setActiveMyth((prev) => (prev - 1 + 5) % 5);
      } else if (num === 2) {
        setActiveMyth((prev) => (prev + 1) % 5);
        setMyth(4);
      }

      setIsButtonGlowing(0);
    }, 100); // Adjust the delay as needed
  };

  // convert orbs to multicolor
  const handleOrbsConversion = async () => {
    if (myth < 4) {
      const token = localStorage.getItem("accessToken");
      const mythologyName = {
        mythologyName: mythData[myth].name,
      };
      try {
        await convertOrbs(mythologyName, token);

        const updatedGameData = {
          ...gameData,
          mythologies: gameData.mythologies.map((myth) => {
            if (myth.name === mythologies[myth]) {
              return {
                ...myth,

                orbs: myth.orbs - 2,
              };
            }

            return {
              ...myth,
              orbs: myth.orbs - 2,
            };
          }),
        };
        setGameData(updatedGameData);

        toast.success(
          <ToastMesg
            title={t("toasts.Convert.success.title")}
            desc={t("toasts.Convert.success.desc")}
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
            title={t("toasts.Convert.error.title")}
            desc={t("toasts.Convert.error.desc")}
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
    }
  };

  const handlePrev = () => {
    setMyth((prev) => (prev - 1 + 5) % 5);
  };

  const handleNext = () => {
    setMyth((prev) => (prev + 1) % 5);
  };

  useEffect(() => {}, [gameData]);

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
        ƒ
      >
        <div
          className={`absolute top-0 left-0 h-full w-full filter-other`}
          style={{
            backgroundImage: `url(/assets/uxui/fof.base.background_tiny.jpg)`,
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
            backgroundImage: `url(/assets/uxui/fof.header.paper_tiny.png)`,
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
          className={`filter-paper-other relative -mt-1`}
        />
        {myth === 4 ? (
          <div className="flex  flex-col flex-grow justify-center items-center text-white  -mt-1.5">
            {/* <h1 className="flex items-center gap-4 text-[43px] glow-white font-fof text-fof drop-shadow-2xl -mt-0.5"></h1> */}
            {/* FORGES <span className="text-[20px]">OF</span> FAITH */}
            {/* {t("main.fof")} */}
            <div className="mt-2">
              <img
                src="/assets/uxui/forgesoffaith1.svg"
                alt="fof"
                className="w-full fof-glow"
              />
            </div>
            <div className="flex  w-full justify-center items-center mt-2">
              <div className="text-center">
                <div className="text-right font-medium  text-[22px]">
                  {formatOrbsWithLeadingZeros(gameData.blackOrbs)}{" "}
                  <span className="text-black fof-glow">
                    {t(`keywords.orbs`)}
                  </span>
                </div>
                <div className="font-medium  text-[14px] -mt-1">
                  {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
                  <span className="gradient-multi">{t(`keywords.orbs`)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-grow justify-center items-center text-white  -mt-1.5">
            {/* <h1 className="flex items-center gap-4 text-[43px] glow-white font-fof text-fof drop-shadow-2xl -mt-0.5">
            </h1> */}
            {/* FORGES <span className="text-[20px]">OF</span> FAITH  */}
            {/* {t("main.fof")} */}
            <div className="mt-2">
              <img
                src="/assets/uxui/forgesoffaith1.svg"
                alt="fof"
                className="w-full fof-glow"
              />
            </div>
            <div className="flex  w-full justify-center items-center mt-2">
              <div className="text-center">
                <div className="text-right font-medium  text-[22px]">
                  {formatOrbsWithLeadingZeros(mythData[myth].orbs)}{" "}
                  <span className={`text-${mythSections[myth]}-text`}>
                    {t(`keywords.orbs`)}
                  </span>
                </div>
                <div className="font-medium  text-[14px] -mt-1">
                  {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
                  <span className="gradient-multi">{t(`keywords.orbs`)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex relative flex-grow justify-center items-center">
        <div
          className="absolute flex w-full pr-5 justify-end top-0"
          onClick={() => {
            handleButtonClick(3);
            setShowInfo(true);
          }}
        >
          <img
            src="/assets/icons/info.svg"
            alt="info"
            className={`w-[55px] h-[55px] rounded-full mr-[15px] mt-7 ${
              isButtonGlowing === 3 ? `glow-button-other` : ""
            }`}
          />
        </div>
        <div className="flex justify-center items-center w-[20%]">
          <div
            className={`bg-glass-black p-[6px] z-50 ${
              isButtonGlowing === 1 ? `glow-button-other` : ""
            } rounded-full cursor-pointer`}
          >
            <ChevronsLeft
              onClick={() => {
                handleButtonClick(1);
              }}
              color="white"
              className="h-[30px] w-[30px]"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <img
            src="/assets/uxui/480px-forges.of.faith.tower.png"
            alt="wheel"
            className="w-[90%] absolute"
          />
          <div className="absolute h-full  flex justify-center items-end bottom-[5%]">
            <ConvertButton
              t={t}
              handleNext={handleNext}
              handlePrev={handlePrev}
              myth={myth}
              action={handleOrbsConversion}
            />
          </div>
        </div>
        <div className="flex justify-center items-center w-[20%]">
          <div
            className={`bg-glass-black p-[6px] z-50 ${
              isButtonGlowing === 2 ? `glow-button-other` : ""
            } rounded-full cursor-pointer`}
          >
            <ChevronsRight
              onClick={() => {
                handleButtonClick(2);
              }}
              color="white"
              className="h-[30px] w-[30px]"
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="relative w-[72%] rounded-lg shadow-lg mt-10">
            <ConvertInfo t={t} />
            <div className="absolute top-0 right-0 w-[55px] h-[55px]  cursor-pointer">
              <img
                src="/assets/icons/close.svg"
                alt="info"
                className={`w-full h-full ml-auto -mt-6 -mr-6 rounded-full ${
                  isButtonGlowing === 4 ? `glow-button-other` : ""
                }`}
                onClick={() => {
                  handleCloseButtonClick(4);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Convert;
