import { useContext } from "react";
import { RorContext } from "../../../context/context";
import IconBtn from "../../Buttons/IconBtn";
import { useTranslation } from "react-i18next";
import ReactHowler from "react-howler";
import { CardWrap } from "../../Layouts/Wrapper";
import OverlayLayout from "../../Layouts/OverlayLayout";
import CustomBtn from "../../Buttons/CustomButton";

const MiscCard = ({ id, handleClick, handleButtonClick, message, isPay }) => {
  const { assets, enableSound } = useContext(RorContext);
  const { i18n } = useTranslation();
  const charMap = {
    apothecary: {
      icon: "v",
      src: assets.boosters.gemologistCard,
      label: "apothecary",
      sound: "apothecary",
    },
    banker: {
      icon: "A",
      src: assets.boosters.bankerCard,
      label: "banker",
      sound: null,
    },
    blacksmith: {
      icon: "h",
      src: assets.boosters.minionCard,
      label: "blacksmith",
      sound: "furnace",
    },
    tavernist: {
      icon: "7",
      src: assets.boosters.tavernCard,
      label: "tavernist",
      sound: "tavernist",
    },
    librarian: {
      icon: "+",
      src: assets.boosters.libCard,
      label: "librarian",
      sound: "librarian",
    },
  };
  const selectedChar = charMap[id];

  return (
    <OverlayLayout>
      <div className="pointer-events-auto center-section">
        <CardWrap
          Front={
            <div className="w-full h-full relative flex justify-center items-center">
              <div
                className={`absolute inset-0 rounded-primary`}
                style={{
                  backgroundImage: `url(${selectedChar.src})`,

                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center center ",
                }}
              />
              <div
                className={`absolute top-0 left-3 text-[2.75rem] font-symbols z-10`}
              >
                {selectedChar.icon}
              </div>
              <div className="relative h-full w-full flex flex-col items-center">
                <div className="flex z-50 relative flex-col justify-center items-center h-full w-full">
                  <IconBtn isInfo={true} align={0} />
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
                      className={`rounded-b-primary`}
                    />
                    <div className="flex justify-center w-full h-full items-center px-2 z-10">
                      <div className="flex gap-x-2 uppercase glow-text-quest text-white z-10">
                        {selectedChar.label}
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
                      {selectedChar.label}
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
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged
              </div>
              <IconBtn isFlip={true} isInfo={false} activeMyth={5} align={10} />
            </div>
          }
          handleClick={handleClick}
        />
      </div>
      {typeof handleButtonClick == "function" && (
        <div className="absolute flex flex-col justify-center bottom-0 mb-safeBottom">
          <CustomBtn
            buttonColor={"black"}
            handleClick={handleButtonClick}
            message={message}
            isPay={isPay}
          />
        </div>
      )}

      {selectedChar.sound && (
        <ReactHowler
          src={assets.audio[selectedChar.sound]}
          playing={enableSound}
          loop
          preload={true}
          html5={true}
        />
      )}
    </OverlayLayout>
  );
};

export default MiscCard;
