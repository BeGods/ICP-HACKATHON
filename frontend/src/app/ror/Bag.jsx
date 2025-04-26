import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import { RorContext } from "../../context/context";
import { updateVaultData } from "../../utils/api.ror";
import RoRHeader from "../../components/layouts/Header";
import RelicRwrdCrd from "../../components/Cards/Reward/RelicRwrdCrd";
import ShareButton from "../../components/Buttons/ShareBtn";
import DefaultBtn from "../../components/Buttons/DefaultBtn";

const CenterChild = ({ dropZoneRef, isDropActive }) => {
  return (
    <div
      ref={dropZoneRef}
      className={`
            flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    >
      {isDropActive ? "drop here" : "locked"}
    </div>
  );
};

const Bag = (props) => {
  const { gameData, authToken, setShowCard } = useContext(RorContext);
  const [itemToTransfer, setItemsToTransfer] = useState([]);
  const dropZoneRef = useRef(null);

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
            dropZoneRef={dropZoneRef}
            isDropActive={
              gameData.bank.isVaultActive && gameData.bank.vault.length < 27
            }
          />
        }
      />
      <div className="w-[80%]  mt-[20dvh] h-[65dvh] mx-auto grid grid-cols-3 gap-x-1">
        {gameData.bag.map((item) => (
          <div key={item._id}>
            <GridItem
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
              }}
              itemObj={item}
              scaleIcon={false}
              itemsWithAllFrags={gameData.bag.map((item) => item.itemId)}
            />
          </div>
        ))}
        {/* Invisble remaining  */}
        {Array.from({ length: 9 - gameData.bag.length }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="relative h-[120px] w-[120px] overflow-hidden"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Bag;
