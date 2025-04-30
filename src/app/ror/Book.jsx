import React, { useState, useContext, useMemo, useEffect } from "react";
import RoRHeader from "../../components/layouts/Header";
import { gameItems } from "../../utils/gameItems";

import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import { colorByMyth, mythSections } from "../../utils/constants.ror";
import Symbol from "../../components/Common/Symbol";
import BookCrd from "../../components/ror/BookCrd";
import { claimArtifact } from "../../utils/api.ror";
import { toast } from "react-toastify";
import RelicRwrdCrd from "../../components/Cards/Reward/RelicRwrdCrd";
import ShareButton from "../../components/Buttons/ShareBtn";
import RoRBtn from "../../components/ror/RoRBtn";
import { getActiveFeature } from "../../helpers/cookie.helper";
import MiscCard from "../../components/ror/MiscCard";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ handleClick }) => {
  return (
    <div
      style={{
        backgroundImage: `url('/assets/240px-librarian_head.jpg')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      onClick={handleClick}
      className="flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2"
    ></div>
  );
};

const Book = () => {
  const { gameData, setGameData, setShowCard, setShiftBg, assets, authToken } =
    useContext(RorContext);
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

  const handleClaimItem = async (itemId) => {
    try {
      await claimArtifact(authToken, itemId);
      setGameData((prev) => {
        let updatedPouch = [...prev.pouch, itemId];
        let updatdStats = { ...prev.stats };

        updatdStats.gobcoin -= 1;

        return {
          ...prev,
          pouch: updatedPouch,
          stats: updatdStats,
        };
      });
      toast.success("Item claimed successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  const showInfoCard = async () => {
    setShowCard(
      <MiscCard
        showInfo={true}
        img={assets.boosters.gemologistCard}
        icon="Gemologist"
        isMulti={false}
        handleClick={() => setShowCard(null)}
        Button={
          <RoRBtn
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
      const isActive = await getActiveFeature(tele, "librarian01");

      if (!isActive) {
        setShowCard(
          <MiscCard
            showInfo={false}
            img={assets.boosters.libCard}
            icon="Librarian"
            isMulti={false}
            handleClick={() => handleActivate("librarian01", true)}
            Button={
              <RoRBtn
                isNotPay={true}
                left={1}
                right={1}
                handleClick={() => handleActivate("librarian01", true)}
              />
            }
          />
        );
      }
    };
    (async () => await checkFirstTime())();
  }, []);

  return (
    <div className="w-full h-full">
      <RoRHeader CenterChild={<CenterChild handleClick={showInfoCard} />} />
      <div className="relative flex flex-col w-[80%] mt-[18dvh] h-[60dvh] mx-auto">
        <div
          className="absolute inset-0 z-0 filter-orb-white"
          style={{
            backgroundImage: `url(${assets.uxui.basebg})`,
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
                            isNotPay={true}
                            left={1}
                            right={1}
                            handleClick={() => setShowCard(null)}
                          />
                        }
                      />
                    );
                  } else {
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

        <div className="flex flex-col gap-y-4 justify-center items-center h-full">
          <div className="flex justify-center relative">
            <div className="absolute mt-16 ml-3">
              <Symbol isCard={true} showClaimEffect={() => {}} myth={myth} />
            </div>
            <img
              src={
                currItems == 0
                  ? "/assets/240px-book-.png"
                  : currItems == 1
                  ? `/assets/ror-cards/240px-${myth}.artifact.common03_on.png`
                  : currItems == 2
                  ? `/assets/ror-cards/240px-${myth}.artifact.starter01_on.png`
                  : "/assets/240px-book-.png"
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
                handleClaimItem(`${myth}.${itemCode}`);
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

export default Book;
