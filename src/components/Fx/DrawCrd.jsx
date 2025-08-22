import React, { useState, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { BattleCards } from "../Cards/DoD/GridCard";

const DrawCards = () => {
  const [zoomedCard, setZoomedCard] = useState(null);
  const [viewedCards, setViewedCards] = useState([]);
  const [isZooming, setIsZooming] = useState(false);
  const [activeCards, setActiveCards] = useState([]);
  const [cardQueue, setCardQueue] = useState([]);
  const setShowEffect = useStore((c) => c.setShowEffect);

  const gameData = useStore((c) => c.gameData);

  const initialCards = gameData.drawnCards.map((crd) => {
    const isActive =
      crd.cardId.includes("quest") ||
      crd.cardId.includes("char") ||
      crd.cardId.includes("relic");

    return {
      ...crd,
      isActive,
    };
  });

  // Prepare queue of card indices to process
  useEffect(() => {
    setCardQueue(initialCards.map((_, i) => i).reverse());
  }, []);

  const dismissCard = (cardIndex) => {
    const currentCard = initialCards[cardIndex];

    if (currentCard.isActive) {
      setActiveCards((prev) => [...prev, currentCard]);
    }

    setViewedCards((prev) => [...prev, cardIndex]);
    setZoomedCard(null);
    setIsZooming(false);
  };

  // Automatic card zoom/dismiss loop
  useEffect(() => {
    if (cardQueue.length === 0 || isZooming) return;

    const interval = setInterval(() => {
      if (cardQueue.length === 0) {
        clearInterval(interval);
        return;
      }

      const nextCard = cardQueue[0];
      setZoomedCard(nextCard);
      setIsZooming(true);

      // After 2s, dismiss and remove from queue
      setTimeout(() => {
        dismissCard(nextCard);
        setCardQueue((prev) => prev.slice(1));
      }, 2000);
    }, 2000);

    return () => clearInterval(interval);
  }, [cardQueue, isZooming]);

  // ✅ Alert once all cards have been dismissed
  useEffect(() => {
    if (
      cardQueue.length === 0 &&
      viewedCards.length === initialCards.length &&
      initialCards.length > 0
    ) {
      setShowEffect(false);
    }
  }, [cardQueue, viewedCards, initialCards]);

  return (
    <div className="w-full h-screen relative">
      {initialCards.map((card, idx) => (
        <div
          key={idx}
          className={`card-draw ${zoomedCard === idx ? "zoomed" : ""} ${
            viewedCards.includes(idx)
              ? card.isActive
                ? "viewed-active"
                : "viewed"
              : ""
          }`}
        >
          <BattleCards isNotSlot={true} card={card} idx={idx} />
        </div>
      ))}

      <div className="absolute bottom-0 mb-safeBottom w-full flex justify-center">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${Math.max(
              activeCards.length,
              1
            )}, minmax(0, 1fr))`,
          }}
        >
          {activeCards.length > 0 ? (
            activeCards.map((card, idx) => (
              <div key={idx} className="active-card-slot">
                <BattleCards card={card} idx={idx} />
              </div>
            ))
          ) : (
            <div className="empty-slot"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawCards;
