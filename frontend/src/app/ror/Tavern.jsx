import React, { useState, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import RoRHeader from "../../components/layouts/Header";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import ArtifactCrd from "../../components/Cards/Reward/ArtiFactCrd";
import { gameItems } from "../../utils/gameItems";
import MiscCard from "../../components/ror/MiscCard";
import RoRBtn from "../../components/ror/RoRBtn";
import { getActiveFeature, setStorage } from "../../helpers/cookie.helper";
import { toast } from "react-toastify";
import { activateRest } from "../../utils/api.ror";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ handleClick }) => {
  return (
    <div
      style={{
        backgroundImage: `url('/assets/240px-tavernist_head.jpg')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      onClick={handleClick}
      className="flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2"
    ></div>
  );
};

const Tavern = () => {
  const { gameData, setGameData, setShowCard, assets, authToken } =
    useContext(RorContext);
  const [showItems, setShowItems] = useState(null);
  const bookItems = gameData.pouch.filter((item) =>
    item.includes("artifact.starter02")
  );
  const books = bookItems.map((item) => ({
    ...item,
    id: item,
    fragmentId: 0,
    isComplete: true,
  }));
  const items = books;
  const pageItems = items?.map((item) => ({
    ...item,
    itemId: item.id,
    fragmentId: 0,
    isComplete: true,
  }));
  const [page, setPage] = useState(0);

  const ITEMS_PER_PAGE = showItems ? 9 : 6;
  const totalPages = Math.ceil(pageItems.length / ITEMS_PER_PAGE);

  const handleLeft = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleRight = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  const pagedItems = pageItems.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const showInfoCard = async () => {
    setShowCard(
      <MiscCard
        showInfo={true}
        img={assets.boosters.tavernCard}
        icon="Tavern"
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

  const handleActivateRest = async () => {
    if (gameData.stats.isRestActive) {
      setSection(13);
    } else {
      try {
        const response = await activateRest(authToken);
        setShowCard(null);
        setGameData((prev) => {
          const newStats = { ...prev.stats };

          newStats.gobcoins = (prev.stats.gobcoin || 0) - 1;
          newStats.isRestActive = true;
          return {
            ...prev,
            stats: newStats,
          };
        });
        handleActivate("tavern01", true);
        console.log(response);
        toast.success("rest activated");
      } catch (error) {
        console.log(error);
        setShowCard(null);
        toast.error("insufficient gobcoins");
      }
    }
  };

  useEffect(() => {
    const checkFirstTime = async () => {
      const isActive = await getActiveFeature(tele, "tavern01");

      if (!isActive) {
        setShowCard(
          <MiscCard
            showInfo={false}
            img={assets.boosters.tavernCard}
            icon="tavernCard"
            isMulti={false}
            handleClick={() => handleActivate("tavern01", true)}
            Button={
              <RoRBtn
                left={1}
                right={1}
                handleClick={() => {
                  handleActivateRest();
                }}
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
      <div className="w-[80%] mt-[18dvh] h-[60dvh] mx-auto relative">
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
        <div className="w-full h-full grid grid-cols-3 gap-x-1">
          {!showItems &&
            [")", "F", "z"].map((itm, index) => {
              const items = gameItems
                .filter((itm) => itm.id.includes("artifact.starter02"))
                .filter((itm) => !gameData.pouch.includes(itm.id));

              return (
                <div
                  onClick={() => {
                    items.length !== 0 &&
                      setShowCard(
                        <ArtifactCrd
                          items={items}
                          category={4}
                          handleClick={() => {}}
                        />
                      );
                  }}
                  key={`box-${index}`}
                  className={`relative border ${
                    items.length == 0
                      ? "text-white/20  border-white/20"
                      : "text-white  border-white"
                  }  flex flex-col items-center aspect-square shadow-2xl max-w-[120px] w-full h-full max-h-[140px] rounded-md overflow-hidden`}
                >
                  <div
                    className={`w-full aspect-square rounded-md bg-white/20 flex justify-center items-center`}
                  >
                    <span className="text-iconLg font-symbols">{itm}</span>
                  </div>
                  <div
                    className={`w-full  text-center text-[1rem] mt-1 break-words px-1`}
                  >
                    Drop
                  </div>
                </div>
              );
            })}

          {pagedItems.map((item) => (
            <div key={item.itemId}>
              <GridItem
                handleClick={() => {
                  const myth = item.itemId.split(".")[0];
                  setShowItems(myth);
                }}
                itemObj={item}
                itemsWithAllFrags={pageItems.map((item) => item.itemId)}
              />
            </div>
          ))}
          {Array.from({ length: ITEMS_PER_PAGE - pagedItems.length }).map(
            (_, index) => (
              <div
                key={`placeholder-${index}`}
                className="relative w-full h-full max-w-[120px] max-h-[140px] flex flex-col items-center border border-white/10 shadow-2xl rounded-md overflow-hidden"
              >
                <div className="w-full aspect-square bg-white/20 flex justify-center items-center">
                  <span className="text-iconLg font-symbols text-white">8</span>
                </div>
                <div className="w-full text-center text-white text-[1rem] mt-1 break-words px-1">
                  slot {gameData.bag.length - index + 1}
                </div>
              </div>
            )
          )}
        </div>
      </div>
      {pageItems.length > ITEMS_PER_PAGE && (
        <div className="">
          <ToggleLeft activeMyth={4} handleClick={handleLeft} />
          <ToggleRight activeMyth={4} handleClick={handleRight} />
        </div>
      )}
    </div>
  );
};

export default Tavern;
