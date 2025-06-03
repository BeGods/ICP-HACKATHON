import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/Layouts/GridItem";
import { RorContext } from "../../context/context";
import { updateVaultData } from "../../utils/api.ror";
import RoRHeader from "../../components/Layouts/Header";
import RelicRwrdCrd from "../../components/Cards/Relics/RelicRwrdCrd";
import ShareButton from "../../components/Buttons/ShareBtn";
import RoRBtn from "../../components/Buttons/RoRBtn";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { isCoin } from "../../helpers/game.helper";

const CenterChild = ({ assets, isBag }) => {
  return (
    <div
      className={`
            flex cursor-pointer justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    >
      <img src={assets.items.bag} alt="bag" className="rounded-full" />
      <div className="absolute -bottom-5 text-[1.5rem] uppercase glow-text-black font-bold text-white">
        {isBag ? "bag" : "pouch"}
      </div>
    </div>
  );
};

const Bag = (props) => {
  const { gameData, authToken, setShowCard, assets, isTgMobile, setMinimize } =
    useContext(RorContext);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [isBag, setIsBag] = useState(true);
  const dropZoneRef = useRef(null);
  const pouchItems =
    gameData.pouch
      .filter(
        (itm) =>
          /common02/?.test(itm) ||
          isCoin(itm) === true ||
          itm?.includes("potion")
      )
      .map((itm, idx) => {
        return {
          _id: `daskjfjk${idx}`,
          itemId: itm,
          fragmentId: 0,
          isComplete: true,
        };
      }) ?? [];
  const currItems = isBag ? [...gameData.bag] : pouchItems;
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(currItems.length / itemsPerPage);

  const paginatedItems = currItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageLeft = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handlePageRight = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handleAddToVault = async () => {
    try {
      const response = await updateVaultData(authToken, itemToTransfer);
      setItemsToTransfer([]);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setMinimize(1);
    return () => {
      if (itemToTransfer.length != 0) {
        (async () => handleAddToVault())();
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <RoRHeader
        CenterChild={
          <CenterChild
            isBag={isBag}
            assets={assets}
            dropZoneRef={dropZoneRef}
            isDropActive={
              gameData.bank.isVaultActive && gameData.bank.vault.length < 27
            }
          />
        }
      />

      <div
        className={`${
          isTgMobile ? "tg-container-height" : "browser-container-height"
        } flex flex-col items-center justify-center`}
      >
        <div className={`grid-width h-[55dvh] mt-[7dvh] mx-auto relative p-1`}>
          <div
            className={`grid grid-cols-3  gap-x-1.5 w-full h-full place-items-center place-content-between`}
          >
            {/* bag slots */}
            {paginatedItems.map((item) => (
              <div
                key={item._id}
                className="relative w-full h-full flex flex-col justify-center items-center shadow-2xl rounded-md overflow-hidden"
              >
                <GridItem
                  hideBg={true}
                  handleClick={() => {
                    setShowCard(
                      <RelicRwrdCrd
                        showBoots={false}
                        claimBoots={() => {}}
                        itemId={item.itemId}
                        isChar={false}
                        fragmentId={item.fragmentId}
                        isComplete={item.isComplete}
                        ButtonBack={
                          <ShareButton
                            isShared={false}
                            isInfo={false}
                            handleClaim={() => {}}
                            activeMyth={1}
                            isCoin={true}
                            link={"sdjkfds"}
                          />
                        }
                        ButtonFront={<></>}
                      />
                    );
                  }}
                  itemObj={item}
                  scaleIcon={false}
                  itemsWithAllFrags={gameData.bag.map((item) => item.itemId)}
                />
              </div>
            ))}

            {/* empty slots */}
            {Array.from({ length: 9 - paginatedItems.length }).map(
              (_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="relative w-full max-w-[120px] flex flex-col opacity-60 items-center rounded-md overflow-hidden shadow-2xl"
                >
                  <div
                    className={`flex flex-col rounded-md border items-center w-full`}
                  >
                    <div className="w-full aspect-square bg-white/20 flex justify-center items-center">
                      <span className="text-iconLg font-symbols text-white">
                        8
                      </span>
                    </div>
                    <div className="w-full text-white text-sm bg-black/50 rounded-b-md uppercase text-center px-1 py-1.5 leading-tight truncate">
                      slot {paginatedItems.length + index + 1}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* toggle */}
      <div className="w-full flex justify-center items-center absolute bottom-[2dvh]">
        <div className={`w-full flex-col flex justify-center items-center`}>
          <div
            className={`flex z-50 transition-all p-0.5  duration-1000 bg-white mx-auto border border-black w-[60%] rounded-full`}
          >
            <div
              onClick={() => setIsBag((prev) => !prev)}
              className={`flex font-symbols justify-center items-center h-full  ${
                isBag ? "bg-black text-white" : "text-black"
              } font-symbols rounded-full w-1/2  py-1 text-[24px]`}
            >
              8
            </div>
            <div
              onClick={() => setIsBag((prev) => !prev)}
              className={`flex font-symbols justify-center items-center h-full ${
                !isBag ? "bg-black text-white" : "text-black"
              } uppercase rounded-full w-1/2 py-1 text-[24px]`}
            >
              ,
            </div>
          </div>
        </div>
      </div>
      {currItems.length > 9 && (
        <>
          <ToggleLeft
            positionBottom={true}
            activeMyth={4}
            handleClick={handlePageLeft}
          />
          <ToggleRight
            positionBottom={true}
            activeMyth={4}
            handleClick={handlePageRight}
          />
        </>
      )}
    </div>
  );
};

export default Bag;
