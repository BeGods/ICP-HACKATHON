import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../context/context";
import { ChevronsLeft, ChevronsRight, Share2, ThumbsUp } from "lucide-react";
import { mythSections } from "../../utils/constants.fof";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { useDisableWrapper } from "../../hooks/disableWrapper";

const tele = window.Telegram?.WebApp;

export const CoinBtnAddOn = ({ content, type = "default" }) => {
  const { assets } = useContext(MainContext);

  return (
    <div className="relative flex justify-center items-center w-full h-full pr-1.5">
      <div
        className={`flex relative text-center justify-center ${
          type == "default" ? "max-w-xs-multi-orb" : "max-w-orb"
        } items-center rounded-full glow-icon-black`}
      >
        <img src={assets.uxui.gobcoin} alt="coin" />
      </div>
      <div className="absolute text-[1.75rem] text-white text-black-contour">
        {content}
      </div>
    </div>
  );
};

export const OrbBtnAddOn = ({ content }) => {
  const { assets } = useContext(MainContext);

  return (
    <div className="relative flex justify-center items-center w-full h-full pr-1.5">
      <div
        className={`flex relative text-center justify-center max-w-xs-multi-orb items-center rounded-full glow-icon-black`}
      >
        <img src={assets.items.multiorb} alt="orb" />
      </div>
      <div className="absolute text-[1.75rem] text-white text-black-contour">
        {content}
      </div>
    </div>
  );
};

export const SocialAddOn = () => {
  const { assets } = useContext(MainContext);

  return (
    <div className="relative flex justify-center items-center w-full h-full pl-1.5">
      <div
        className={`flex relative text-center justify-center w-[1.75rem] items-center rounded-full glow-icon-black`}
      >
        <img src={assets.misc.x} alt="x" />
      </div>
    </div>
  );
};

// 'default' | 'action' | 'info'
export const PrimaryBtn = ({
  mode = "default",
  handlePrev,
  handleNext,
  handleCenterClick,
  onClick,
  leftContent,
  rightContent,
  centerContent,
  customMyth,
  isOrb,
  isFlagged,
  link,
  disable,
  showGlow,
  isCoin,
}) => {
  const { assets, activeMyth, enableHaptic } = useContext(MainContext);
  const [showRedirect, setShowRedirect] = useState(true);
  const myth = customMyth ?? activeMyth;
  const currMyth =
    typeof customMyth === "string"
      ? customMyth
      : typeof customMyth === "number"
      ? mythSections[customMyth]
      : mythSections[myth];
  const mythColor = `${currMyth}-primary`;
  const { wrapWithDisable } = useDisableWrapper();
  const centerIcon =
    mode === "share" ? (
      showRedirect ? (
        <Share2 size={"1.75rem"} color={disable ? "gray" : "white"} />
      ) : (
        <ThumbsUp size={"1.75rem"} color={disable ? "gray" : "white"} />
      )
    ) : (
      centerContent ?? "V"
    );

  const handleShareClick = () => {
    if (showRedirect) {
      window.open(link, "_blank");
      setShowRedirect(false);
    } else {
      onClick();
    }
  };

  const handleOnClick = () => {
    if (disable) return;
    handleClickHaptic(tele, enableHaptic);

    mode === "share"
      ? wrapWithDisable(handleShareClick)
      : mode === "default"
      ? wrapWithDisable(onClick)
      : undefined;
  };

  const handleMiddleClick = () => {
    if (disable) return;
    handleClickHaptic(tele, enableHaptic);

    mode === "action" ? wrapWithDisable(handleCenterClick) : undefined;
  };

  const handlePrevClick = () => {
    if (disable) return;

    handleClickHaptic(tele, enableHaptic);

    mode === "action" ? wrapWithDisable(handlePrev) : undefined;
  };

  const handleNextClick = () => {
    handleClickHaptic(tele, enableHaptic);

    mode === "action" ? wrapWithDisable(handleNext) : undefined;
  };

  useEffect(() => {
    setShowRedirect(true);
  }, [link]);

  return (
    <div
      onClick={handleOnClick}
      className={`flex ${showGlow && `glow-button-${currMyth}`}  ${
        disable && "grayscale"
      } justify-between items-center relative ${
        mode === "share" ? `bg-${mythColor}` : "bg-glass-black-lg"
      } h-button-primary w-button-primary rounded-primary border border-${mythColor} ${
        mode === "default" || "share" ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* left */}
      {mode !== "info" && (
        <div
          className={`flex justify-center items-center w-1/4 h-full ${
            mode === "action" ? "cursor-pointer" : ""
          }`}
          onClick={handlePrevClick}
        >
          {mode === "action" ? (
            <ChevronsLeft
              color={"white"}
              className="h-icon-secondary w-icon-secondary"
            />
          ) : mode === "share" ? (
            <SocialAddOn assets={assets} />
          ) : (
            <div
              className={`relative flex justify-center items-center w-full h-full text-${mythColor} text-[1.35rem] pl-1.5`}
            >
              <div className="w-full">{leftContent}</div>
            </div>
          )}
        </div>
      )}

      {/* center */}
      {mode !== "info" ? (
        <div
          className={`flex shadow-black text-white shadow-2xl justify-center text-[1.75rem] font-symbols items-center ${
            isFlagged ? `bg-${mythColor}` : "bg-black"
          } w-[4rem] h-[4rem] border-2 border-${mythColor} rounded-full ${
            mode === "action" ? "cursor-pointer" : ""
          }`}
          onClick={handleMiddleClick}
        >
          {centerIcon}
        </div>
      ) : (
        <div
          className={`flex w-full shadow-black text-white shadow-2xl justify-center text-[1.75rem] font-fof items-center  rounded-full`}
        >
          {centerIcon}
        </div>
      )}

      {/* right */}
      {mode !== "info" && (
        <div
          className={`flex justify-center items-center w-1/4 h-full ${
            mode === "action" ? "cursor-pointer" : ""
          }`}
          onClick={handleNextClick}
        >
          {mode === "action" ? (
            <ChevronsRight
              color={"white"}
              className="h-icon-secondary w-icon-secondary"
            />
          ) : (
            <>
              {isOrb || mode === "share" ? (
                <OrbBtnAddOn content={rightContent} />
              ) : isCoin ? (
                <CoinBtnAddOn content={rightContent} />
              ) : (
                <div
                  className={`relative flex justify-center items-center w-full h-full text-${mythColor} text-[1.35rem] pl-1.5`}
                >
                  <div className="w-full">{rightContent}</div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
