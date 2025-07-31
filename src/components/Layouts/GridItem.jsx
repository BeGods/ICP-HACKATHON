import { gameItems } from "../../utils/gameItems";
import { useMaskStyle } from "../../hooks/useMaskStyle";
import { reformatPotion } from "../../helpers/game.helper";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { useStore } from "../../store/useStore";

const tele = window.Telegram?.WebApp;

export const GridItemEmpty = ({
  idx,
  handleClick,
  icon,
  label,
  border,
  disable,
  isHighlighted,
  dropRef,
}) => {
  const enableHaptic = useStore((s) => s.enableHaptic);

  const handleClickWrapper = () => {
    if (disable) return;
    if (typeof handleClick === "function") {
      handleClickHaptic(tele, enableHaptic);
      handleClick();
    }
  };
  return (
    <div
      onClick={handleClickWrapper}
      ref={dropRef}
      key={`placeholder-${idx}`}
      className={`relative w-full max-w-[120px] flex flex-col border ${
        !label && "opacity-60"
      }  ${border ?? "border-white text-white text-black-contour"} ${
        disable && "opacity-50"
      } ${
        isHighlighted && "glow-button-white"
      } items-center rounded-md  overflow-hidden shadow-2xl cursor-pointer`}
    >
      <div
        className={`w-full border-b ${
          border ?? "border-white/50"
        } aspect-square bg-white/20 flex justify-center items-center`}
      >
        <span className="text-iconLg font-symbols">{icon}</span>
      </div>
      {label && (
        <div className="w-full bg-black/50 rounded-b-md uppercase text-white text-secondary text-center px-1 py-1.5 leading-tight truncate">
          {label}
        </div>
      )}
    </div>
  );
};

export const GridItemCopy = ({ copyPosition, draggedItem }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: `${copyPosition.y}px`,
        left: `${copyPosition.x}px`,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <div className="relative h-[120px] w-[120px] overflow-hidden">
        <div
          className="glow-icon-white h-full w-full"
          style={{
            backgroundImage: `url(https://media.publit.io/file/BeGods/items/240px-${draggedItem.itemId}.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
    </div>
  );
};

const GridItem = ({
  itemObj,
  itemsWithAllFrags,
  handleClick,
  isInfo,
  isStage,
  hideBg,
  showLabel,
  customLabel,
}) => {
  const assets = useStore((s) => s.assets);

  const itemDetails = gameItems.find((item) => item?.id === itemObj?.itemId);

  const mask = useMaskStyle(
    itemDetails?.id,
    itemDetails?.fragments.length,
    Array.isArray(itemObj?.fragmentId)
      ? itemObj?.fragmentId
      : [itemObj?.fragmentId]
  );

  const isGrayscale =
    isStage &&
    (itemObj?.isComplete === true ||
      !itemsWithAllFrags.includes(itemDetails?.id));

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer ${isGrayscale ? "grayscale" : ""} 
    w-full h-auto max-w-[120px] flex flex-col items-center 
    shadow-2xl rounded-md overflow-hidden`}
    >
      <div
        className={`flex flex-col border border-white/50 rounded-md  items-center w-full`}
      >
        <div className="relative w-full border-b border-white/50 aspect-square max-w-[120px] overflow-hidden rounded-t-md">
          {!hideBg && (
            <div
              className={`absolute inset-0 z-0 opacity-50 ${
                itemObj.isComplete &&
                `filter-${
                  !isInfo && itemObj?.itemId?.includes("potion")
                    ? reformatPotion(itemObj?.itemId)?.split(".")[0]
                    : itemObj?.itemId?.split(".")[0]
                }`
              }`}
              style={{
                backgroundImage: `url(${
                  isInfo ? assets.uxui.bgInfo : assets.uxui.baseBgA
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          <div className="absolute bg-white/5 inset-0 z-10  border-white/50 rounded-t-md overflow-hidden">
            <div
              className={`w-full h-full flex justify-center items-end select-none  ${
                !itemObj?.isComplete ? "grayscale" : ""
              }`}
              style={{
                backgroundImage: `url(https://media.publit.io/file/BeGods/items/240px-${itemObj?.itemId}.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="w-full">{mask}</div>
          </div>
        </div>

        {showLabel && (
          <div
            className={`w-full  rounded-b-md text-center text-white text-secondary uppercase flex items-center justify-center leading-tight break-words px-1 py-1.5`}
          >
            {customLabel ? customLabel : itemDetails?.name || ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default GridItem;
