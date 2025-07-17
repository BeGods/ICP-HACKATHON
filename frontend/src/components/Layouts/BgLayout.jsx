import { useContext, useMemo } from "react";
import { FofContext, MainContext } from "../../context/context";
import { mythSections } from "../../utils/constants.fof";

const backgroundFoFSections = new Set([4, 7, 8, 9, 10, 11, 12]);
const orbsFilterSections = new Set([0, 1, 2]);

const BgLayout = ({ children, isLoading }) => {
  const { assets, section } = useContext(MainContext);
  const { activeMyth } = useContext(FofContext);

  const backgroundImage = useMemo(() => {
    if (section === 4 || (section >= 7 && section < 12) || isLoading)
      return assets.locations.fof;
    if (section === 0) return assets.uxui.baseBgForge;
    return assets.uxui.baseBgA;
  }, [section, isLoading, assets]);

  const filter = useMemo(() => {
    if (backgroundFoFSections.has(section) || isLoading) return "";
    if (orbsFilterSections.has(section))
      return `orbs-${mythSections[activeMyth]}`;
    return "other";
  }, [section, isLoading, activeMyth]);

  const position = useMemo(() => {
    return backgroundFoFSections.has(section) || isLoading
      ? "50% 0%"
      : "44% 50%";
  }, [section, isLoading]);

  return (
    <div
      style={{
        top: 0,
        left: 0,
        width: "100vw",
      }}
      className="flex h-full flex-col m-0"
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
        className="background-wrapper transition-all duration-500"
      >
        <div
          className={`absolute top-0 left-0 h-full w-full filter-${filter}`}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: position,
          }}
        />
        <img
          src={assets.uxui.shadow}
          alt="paper"
          draggable={false}
          className="w-full absolute top-0 rotate-180 left-0 z-[1] select-none h-[120px]"
        />
        <img
          src={assets.uxui.shadow}
          alt="paper"
          draggable={false}
          className="w-full absolute bottom-0 left-0 z-[1] select-none h-[120px]"
        />
      </div>
      {children}
    </div>
  );
};

export default BgLayout;
