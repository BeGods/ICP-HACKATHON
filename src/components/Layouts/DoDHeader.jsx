import { useStore } from "../../store/useStore";
import HeaderLayout, { HeadbarLayout } from "./HeaderLayout";

const CenterChild = ({ gameData, assets }) => (
  <div className="relative h-symbol-primary w-symbol-primary">
    <img
      src={assets.uxui.sundial}
      alt="sundial"
      className={`absolute z-30 w-auto h-auto max-w-full max-h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
    />
    <div className="absolute z-40 flex justify-center items-center inset-0 text-[5rem] text-white text-black-contour">
      {gameData.currentTurn}
    </div>
  </div>
);

const DoDHeader = () => {
  const assets = useStore((s) => s.assets);
  const gameData = useStore((s) => s.gameData);

  const data = [
    {
      icon: 9,
      value: 2,
      label: "Hello",
      handleClick: () => {},
    },
    {
      icon: 9,
      value: 2,
      label: "Hello",
      handleClick: () => {},
    },
  ];

  return (
    <HeaderLayout
      activeMyth={4}
      hideContour={true}
      title={"Home"}
      BottomChild={<HeadbarLayout data={data} activeMyth={8} />}
      CenterChild={
        <div
          onClick={() => {
            current.handleCenter?.();
          }}
          className="flex cursor-pointer absolute justify-center w-full top-0 -mt-2 z-50"
        >
          <CenterChild assets={assets} gameData={gameData} />
        </div>
      }
    />
  );
};

export default DoDHeader;
