import React, { useContext, useState } from "react";
import { RorContext } from "../../context/context";
import { activateVault } from "../../utils/api.ror";
import MiscCard from "./MiscCard";
import RoRBtn from "./RoRBtn";
import { toast } from "react-toastify";

const CitadelItem = ({ data, index }) => {
  const { setSection, gameData, setGameData, setShowCard, authToken } =
    useContext(RorContext);
  const [isClicked, setIsClicked] = useState(false);

  const handleActivateBank = async () => {
    try {
      const response = await activateVault(authToken);
      setShowCard(null);
      setGameData((prev) => {
        return {
          ...prev,
          bank: {
            ...prev.bank,
            isVaultActive: true,
          },
        };
      });
      setSection(1);
      console.log(response);
      toast.success("vault activated");
    } catch (error) {
      console.log(error);
      setShowCard(null);
      toast.error("insufficient gobcoins");
    }
  };

  return (
    <div
      onClick={() => {
        if (index === 2 && !gameData.bank.isVaultActive) {
          setShowCard(
            <MiscCard
              handleClick={handleActivateBank}
              Button={<RoRBtn handleClick={handleActivateBank} />}
            />
          );
        } else {
          setSection(data.redirect);
        }
      }}
      className={`flex gap-1 border text-white ${
        isClicked ? `glow-button-white` : ""
      } rounded-primary h-[90px] w-full bg-glass-black p-[15px]`}
      onMouseDown={() => {
        setIsClicked(true);
      }}
      onMouseUp={() => {
        setIsClicked(false);
      }}
      onMouseLeave={() => {
        setIsClicked(false);
      }}
      onTouchStart={() => {
        setIsClicked(true);
      }}
      onTouchEnd={() => {
        setIsClicked(false);
      }}
      onTouchCancel={() => {
        setIsClicked(false);
      }}
    >
      <div>
        <div className={`font-symbols  text-booster p-0 -mt-2 mr-2`}>2</div>
      </div>
      <div className={`flex flex-col flex-grow justify-center -ml-1`}>
        <h1 className="text-tertiary uppercase">{data.title}</h1>
        <h2 className="text-tertiary">{data.description}</h2>
      </div>
    </div>
  );
};

export default CitadelItem;
