import { useContext } from "react";
import Header from "../../components/Common/Header";
import { MyContext } from "../../context/context";

const TopChild = () => {
  return (
    <div className="absolute flex w-full justify-between top-0 z-50">
      <div className="flex flex-col items-end justify-between h-full mt-1 ml-[8vw] z-10">
        <div className="font-symbols text-white text-[12vw] text-black-lg-contour">
          3
        </div>
      </div>
      <div className="flex flex-col text-black-lg-contour items-end justify-between h-full mt-1 mr-[8vw] z-10">
        <div className="font-symbols text-white text-[12vw]">2</div>
      </div>
    </div>
  );
};

const BottomChild = ({ partners }) => {
  return (
    <div className="flex bar-flipped justify-center -mt-[4vh] px-7">
      <div
        className={`flex glow-button-white text-num pl-[18px] text-black-lg-contour text-white items-center border  justify-start h-button-primary w-full bg-black z-10 rounded-primary transform skew-x-[18deg]`}
      >
        {partners}
      </div>
      <div
        className={`flex text-num pr-[18px] text-black-lg-contour text-white items-center border justify-end h-button-primary w-full bg-black z-10 rounded-primary transform -skew-x-[18deg]`}
      >
        0
      </div>
    </div>
  );
};

const CenterChild = () => {
  const { platform, assets } = useContext(MyContext);
  return (
    <div className="flex absolute justify-center w-full">
      <div
        onClick={() => {}}
        className={`z-20 flex text-center glow-icon-white justify-center h-[36vw] w-[36vw] mt-1 items-center rounded-full outline outline-[0.5px] outline-white transition-all duration-1000  overflow-hidden relative`}
      >
        <img
          src={`${assets.uxui.baseorb}`}
          alt="base-orb"
          className={`filter-orbs-black w-full h-full`}
        />
        <span
          className={`absolute z-1 font-symbols text-white text-[30vw] ${
            platform === "ios" ? "mt-8 ml-2" : "mt-10 ml-2"
          }  opacity-50 orb-symbol-shadow`}
        >
          3
        </span>
      </div>
    </div>
  );
};

const GiftHeader = ({ partners }) => {
  return (
    <Header
      BottomChild={<BottomChild partners={partners} />}
      TopChild={<TopChild />}
      CenterChild={<CenterChild />}
    />
  );
};

export default GiftHeader;
