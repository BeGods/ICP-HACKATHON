import React, { useState, useContext } from "react";
import GridItem from "../../components/ror/GridItem";
import RoRHeader from "../../components/layouts/Header";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import ArtifactCrd from "../../components/Cards/Reward/ArtiFactCrd";
import { gameItems } from "../../utils/gameItems";

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

const Tavern = () => {
  const { gameData, setShowCard } = useContext(RorContext);
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

  return (
    <div className="w-full h-full">
      <RoRHeader CenterChild={<CenterChild />} />
      <div className="w-[80%] mt-[20dvh] h-[65dvh] mx-auto grid grid-cols-3 gap-x-1">
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
                className={`w-[100%] ${
                  items.length === 0 ? "text-white/50" : "text-white"
                } relative flex flex-col gap-1 justify-center items-center aspect-square max-w-[120px] bg-gray-100/10 border border-white/10 shadow-2xl rounded-md overflow-auto`}
              >
                {index == 2 ? (
                  <div className="text-booster">zz</div>
                ) : (
                  <div className="text-booster font-symbols ">{itm}</div>
                )}
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

export default Tavern;
