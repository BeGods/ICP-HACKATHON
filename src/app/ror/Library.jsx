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
      className="flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-50 left-1/2 -translate-x-1/2"
    ></div>
  );
};

const Library = () => {
  const {
    gameData,
    setGameData,
    setShowCard,
    setShiftBg,
    assets,
    authToken,
    enableHaptic,
  } = useContext(RorContext);
  const [page, setPage] = useState(0);

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
        icon="Librarian"
        isMulti={false}
        handleClick={() => setShowCard(null)}
        Button={
          <RoRBtn
            message={"Close"}
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
            img={assets.boosters.libCard}
            icon="Librarian"
            isMulti={false}
            handleClick={() => handleActivate("librarn01", true)}
            Button={
              <RoRBtn
                message={"Enter"}
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

  return (
    <div className="w-full h-full">
      <RoRHeader
        CenterChild={<CenterChild assets={assets} handleClick={showInfoCard} />}
      />
      <div className="relative flex flex-col w-[80%] mt-[18dvh] h-[60dvh] mx-auto">
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

        <div className="h-fit w-full grid grid-cols-3 gap-x-1">
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
              label: "statue",
            },
          ].map((itm, index) => {
            return (
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
                className={`relative border ${
                  index === currItems
                    ? `border-${myth}-primary text-white glow-button-${myth}`
                    : "text-white border-white/70"
                } flex flex-col items-center aspect-square shadow-2xl max-w-[120px] w-full h-[140px] rounded-md overflow-hidden`}
              >
                <div className="w-full aspect-square rounded-md bg-white/20 flex justify-center items-center">
                  <span className="text-iconLg font-symbols">{itm.icon}</span>
                </div>
                {index == currItems ? (
                  <div className="w-full uppercase text-center text-[1rem] break-words px-1 bg-black py-1 rounded-md">
                    INFO
                  </div>
                ) : (
                  <div className="w-full uppercase text-center text-[1rem] mt-1 break-words px-1">
                    {itm.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-y-4 relative justify-center items-center h-full">
          {!gameData?.pouch?.includes(`${myth}.${itemCode}`) && (
            <div
              onClick={() => {
                handleClickHaptic(tele, enableHaptic);
                showAd();
              }}
              className="flex flex-col justify-center items-center mx-4 mt-5 absolute top-0 right-0"
            >
              <Clapperboard
                color="white"
                size={"10vw"}
                className="text-black-contour"
              />
              <div className="text-white text-black-contour">FREE</div>
            </div>
          )}

          <div className="flex justify-center relative">
            {currItems == 0 && (
              <div className="absolute mt-16 ml-3">
                <Symbol isCard={true} showClaimEffect={() => {}} myth={myth} />
              </div>
            )}

            <img
              src={
                currItems == 0
                  ? assets.uxui.baseBook
                  : currItems == 1
                  ? `https://media.publit.io/file/BeGods/items/240px-${myth}.artifact.common03.png`
                  : currItems == 2
                  ? `https://media.publit.io/file/BeGods/items/240px-${myth}.artifact.starter01.png`
                  : assets.uxui.baseBook
              }
              alt="book"
              className={`glow-text-white`}
            />
          </div>
          <div
            onClick={() => {
              if (gameData?.pouch.includes(`${myth}.${itemCode}`)) {
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
                handleClaimItem(`${myth}.${itemCode}`, null);
              }
            }}
            className="flex justify-center items-center relative h-fit"
          >
            <img src={assets.buttons[buttonColor]?.on} alt="button" />
            <div className="absolute flex justify-center  w-full z-50 uppercase text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
              {gameData?.pouch?.includes(`${myth}.${itemCode}`) ? (
                <div className="uppercase">Read</div>
              ) : (
                <>
                  <span className="font-symbols px-2">A</span>1
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <ToggleLeft activeMyth={4} handleClick={handleLeft} />
        <ToggleRight activeMyth={4} handleClick={handleRight} />
      </div>
    </div>
  );
};

export default Library;
