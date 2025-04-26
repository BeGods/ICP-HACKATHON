import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import RoRHeader from "../../components/layouts/Header";
import { gameItems } from "../../utils/gameItems";
import { RorContext } from "../../context/context";
import PotionCard from "../../components/ror/PotionCrd";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";

const CenterChild = ({}) => {
  return (
    <div
      style={{
        backgroundImage: `url(/assets/240px-gemologist_head.png)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className={`
            flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    ></div>
  );
};

const Potions = (props) => {
  const { setShowCard } = useContext(RorContext);
  const filteredItems = gameItems.filter((item) => item.id.includes("potion"));
  const potions = filteredItems.map((item) => ({
    ...item,
    itemId: item.id,
    fragmentId: 0,
  }));
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(potions.length / itemsPerPage);

  const paginatedVaultItems = potions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageLeft = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handlePageRight = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <div className="w-full h-full">
      <RoRHeader CenterChild={<CenterChild />} />
      <div className="w-[80%]  mt-[20dvh] h-[65dvh] mx-auto grid grid-cols-3 gap-x-1">
        {paginatedVaultItems.map((item) => (
          <div key={item.itemId}>
            <GridItem
              handleClick={() => {
                setShowCard(<PotionCard potion={item.itemId} />);
              }}
              itemObj={item}
              itemsWithAllFrags={potions.map((item) => item.itemId)}
            />
          </div>
        ))}
        {Array.from({ length: 9 - paginatedVaultItems.length }).map(
          (_, index) => (
            <div
              key={`placeholder-${index}`}
              className="relative h-[120px] w-[120px] overflow-hidden"
            ></div>
          )
        )}
      </div>
      {potions.length > 9 && (
        <>
          <ToggleLeft activeMyth={4} handleClick={handlePageLeft} />
          <ToggleRight activeMyth={4} handleClick={handlePageRight} />
        </>
      )}
    </div>
  );
};

export default Potions;
