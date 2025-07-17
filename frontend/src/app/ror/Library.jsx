import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import RoRHeader from "../../components/Layouts/Header";
import { gameItems } from "../../utils/gameItems";

import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import { colorByMyth, mythSections } from "../../utils/constants.ror";
import Symbol from "../../components/Common/Symbol";
import BookCrd from "../../components/Cards/Citadel/BookCrd";
import { claimArtifact } from "../../utils/api.ror";
import { toast } from "react-toastify";
import RelicRwrdCrd from "../../components/Cards/Relics/RelicRwrdCrd";
import ShareButton from "../../components/Buttons/ShareBtn";
import RoRBtn from "../../components/Buttons/RoRBtn";
import {
  getActiveFeature,
  handleClickHaptic,
  setStorage,
} from "../../helpers/cookie.helper";
import MiscCard from "../../components/Cards/Citadel/MiscCard";
import { showToast } from "../../components/Toast/Toast";
import { Clapperboard } from "lucide-react";
import { trackEvent } from "../../utils/ga";
import { useAdsgram } from "../../hooks/Adsgram";
import { useRoRGuide } from "../../hooks/Tutorial";
import { LibraryGuide } from "../../components/Tutorials/RorTutorial";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ handleClick, assets }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${assets.boosters.libHead})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      onClick={handleClick}
      className="flex cursor-pointer justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-50 left-1/2 -translate-x-1/2"
    ></div>
  );
};

const Library = () => {
  const {
    gameData,
    setGameData,
    setShowCard,
    assets,
    authToken,
    enableHaptic,
    isTgMobile,
  } = useContext(RorContext);
  const [page, setPage] = useState(0);
  const [enableGuide, setEnableGuide] = useRoRGuide("ror-tutorial03");
  const getMythOrder = (itemId) => {
    const myth = itemId.split(".")[0];
    return mythSections.indexOf(myth);
  };

  const bookItems = useMemo(
    () =>
      gameItems
        .filter((item) => item.id.includes("artifact.starter10"))
        .sort((a, b) => getMythOrder(a.id) - getMythOrder(b.id))
        .map((item) => ({
          ...item,
          fragmentId: 0,
          isComplete: true,
        })),
    [gameItems]
  );

  const mapItems = useMemo(
    () =>
      gameItems
        .filter((item) => item.id.includes("artifact.common03"))
        .sort((a, b) => getMythOrder(a.id) - getMythOrder(b.id))
        .map((item) => ({
          ...item,
          fragmentId: 0,
          isComplete: true,
        })),
    [gameItems]
  );

  const statueItems = useMemo(
    () =>
      gameItems
        .filter((item) => item.id.includes("artifact.starter01"))
        .sort((a, b) => getMythOrder(a.id) - getMythOrder(b.id))
        .map((item) => ({
          ...item,
          fragmentId: 0,
          isComplete: true,
        })),
    [gameItems]
  );
  const [currItems, setCurrItems] = useState(0);
  const pageItems =
    currItems == 0
      ? bookItems
      : currItems == 1
      ? mapItems
      : currItems == 2
      ? statueItems
      : bookItems;

  const currentItem = pageItems[page];
  const myth = currentItem?.id.split(".")[0];
  const itemCode =
    currItems == 0
      ? "artifact.starter10"
      : currItems == 1
      ? "artifact.common03"
      : currItems == 2
      ? "artifact.starter01"
      : "artifact.starter10";

  const buttonColor = colorByMyth[myth] ?? "black";
  const [isClicked, setIsClicked] = useState(false);
  const itemId = `${myth}.${itemCode}`;
  const isOwned = gameData?.pouch.includes(itemId);
  const label =
    isOwned && currItems == 2 ? "consult" : isOwned ? "read" : "pay";

  const handleLeft = () => {
    setPage((prev) => {
      const next = (prev - 1 + 4) % 4;

      // if (next === 0) {
      //   setShiftBg(50);
      // } else {
      //   setShiftBg((bg) => bg - 10);
      // }

      return next;
    });
  };

  const handleRight = () => {
    setPage((prev) => {
      const next = (prev + 1) % 4;
      // setShiftBg((bg) => bg + (prev === 4 - 1 ? -(4 - 1) : 1) * 10);
      return next;
    });
  };

  const adsgramId = import.meta.env.VITE_AD_BOOSTER;

  const handleClaimItem = async (itemId, isAdPlayed) => {
    const adId = isAdPlayed ? adsgramId : null;
    const deductValue = isAdPlayed ? 0 : 1;

    try {
      await claimArtifact(authToken, itemId, adId);
      trackEvent("purchase", "claim_lib_item", "success");

      setGameData((prev) => {
        let updatedPouch = [...prev.pouch, itemId];
        let updatdStats = { ...prev.stats };

        updatdStats.gobcoin -= deductValue;

        return {
          ...prev,
          pouch: updatedPouch,
          stats: updatdStats,
        };
      });
      showToast("item_success_pouch");
    } catch (error) {
      showToast("item_error");
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(error);
    }
  };

  const showInfoCard = async () => {
    handleClickHaptic(tele, enableHaptic);
    setShowCard(
      <MiscCard
        showInfo={true}
        img={assets.boosters.libCard}
        icon="+"
        hideClose={true}
        sound="librarian"
        isMulti={false}
        handleClick={() => setShowCard(null)}
        Button={
          <RoRBtn
            message={"LEAVE"}
            isNotPay={true}
            left={1}
            right={1}
            handleClick={() => setShowCard(null)}
          />
        }
      />
    );
  };

  const handleActivate = async (key, value) => {
    setShowCard(null);
    await setStorage(tele, key, value);
  };

  useEffect(() => {
    const checkFirstTime = async () => {
      const isActive = await getActiveFeature(tele, "librarn01");

      if (!isActive) {
        setShowCard(
          <MiscCard
            showInfo={false}
            sound="librarian"
            img={assets.boosters.libCard}
            icon="+"
            hideClose={true}
            isMulti={false}
            handleClick={() => handleActivate("librarn01", true)}
            Button={
              <RoRBtn
                message={"LEAVE"}
                isNotPay={true}
                left={1}
                right={1}
                handleClick={() => handleActivate("librarn01", true)}
              />
            }
          />
        );
      }
    };
    (async () => await checkFirstTime())();
  }, []);

  const onReward = useCallback(() => {
    handleClaimItem(`${myth}.${itemCode}`, true);
  }, []);

  const onError = useCallback((result) => {
    showToast("ad_error");
  }, []);

  const showAd = useAdsgram({
    blockId: adsgramId,
    onReward,
    onError,
  });

  useEffect(() => {
    setShowCard(
      <LibraryGuide
        currTut={0}
        handleClick={() => {
          setCurrItems(1);
          setShowCard(
            <LibraryGuide
              currTut={1}
              handleClick={() => {
                setCurrItems(2);
                setShowCard(
                  <LibraryGuide
                    currTut={2}
                    handleClick={() => {
                      setCurrItems(0);
                      setEnableGuide(false);
                      setShowCard(null);
                    }}
                  />
                );
              }}
            />
          );
        }}
      />
    );
  }, [enableGuide]);

  return (
    <div className="w-full h-full">
      <RoRHeader
        CenterChild={<CenterChild assets={assets} handleClick={showInfoCard} />}
      />
      <div
        className={`${
          isTgMobile ? "tg-container-height" : "browser-container-height"
        } flex flex-col items-center justify-center`}
      >
        <div className={`grid-width h-[55dvh] mt-[7dvh] mx-auto relative p-1`}>
          <div
            className="absolute inset-0 z-0 filter-orb-white"
            style={{
              backgroundImage: `url(${assets.uxui.baseBgA})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              opacity: 0.5,
            }}
          />
          <div className="grid grid-cols-3 gap-x-1.5 w-full h-fit place-items-center place-content-between">
            {[
              {
                icon: "+",
                label: "book",
              },
              {
                icon: "*",
                label: "map",
              },
              {
                icon: "Y",
                label: "totem",
              },
            ].map((itm, index) => (
              <div
                onClick={() => {
                  if (currItems == index) {
                    handleClickHaptic(tele, enableHaptic);
                    setShowCard(
                      <RelicRwrdCrd
                        showBoots={false}
                        claimBoots={() => {}}
                        itemId={`${myth}.${itemCode}`}
                        isChar={false}
                        fragmentId={0}
                        isComplete={true}
                        ButtonBack={
                          <ShareButton
                            isShared={false}
                            isInfo={false}
                            handleClaim={() => {}}
                            activeMyth={mythSections.indexOf(myth)}
                            isCoin={true}
                            link={"sdjkfds"}
                          />
                        }
                        ButtonFront={
                          <RoRBtn
                            itemId={`${myth}.${itemCode}`}
                            message={"Enter"}
                            isNotPay={true}
                            left={1}
                            right={1}
                            handleClick={() => setShowCard(null)}
                          />
                        }
                      />
                    );
                  } else {
                    handleClickHaptic(tele, enableHaptic);
                    setCurrItems(index);
                  }
                }}
                key={`box-${index}`}
                className={` border ${
                  index === currItems
                    ? `border-${myth}-primary text-black-contour text-${myth}-primary glow-button-${myth}`
                    : "text-white border-white/70"
                }  relative max-w-[120px] w-full rounded-md overflow-hidden `}
              >
                <div
                  className={`w-full aspect-square rounded-t-md border-b border-white/50 bg-white/20 flex justify-center items-center`}
                >
                  <span className="text-iconLg font-symbols">{itm.icon}</span>
                </div>
                <div
                  className={`w-full text-white uppercase text-center text-sm leading-tight px-1 py-1.5 truncate  bg-black/50 rounded-b-md`}
                >
                  {index == currItems
                    ? `${index == 2 ? "consult" : "read"}`
                    : itm.label}
                </div>
              </div>
            ))}
          </div>

          {/* ad */}
          <div className="flex relative flex-col justify-center items-center gap-y-4 h-[68%]">
            {!gameData?.pouch?.includes(`${myth}.${itemCode}`) && (
              <div className="flex justify-center items-center text-center text-white h-fit w-full">
                <div className="flex gap-x-2 justify-center items-center w-full">
                  <div className={`font-symbols text-gold text-[2rem]`}>A</div>
                  <div
                    className={`font-fof text-[1.75rem] font-normal  text-black-contour transition-all duration-1000 text-white`}
                  >
                    1
                  </div>
                </div>
                <div className="text-[1.75rem]">|</div>
                <div
                  onClick={() => {
                    handleClickHaptic(tele, enableHaptic);
                    showAd();
                  }}
                  className="flex gap-x-2 justify-center items-center w-full"
                >
                  <Clapperboard
                    color="white"
                    size={"2.15rem"}
                    className="text-black-contour"
                  />
                  <div className="text-white text-[1.75rem] text-black-contour">
                    FREE
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-center relative">
              <img
                src={
                  currItems == 0
                    ? assets.uxui.baseBook
                    : currItems == 1
                    ? `https://media.publit.io/file/BeGods/items/240px-${myth}.artifact.starter02.png`
                    : currItems == 2
                    ? `https://media.publit.io/file/BeGods/items/240px-${myth}.artifact.starter01.png`
                    : assets.uxui.baseBook
                }
                alt="book"
                className={`glow-text-white w-item`}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-[2dvh]">
          <div
            onMouseDown={() => {
              setIsClicked(true);
            }}
            onMouseUp={() => {
              setIsClicked(false);
            }}
            onMouseLeave={() => {
              setIsClicked(false);
            }}
            onTouchStart={() => {
              setIsClicked(true);
            }}
            onTouchEnd={() => {
              setIsClicked(false);
            }}
            onTouchCancel={() => {
              setIsClicked(false);
            }}
            onClick={() => {
              setTimeout(() => setIsClicked(false), 150);

              if (isOwned) {
                if (currItems == 0) {
                  setShowCard(
                    <BookCrd
                      handleClose={() => setShowCard(null)}
                      assets={assets}
                      buttonColor={buttonColor}
                      myth={myth}
                    />
                  );
                } else {
                  toast.success("not sure what to do here!");
                }
              } else {
                handleClaimItem(itemId, null);
              }
            }}
            className="flex justify-center items-center relative h-fit"
          >
            <img
              src={
                isClicked || isOwned
                  ? assets.buttons[buttonColor]?.off
                  : assets.buttons[buttonColor]?.on
              }
              alt="button"
            />
            <div className="absolute z-50 uppercase text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
              {label}
            </div>
          </div>
        </div>
      </div>

      <>
        <ToggleLeft
          positionBottom={true}
          activeMyth={4}
          handleClick={handleLeft}
        />
        <ToggleRight
          positionBottom={true}
          activeMyth={4}
          handleClick={handleRight}
        />
      </>
    </div>
  );
};

export default Library;
