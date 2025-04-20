import React, { useState, useContext } from "react";
import GridItem from "../../components/ror/GridItem";
import RoRHeader from "../../components/layouts/Header";
import { gameItems } from "../../utils/gameItems";
import { RorContext } from "../../context/context";
import PotionCard from "../../components/ror/PotionCrd";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";

const CenterChild = () => {
  return (
    <div className="flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2"></div>
  );
};

const ITEMS_PER_PAGE = 9;

const Book = () => {
  const { setShowCard } = useContext(RorContext);
  const filteredItems = gameItems;
  const potions = filteredItems.map((item) => ({
    ...item,
    itemId: item.id,
    fragmentId: 0,
    isComplete: true,
  }));

  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(potions.length / ITEMS_PER_PAGE);

  const handleLeft = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleRight = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  const pagedItems = potions.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <div className="w-full h-full">
      <RoRHeader CenterChild={<CenterChild />} />
      <div className="w-[80%] mt-[20dvh] h-[65dvh] mx-auto grid grid-cols-3">
        {pagedItems.map((item) => (
          <div key={item.itemId}>
            <GridItem
              handleClick={() => {
                // setShowCard(<PotionCard potion={item.itemId} />);
              }}
              itemObj={item}
              itemsWithAllFrags={potions.map((item) => item.itemId)}
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

      {potions.length > ITEMS_PER_PAGE && (
        <>
          <ToggleLeft activeMyth={4} handleClick={handleLeft} />
          <ToggleRight activeMyth={4} handleClick={handleRight} />
        </>
      )}
    </div>
  );
};

export default Book;
