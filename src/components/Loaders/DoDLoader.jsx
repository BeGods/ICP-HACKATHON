import assets from "../../assets/assets.json";
import LoadRoll from "../Fx/LoadRoll";
import SecondaryBtn from "../Buttons/SecondaryBtn";
import { useStore } from "../../store/useStore";

const DoDLoader = (props) => {
  const isTgMobile = useStore((s) => s.enableHaptic);

  return (
    <div
      style={{
        top: 0,
        left: 0,
        width: "100vw",
      }}
      className={`flex h-full flex-col m-0`}
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
          className={`absolute top-0 left-0 h-full w-full`}
          style={{
            backgroundImage: `url(${assets.locations.dod})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
        <img
          src={assets.uxui.shadow}
          alt="paper"
          draggable={false}
          className="w-full absolute top-0 rotate-180 left-0 z-[30] select-none h-[120px]"
        />
        <img
          src={assets.uxui.shadow}
          alt="paper"
          draggable={false}
          className="w-full absolute bottom-0 left-0 z-[1] select-none h-[120px]"
        />
      </div>

      <div className="center-section">
        <img
          src={assets.uxui.towerOn}
          alt="tower"
          style={{
            width: `${
              !!document.fullscreenElement || isTgMobile ? "82dvw" : "45dvh"
            }`,
          }}
        />
      </div>
      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center w-full mt-gamePanelTop justify-center z-20">
        <div className="flex flex-col justify-between items-center h-full w-full mb-buttonBottom">
          <img src={assets.logos.fof} alt="fof" className="fof-text-shadow" />
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex justify-center fade-in items-center w-full -mb-[1.55vh]">
              <LoadRoll />
            </div>
            <SecondaryBtn
              buttonColor={"orange"}
              message={"LOADING"}
              isDefaultOff={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoDLoader;
