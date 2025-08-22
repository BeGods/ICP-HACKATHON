import { useState, useEffect } from "react";
import GridItem, { GridItemEmpty } from "../../components/Layouts/GridItem";
import { updateVaultData } from "../../utils/api.ror";
import RoRHeader from "../../components/Layouts/Header";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { isCoin } from "../../helpers/game.helper";
import BgLayout from "../../components/Layouts/BgLayout";
import { GridWrap, SecondaryFooter } from "../../components/Layouts/Wrapper";
import ItemCrd from "../../components/Cards/Relics/ItemsCrd";

const Bag = () => {
  const gameData = useStore((s) => s.gameData);
  const authToken = useStore((s) => s.authToken);
  const setShowCard = useStore((s) => s.setShowCard);
  const setSection = useStore((s) => s.setSection);
  const setMinimize = useStore((s) => s.setMinimize);

  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const [showGrid, setShowGrid] = useState(1);

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

  const vaultItems = gameData.bank.vault.flatMap(
    (vaultGroup) => vaultGroup.items
  );

  const currItems =
    showGrid == 0 ? pouchItems : showGrid == 2 ? vaultItems : [...gameData.bag];

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
    <BgLayout>
      <RoRHeader />
      <GridWrap>
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
                  <ItemCrd
                    mode="artifact"
                    src={item.itemId}
                    isComplete={item.isComplete}
                    fragmentId={item.fragmentId}
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
        {Array.from({ length: 9 - paginatedItems.length }).map((_, index) => (
          <GridItemEmpty icon={"8"} idx={index} />
        ))}
      </GridWrap>

      <SecondaryFooter
        items={[
          {
            icon: "8",
            label: "pouch",
            isHighlighted: showGrid == 0,
            handleClick: () => {
              setShowGrid(0);
            },
          },
          {
            icon: ",",
            label: "bag",
            isHighlighted: showGrid == 1,
            handleClick: () => {
              setShowGrid(1);
            },
          },
          {
            icon: ",",
            label: `vault`,
            isHighlighted: showGrid == 2,
            handleClick: () => {
              setShowGrid(2);
            },
          },
        ]}
        isGrid={true}
        id="bag"
      />

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
      <>
        <ToggleBack
          minimize={2}
          handleClick={() => {
            setSection(0);
            setMinimize(2);
          }}
          activeMyth={8}
        />
      </>
    </BgLayout>
  );
};

export default Bag;
