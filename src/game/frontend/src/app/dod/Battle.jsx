import BgLayout from "../../components/Layouts/BgLayout";
import { useStore } from "../../store/useStore";
import useDragAndDrop from "../../hooks/useDragDrop";
import { BattleCards, GridCrdCopy } from "../../components/Cards/DoD/GridCard";
import { useEffect, useState } from "react";
import characters from "../../assets/characters.json";
import { PrimaryBtn } from "../../components/Buttons/PrimaryBtn";
import { ToggleBack } from "../../components/Common/SectionToggles";
import { fetchExplore, updateBattleResult } from "../../utils/api.dod";
import VsBattleIntro from "../../components/Cards/DoD/BattleVs";
import EquipCrd from "../../components/Cards/DoD/EquipCrd";
import DrawCards from "../../components/Fx/DrawCrd";
import BattleResultCrd from "../../components/Cards/DoD/BattleResultCrd";

const Arena = ({ setShowBattle }) => {
  const authToken = useStore((c) => c.authToken);
  const gameData = useStore((c) => c.gameData);
  const setGameData = useStore((c) => c.setGameData);
  const setShowCard = useStore((c) => c.setShowCard);
  const [boxItems, setBoxItems] = useState([null, null, null]);

  const filteredDrawnCards = gameData.drawnCards.filter(
    (crd) =>
      crd.cardId.includes("char") ||
      crd.cardId.includes("relics") ||
      crd.cardId.includes("quest")
  );

  const handleDropAction = () => {
    if (!draggedItem) return;

    setBoxItems((prev) => {
      const newBoxes = [...prev];

      const nextIndex = gameData.battleHistory.length;

      if (nextIndex < newBoxes.length && !newBoxes[nextIndex]) {
        newBoxes[nextIndex] = draggedItem;
      }

      return newBoxes;
    });

    // remove from drawnCards
    setGameData((prevData) => {
      const newDrawnCards = [...prevData.drawnCards];
      const index = newDrawnCards.findIndex(
        (crd) => crd.cardId === draggedItem.cardId
      );

      if (index !== -1) {
        newDrawnCards.splice(index, 1);
      }

      return {
        ...prevData,
        drawnCards: newDrawnCards,
      };
    });
  };

  const {
    boxRefs,
    copyPosition,
    draggedItem,
    isTouched,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useDragAndDrop({ handleDropAction });

  const handleRevert = () => {
    const unresolvedBox = boxItems.filter(
      (bx) => bx && !bx?.isBattleResolved
    )[0];

    setBoxItems((prev) =>
      prev.map((bx) => (bx && !bx.isBattleResolved ? null : bx))
    );

    setGameData((prev) => {
      const updatedDrawnCards = [...prev.drawnCards, unresolvedBox];

      return {
        ...prev,
        drawnCards: updatedDrawnCards,
      };
    });
  };

  const handleResolveBattle = async () => {
    try {
      const unresolvedBox = boxItems.filter(
        (bx) => bx && !bx?.isBattleResolved
      )[0];

      const updatedBattleData = await updateBattleResult(
        authToken,
        unresolvedBox.cardId
      );

      setShowBattle(updatedBattleData);

      console.log(updatedBattleData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className={`absolute w-screen top-0`}>
        <div className="flex relative text-gold text-black-contour text-[3rem] text-center flex-col  gap-[5px] pt-headTop mt-10">
          BATTLE
        </div>
      </div>
      <div className="center-section">
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2].map((bt, idx) => {
            const boxDetails = boxItems[idx];
            const resolvedBattle = gameData.battleHistory[idx];
            const parts = boxDetails?.cardId.split(".") ?? [];
            const myth = parts[0];
            const code = parts[2];
            let name;

            if (boxDetails) {
              name = characters[myth]?.[code]?.name;
            }

            return (
              <div className="flex flex-col relative" key={idx}>
                <div
                  ref={boxRefs[idx]}
                  className={` ${
                    resolvedBattle?.roundWinner === "bot" ||
                    resolvedBattle?.roundWinner === "draw"
                      ? "grayscale"
                      : resolvedBattle?.roundWinner === "user"
                      ? `glow-hexagon-gold`
                      : boxDetails
                      ? `glow-hexagon-${myth}`
                      : ""
                  }`}
                >
                  <img src="/assets/hexagon.png" alt={`hex-${idx}`} />
                </div>
                <div className="w-full flex flex-col justify-center items-center uppercase text-white text-black-contour -mb-14 absolute bottom-0">
                  <div>{name}</div>
                  <div>
                    {resolvedBattle ? (
                      <div>
                        {resolvedBattle.roundWinner === "bot"
                          ? "lost"
                          : resolvedBattle.roundWinner === "user"
                          ? "won"
                          : "draw"}
                      </div>
                    ) : (
                      <div>
                        {boxDetails && (
                          <div className="flex gap-x-2">
                            <h2>A: {boxDetails?.attack}</h2>
                            <h2>D: {boxDetails?.defense}</h2>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* dragged copy */}
      {isTouched && draggedItem && (
        <GridCrdCopy copyPosition={copyPosition} draggedItem={draggedItem} />
      )}

      {/* bottom - cards & button */}
      {boxItems.length > 0 &&
      boxItems.filter((bx) => bx && bx.isBattleResolved !== true).length ? (
        <>
          <div className="absolute flex justify-center w-full bottom-0 mb-safeBottom">
            <PrimaryBtn
              mode="default"
              customMyth={4}
              centerContent={"5"}
              onClick={handleResolveBattle}
            />
          </div>
          <ToggleBack
            isClose={true}
            minimize={2}
            handleClick={handleRevert}
            activeMyth={8}
          />
        </>
      ) : (
        <div className="absolute bottom-0 mb-safeBottom w-full flex justify-center">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${Math.max(
                filteredDrawnCards.length,
                1
              )}, minmax(0, 1fr))`,
            }}
          >
            {filteredDrawnCards.map((card, idx) => (
              <div
                key={card.cardId}
                onPointerDown={(e) => {
                  if (card.cardId.includes("char")) {
                    if (card.isCurrentlyInHand) {
                      handleTouchStart(e, card);
                    } else {
                    }
                  }
                }}
                onClick={() => {
                  if (card.cardId.includes("char")) {
                    setShowCard(<EquipCrd card={card} />);
                  }
                }}
                onPointerMove={handleTouchMove}
                onPointerUp={handleTouchEnd}
                className="relative z-50"
              >
                <BattleCards key={idx} card={card} idx={idx} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Battle = (props) => {
  const authToken = useStore((c) => c.authToken);
  const setSection = useStore((c) => c.setSection);
  const showEffect = useStore((c) => c.showEffect);
  const gameData = useStore((c) => c.gameData);
  const [showBattle, setShowBattle] = useState(null);

  const handleExplore = async () => {
    try {
      const battleData = await fetchExplore(authToken);
      console.log(battleData);

      if (battleData.user) {
        setShowBattle(battleData);
      } else {
        <BattleResultCrd status={1} data={battleData} />;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (gameData.gamePhase === "idle") {
      setSection(0);
    } else if (gameData.gamePhase === "explore") {
      (async () => handleExplore(authToken))();
    }
  }, [gameData.gamePhase]);

  return (
    <BgLayout>
      {showEffect ? (
        <DrawCards />
      ) : showBattle ? (
        <VsBattleIntro
          battleData={showBattle}
          endBattle={() => setShowBattle(null)}
        />
      ) : (
        <Arena setShowBattle={(dt) => setShowBattle(dt)} />
      )}
    </BgLayout>
  );
};

export default Battle;
