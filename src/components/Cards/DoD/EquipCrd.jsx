import { useState } from "react";
import { CardWrap } from "../../Layouts/Wrapper";
import { PrimaryBtn } from "../../Buttons/PrimaryBtn";
import { useStore } from "../../../store/useStore";
import { updateGodStatus, updateWeaponStatus } from "../../../utils/api.dod";
import OverlayLayout from "../../Layouts/OverlayLayout";
import { Check } from "lucide-react";
import {
  fetchCharDetails,
  fetchRelicDetails,
  handleSignMathOpr,
} from "../../../utils/fetchDetails";
import { BattleCards } from "./GridCard";
import { mythSections } from "../../../utils/constants.fof";

const EquipCrd = ({ card }) => {
  const authToken = useStore((c) => c.authToken);
  const gameData = useStore((c) => c.gameData);
  const setShowCard = useStore((c) => c.setShowCard);
  const [selectedRelic, setSelectedRelic] = useState(null);
  const setGameData = useStore((c) => c.setGameData);
  const setGameStats = useStore((c) => c.setGameStats);
  const [imgError, setImgError] = useState(false);
  const parts = card?.cardId.split(".");
  const myth = parts[0];
  const type = parts[1];
  const code = parts[2];

  const availableRelics = gameData.drawnCards.filter((crd) =>
    crd.cardId.includes("relic")
  );

  const handleActivateGod = async (charId) => {
    try {
      const payMethod = 0;
      if (!charId) {
        console.log("Invalid charId");
      }
      await updateGodStatus(authToken, charId);
      const charDetails = fetchCharDetails(charId);

      card.isCurrentlyInHand = true;

      setGameData((prev) => {
        const updatedDrawnCards = prev.drawnCards.map((crd) => {
          if (crd.cardId === charId) {
            return {
              ...crd,
              isCurrentlyInHand: true,
            };
          }
          return crd;
        });

        return {
          ...prev,
          gamePhase: "battle",
          drawnCards: updatedDrawnCards,
        };
      });

      if (payMethod === 0) {
        setGameStats((prev) => {
          return {
            gobcoin: prev.gobcoin - charDetails.coinBal,
          };
        });
      } else if (payMethod === 1) {
        setGameStats((prevData) => {
          const updatedData = {
            ...prevData,
            mythologies: prevData.mythologies.map((item) =>
              item.name === charDetails.orbBal.type
                ? {
                    ...item,
                    orbs: -charDetails.orbBal.amount,
                  }
                : item
            ),
          };

          return updatedData;
        });
      } else if (payMethod === 2) {
        setGameStats((prevData) => {
          const updatedData = {
            ...prevData,
            mythologies: prevData.mythologies.map((item) =>
              item.name === charDetails.orbBal.type
                ? {
                    ...item,
                    faith: -1,
                  }
                : item
            ),
          };

          return updatedData;
        });
      }

      if (availableRelics.length == 0) {
        setShowCard(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEquipRelic = async (charId, relicId) => {
    try {
      const payMethod = 0;
      if (!charId || !relicId) {
        console.log("Invalid charId or relicId");
      }
      await updateWeaponStatus(authToken, charId, relicId);
      const charDetails = fetchCharDetails(charId);
      const relicDetails = fetchRelicDetails(relicId);

      // update AD stats
      setGameData((prev) => {
        let updatedDrawnCards = prev.drawnCards.map((crd) => {
          if (crd.cardId === charId) {
            let updatedCharDetails = { ...crd };

            updatedCharDetails.attack = handleSignMathOpr(
              updatedCharDetails.attack,
              charDetails.myth === relicDetails.myth
                ? relicDetails.atk_on
                : relicDetails.atk_off
            );

            updatedCharDetails.defense = handleSignMathOpr(
              updatedCharDetails.defense,
              charDetails.myth === relicDetails.myth
                ? relicDetails.def_on
                : relicDetails.def_off
            );

            // bonus if weapon matches
            if (updatedCharDetails.weaponName === relicDetails.name) {
              updatedCharDetails.attack = handleSignMathOpr(
                updatedCharDetails.attack,
                relicDetails.atk_bonus
              );
              updatedCharDetails.defense = handleSignMathOpr(
                updatedCharDetails.defense,
                relicDetails.def_bonus
              );
            }

            return {
              ...updatedCharDetails,
              attachmentId: relicDetails.cardId,
            };
          }

          return crd;
        });

        return {
          ...prev,
          gamePhase: "battle",
          drawnCards: updatedDrawnCards,
        };
      });

      if (payMethod === 0) {
        setGameStats((prev) => {
          return {
            gobcoin: prev.gobcoin - relicDetails.coins,
          };
        });
      } else if (payMethod === 1) {
        if (mythSections.includes(relicDetails.orbType)) {
          setGameStats((prevData) => {
            console.log(prevData);

            const updatedData = {
              ...prevData,
              mythologies: prevData.mythologies.map((item) =>
                item.name === charDetails.orbType
                  ? {
                      ...item,
                      orbs: -relicDetails.orbAmt,
                    }
                  : item
              ),
            };

            return updatedData;
          });
        } else if (relicDetails.orbType === "white aether") {
          setGameStats((prevData) => {
            const updatedData = {
              ...prevData,
              whiteOrbs: -relicDetails.orbAmt,
            };

            return updatedData;
          });
        } else if (relicDetails.orbType === "black aether") {
          setGameStats((prevData) => {
            const updatedData = {
              ...prevData,
              blackOrbs: -relicDetails.orbAmt,
            };

            return updatedData;
          });
        }
      }
      setShowCard(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectRelic = (relic) => {
    const relicDetails = fetchRelicDetails(relic.cardId);

    setSelectedRelic(relicDetails);
  };

  const handleBack = () => {
    if (selectedRelic) {
      setSelectedRelic(null);
    } else {
      setShowCard(null);
    }
  };

  const isInHand = card?.isCurrentlyInHand;

  return (
    <OverlayLayout
      handleBack={handleBack}
      customBg={`https://media.publit.io/file/BeGods/locations/1280px-ror.${gameData.location}-wide.jpg`}
    >
      <div className="center-section">
        <div className="relative card-width rounded-lg shadow-lg flex flex-col">
          <CardWrap
            Front={
              <div className="card-shadow-black">
                {!imgError ? (
                  <div
                    className={`placeholder-card relative card-width flex items-center justify-center bg-${myth}-primary text-black rounded-md w-full h-full`}
                  >
                    <img
                      src={`/assets/chars/240px-${card?.cardId}.png`}
                      alt="active card"
                      className="slot-image"
                      onError={() => setImgError(true)}
                    />
                    <div className="flex absolute px-2 bottom-0 text-white text-xl mt-1 justify-between w-full">
                      <div className="transition-all duration-500 text-black-contour">
                        A: {card?.attack || 1} {selectedRelic ? "+1" : null}
                      </div>
                      <div className="transition-all duration-500 text-black-contour">
                        D: {card?.defense || 1} {selectedRelic ? "+1" : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`placeholder-card relative card-width flex items-center justify-center bg-${myth}-primary text-black rounded-md w-full h-full`}
                  >
                    <div>
                      {type} <br /> {code}
                    </div>
                    <div className="flex absolute px-2 bottom-0 text-white text-xl mt-1 justify-between w-full">
                      <div className="transition-all duration-500 text-black-contour">
                        A: {card?.attack || 1} {selectedRelic ? "+1" : null}
                      </div>
                      <div className="transition-all duration-500 text-black-contour">
                        D: {card?.defense || 1} {selectedRelic ? "+1" : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            }
            Back={
              <img
                src={"/assets/chars/240px-celtic.char.C06.png"}
                alt="card"
                className="w-full h-full mx-auto rounded-[15px]"
              />
            }
          />
        </div>
      </div>

      <div className="absolute flex justify-center w-full bottom-0 mb-safeBottom">
        {!isInHand ? (
          <PrimaryBtn
            mode="default"
            centerContent={<Check />}
            customMyth={4}
            onClick={() => {
              handleActivateGod(card.cardId);
            }}
          />
        ) : selectedRelic ? (
          <PrimaryBtn
            mode="default"
            centerContent={<Check />}
            customMyth={4}
            onClick={() => {
              handleEquipRelic(card.cardId, selectedRelic.cardId);
            }}
          />
        ) : !card.attachmentId && availableRelics.length > 0 ? (
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${availableRelics.length}, minmax(0, 1fr))`,
            }}
          >
            {availableRelics.map((relic, idx) => (
              <div
                key={relic.cardId}
                onClick={() => handleSelectRelic(relic)}
                className="relative z-50"
              >
                <BattleCards card={relic} idx={idx} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </OverlayLayout>
  );
};

export default EquipCrd;
