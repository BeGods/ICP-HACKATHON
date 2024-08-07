import React, { useContext, useEffect, useState } from "react";
import { convertOrbs } from "../utils/api";
import { MyContext } from "../context/context";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Footer from "../components/Footer";
import ConvertButton from "../components/Buttons/ConvertButton";
import { formatOrbsWithLeadingZeros } from "../utils/gameManipulations";
import ProgressBar from "../components/ProgressBar";
import ConvertInfo from "../components/ConvertInfo";

const mythSections = ["celtic", "egyptian", "greek", "norse", "other"];
const mythologies = ["Celtic", "Egyptian", "Greek", "Norse", "Other"];

const tele = window.Telegram?.WebApp;

const Convert = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [isButtonGlowing, setIsButtonGlowing] = useState(0);
  const { setActiveMyth, setGameData, gameData } = useContext(MyContext);
  const [myth, setMyth] = useState(4);
  const mythData = gameData.mythologies;

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
            title={"Orbs Successfully Converted!"}
            desc={"Well done! Keep the momentum going!"}
            img={"/icons/success.svg"}
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
            title={"Failed to convert orbs."}
            desc={errorMessage}
            img={"/icons/fail.svg"}
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
      >
        <div
          className={`absolute top-0 left-0 h-full w-full filter-other`}
          style={{
            backgroundImage: `url(/themes/background/main.png)`,
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
            backgroundImage: `url(/themes/header.png)`,
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
          <div className="flex  flex-col flex-grow justify-center items-start text-white pl-5 -mt-1.5">
            <h1 className="flex items-center gap-4 text-[10.24vw] font-fof text-fof drop-shadow-2xl -mt-0.5">
              FORGES <span className="text-[20px]">OF</span> FAITH
            </h1>
            <div className="flex  w-full justify-between items-center -mt-2.5">
              <div className="text-left">
                <div className="text-right font-medium font-montserrat text-[22px]">
                  {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
                  <span className="text-black glow-black">$ORB(S)</span>
                </div>
                <div className="font-medium font-montserrat text-[14px] -mt-1">
                  {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
                  <span className="gradient-multi">$ORB(S)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-grow justify-center items-start text-white pl-5 -mt-1.5">
            <h1 className="flex items-center gap-4 text-[10.24vw] font-fof text-fof drop-shadow-2xl -mt-0.5">
              FORGES <span className="text-[20px]">OF</span> FAITH
            </h1>
            <div className="flex  w-full justify-between items-center -mt-2.5">
              <div className="text-left">
                <div className="text-right font-medium font-montserrat text-[22px]">
                  {formatOrbsWithLeadingZeros(mythData[myth].orbs)}{" "}
                  <span className={`text-${mythSections[myth]}-text`}>
                    $ORB(S)
                  </span>
                </div>
                <div className="font-medium font-montserrat text-[14px] -mt-1">
                  {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
                  <span className="gradient-multi">$ORB(S)</span>
                </div>
              </div>
            </div>
          </div>
          // <div className="flex flex-col flex-grow justify-center items-start text-white pl-5 -mt-1.5">
          //   <h1 className="flex items-center gap-4 text-[10.24vw] font-fof text-fof drop-shadow-2xl">
          //     FORGES <span className="text-[20px]">OF</span> FAITH
          //   </h1>
          //   <div className="flex w-full justify-between items-center -mt-3">
          //     <div className="text-left">
          //       <div className="text-right font-medium font-montserrat text-[22px]">
          //         {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
          //         <span className={`text-${mythSections[myth]}-text`}>
          //           $ORB(S)
          //         </span>
          //       </div>
          //       <div className="font-medium font-montserrat text-[14px] -mt-1">
          //         {formatOrbsWithLeadingZeros(gameData.multiColorOrbs)}{" "}
          //         <span className="gradient-multi">$ORB(S)</span>
          //       </div>
          //     </div>
          //     <div
          //       onClick={() => {
          //         setShowInfo(true);
          //       }}
          //     >
          //       <img
          //         src="/icons/info.svg"
          //         alt="info"
          //         className="w-8 h-8 mr-4"
          //       />
          //     </div>
          //   </div>
          // </div>
        )}
      </div>

      <div className="flex relative flex-grow justify-center items-center">
        <div
          className="absolute flex w-full pr-5 justify-end top-0"
          onClick={() => {
            setShowInfo(true);
          }}
        >
          <img
            src="/icons/info_card.svg"
            alt="info"
            className="w-[55px] h-[55px] mr-[15px] mt-7"
          />
        </div>
        <div className="flex justify-center items-center w-[20%]">
          <div
            className={`bg-glass-black p-[6px] ${
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
            src="/themes/elements/wheel.png"
            alt="wheel"
            className="w-full h-full"
          />
          <ConvertButton
            handleNext={handleNext}
            handlePrev={handlePrev}
            myth={myth}
            action={handleOrbsConversion}
          />
        </div>
        <div className="flex justify-center items-center w-[20%]">
          <div
            className={`bg-glass-black p-[6px] ${
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
            <ConvertInfo />
            <div className="absolute top-0 right-0 w-[55px] h-[55px]  cursor-pointer">
              <img
                src="/icons/close.svg"
                alt="info"
                className="w-full h-full ml-auto -mt-6 -mr-6"
                onClick={() => {
                  setShowInfo((prev) => !prev);
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
