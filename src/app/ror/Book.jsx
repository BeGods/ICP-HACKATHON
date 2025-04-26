import React, { useState, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import RoRHeader from "../../components/layouts/Header";
import { gameItems } from "../../utils/gameItems";

import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import ArtifactCrd from "../../components/Cards/Reward/ArtiFactCrd";
import DefaultBtn from "../../components/Buttons/DefaultBtn";
import RelicRwrdCrd from "../../components/Cards/Reward/RelicRwrdCrd";
import { hideBackButton, toggleBackButton } from "../../utils/teleBackButton";

const tele = window.Telegram?.WebApp;

const CenterChild = () => {
  return (
    <div
      style={{
        backgroundImage: `url('/assets/240px-librarian_head.jpg')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2"
    ></div>
  );
};

const Book = () => {
  const { gameData, setShowCard, setShiftBg } = useContext(RorContext);
  const [showItems, setShowItems] = useState(null);
  const bookItems = gameData.pouch.filter((item) =>
    item.includes("artifact.starter10")
  );
  const mythItems = gameItems.filter(
    (item) =>
      item.id.includes(showItems) && !item.id.includes("artifact.starter10")
  );
  const books = bookItems.map((item) => ({
    ...item,
    id: item,
    fragmentId: 0,
    isComplete: true,
  }));
  const items = showItems ? mythItems : books;
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
    setPage((prev) => {
      const next = (prev - 1 + totalPages) % totalPages;

      if (next === 0) {
        setShiftBg(50);
      } else {
        setShiftBg((bg) => bg - 10);
      }

      return next;
    });
  };

  const handleRight = () => {
    setPage((prev) => {
      const next = (prev + 1) % totalPages;
      setShiftBg(
        (bg) => bg + (prev === totalPages - 1 ? -(totalPages - 1) : 1) * 10
      );
      return next;
    });
  };

  const pagedItems = pageItems.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (showItems) {
      (async () =>
        await toggleBackButton(tele, () => {
          setShowItems(null);
        }))();
    } else {
      (async () => await hideBackButton(tele))();
    }
  }, [showItems]);

  return (
    <div className="w-full h-full">
      <RoRHeader CenterChild={<CenterChild />} />
      <div className="w-[80%] mt-[20dvh] h-[65dvh] mx-auto grid grid-cols-3 gap-x-1">
        {!showItems &&
          ["+", "*", "Y"].map((itm, index) => {
            const books =
              gameItems
                .filter((itm) => itm.id.includes("artifact.starter10"))
                .filter((itm) => !gameData.pouch.includes(itm.id)) ?? [];
            const maps =
              gameItems
                .filter((itm) => itm.id.includes("artifact.common03"))
                .filter((itm) => !gameData.pouch.includes(itm.id)) ?? [];
            const statues =
              gameItems
                .filter((itm) => itm.id.includes("artifact.starter01"))
                .filter((itm) => !gameData.pouch.includes(itm.id)) ?? [];

            const items =
              index == 0
                ? books
                : index === 1
                ? maps
                : index == 2
                ? statues
                : null;

            console.log(books, maps, statues);

            return (
              <div
                onClick={() => {
                  {
                    items.length !== 0 &&
                      setShowCard(
                        <ArtifactCrd
                          items={items}
                          category={index}
                          handleClick={(myth) => setShowItems(myth)}
                        />
                      );
                  }
                }}
                key={`box-${index}`}
                className={`w-[100%] ${
                  items.length === 0 ? "text-white/50" : "text-white"
                } relative flex flex-col gap-1 justify-center items-center aspect-square max-w-[120px] bg-gray-100/10 border border-white/10 shadow-2xl rounded-md overflow-auto`}
              >
                <div className="text-booster font-symbols ">{itm}</div>
              </div>
            );
          })}
        {pagedItems.map((item) => (
          <div key={item.itemId}>
            <GridItem
              isInfo={
                showItems &&
                !(
                  gameData.pouch.includes(item.itemId) ||
                  gameData.bag.some((itm) => itm.itemId === item.itemId) ||
                  gameData.bank.vault.some((itm) => itm.itemId === item.itemId)
                )
              }
              handleClick={() => {
                if (showItems) {
                  setShowCard(
                    <RelicRwrdCrd
                      maskOff={true}
                      showBoots={false}
                      claimBoots={() => {}}
                      itemId={item.itemId}
                      isChar={false}
                      fragmentId={0}
                      isComplete={
                        gameData.pouch.includes(item.itemId) ||
                        gameData.bag.some(
                          (itm) => itm.itemId === item.itemId
                        ) ||
                        gameData.bank.vault.some(
                          (itm) => itm.itemId === item.itemId
                        )
                      }
                      ButtonBack={<></>}
                      ButtonFront={
                        <DefaultBtn
                          message={2}
                          activeMyth={1}
                          handleClick={() => {
                            setShowCard(null);
                          }}
                        />
                      }
                    />
                  );
                } else {
                  const myth = item.itemId.split(".")[0];
                  setShowItems(myth);
                }
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
              className="relative h-[120px] w-[120px] overflow-hidden"
            ></div>
          )
        )}
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

export default Book;
