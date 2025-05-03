import React, { useState, useRef, useContext, useEffect } from "react";
import GridItem from "../../components/ror/GridItem";
import { RorContext } from "../../context/context";
import { updateVaultData } from "../../utils/api.ror";
import RoRHeader from "../../components/layouts/Header";
import RelicRwrdCrd from "../../components/Cards/Reward/RelicRwrdCrd";
import ShareButton from "../../components/Buttons/ShareBtn";
import RoRBtn from "../../components/ror/RoRBtn";

const CenterChild = () => {
  return (
    <div
      className={`
            flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2`}
    ></div>
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
      <div className="w-[80%] mt-[18dvh] h-[60dvh] mx-auto">
        <div className="grid grid-cols-3 auto-rows-fr gap-2 w-full h-full place-items-center">
          {[...gameData.bag].map((item) => (
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
                      ButtonFront={
                        <RoRBtn
                          itemId={item.itemId}
                          isNotPay={true}
                          message={"Bag"}
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

          {Array.from({ length: 9 - gameData.bag.length }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="relative w-full max-w-[120px] flex flex-col opacity-50 items-center rounded-md overflow-hidden shadow-2xl"
            >
              <div
                className={`flex flex-col rounded-md border items-center w-full`}
              >
                <div className="w-full aspect-square bg-white/20 flex justify-center items-center">
                  <span className="text-iconLg font-symbols text-white">8</span>
                </div>
                <div className="w-full text-white text-sm text-center px-1 py-1 leading-tight truncate">
                  slot{gameData.bag.length - index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bag;
