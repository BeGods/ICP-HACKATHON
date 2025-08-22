import { useMemo } from "react";
import { mythSections } from "../../utils/constants.fof";
import { useStore } from "../../store/useStore";

const backgroundFoFSections = new Set([4, 7, 8, 9, 10, 11]);
const orbsFilterSections = new Set([0, 1, 2]);

const BgLayout = ({ children, isLoading }) => {
  const assets = useStore((s) => s.assets);
  const gameData = useStore((s) => s.gameData);
  const section = useStore((s) => s.section);
  const game = useStore((s) => s.game);
  const activeMyth = useStore((s) => s.activeMyth);

  const FoFbgImage = useMemo(() => {
    if (section === 4 || (section >= 7 && section < 12) || isLoading)
      return assets.locations.fof;
    if (section === 0) return assets.uxui.baseBgForge;
    return assets.uxui.baseBgA;
  }, [section, isLoading, assets]);

  const DoDbgImage = useMemo(() => {
    if (gameData.gamePhase !== "idle") {
      return `https://media.publit.io/file/BeGods/locations/1280px-ror.${gameData.location}-wide.jpg`;
    }
    return assets.uxui.baseBgA;
  }, [section, isLoading, assets]);

  const RoRbgImage = useMemo(() => {
    if (section == 0) {
      return assets.locations.citadel;
    }
    if (section == 1) {
      return `https://media.publit.io/file/BeGods/locations/1280px-ror.underworld01-wide.jpg`;
    }
    if (section == 3) {
      return assets.locations.foundry;
    }
    if (section == 4) {
      return assets.locations.bank;
    }
    if (section == 5) {
      return assets.locations.apothecary;
    }
    if (section == 6) {
      return assets.locations.library;
    }
    if (section == 7) {
      return assets.locations.tavern;
    }
    if (section == 11 || section == 12 || section == 9) {
      return assets.locations.ror;
    }

    return assets.uxui.baseBgA;
  }, [section, isLoading, assets]);

  const FoFfilter = useMemo(() => {
    if (backgroundFoFSections.has(section) || isLoading) return "";
    if (orbsFilterSections.has(section))
      return `orbs-${mythSections[activeMyth]}`;
    return "other";
  }, [section, isLoading, activeMyth]);

  const position = useMemo(() => {
    return game == "ror"
      ? "50% 0%"
      : backgroundFoFSections.has(section) || isLoading
      ? "50% 0%"
      : "44% 50%";
  }, [section, isLoading]);

  const backgroundImage =
    game == "fof" ? FoFbgImage : game == "ror" ? RoRbgImage : DoDbgImage;
  const filter =
    game == "fof"
      ? FoFfilter
      : game == "dod" && gameData.gamePhase == "idle"
      ? `orbs-${mythSections[activeMyth]}`
      : null;

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
