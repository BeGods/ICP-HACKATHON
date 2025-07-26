import { useState, useContext } from "react";
import { MainContext } from "../../../context/context";
import SettingModal from "../../../components/Modals/Settings";
import LoginModal from "../../../components/Modals/Login";

const OnboardPage = () => {
  const { assets } = useContext(MainContext);
  const [showSetting, setShowSetting] = useState(false);

  return (
    <div className="flex w-screen h-full text-wrap">
      <div
        className="slider-container flex transition-transform duration-500"
        style={{
          width: "400vw",
          transform: `translateX(-150vw)`,
        }}
      >
        <div className={`w-[200vw] h-full relative`}>
          <div
            className="absolute inset-0 w-full h-full z-0 select-none"
            style={{
              background: `url(${assets.locations.fof}) no-repeat center / cover`,
            }}
            draggable={false}
          ></div>
        </div>
        <div className={`w-[200vw] h-full relative`}>
          <div
            className="absolute inset-0 w-full h-full z-0 select-none"
            style={{
              background: `url(${assets.locations.ror}) no-repeat center / cover`,
            }}
            draggable={false}
          ></div>
        </div>
        <div
          className="absolute ml-[150vw] top-0 bottom-0 left-0 w-screen h-full z-[99]"
          style={{
            background: `url(${assets.uxui.dodLoad}) no-repeat center / cover`,
            backgroundPosition: "45.75% 0%",
          }}
        >
          <div className={`flex  flex-col h-full items-center justify-center`}>
            <div className="absolute flex flex-col justify-between items-center h-full py-[3.5dvh]">
              <img
                src={assets.logos.begodsBlack}
                alt="logo"
                className="w-[85px] begod-text-shadow pointer-events-none"
              />
            </div>
          </div>

          <div className="w-full flex justify-center text-[0.75rem] absolute bottom-[1.5dvh] mx-auto text-gray-600">
            © 2025 Frogdog Games
          </div>
        </div>
      </div>
      {showSetting && <SettingModal close={() => setShowSetting(false)} />}
      <LoginModal />
    </div>
  );
};
export default OnboardPage;
