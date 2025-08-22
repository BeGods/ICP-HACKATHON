import { useState } from "react";

export const GridCrdCopy = ({ copyPosition, draggedItem }) => {
  const [imgError, setImgError] = useState(false);
  const parts = draggedItem.cardId.split(".");
  const myth = parts[0];
  const type = parts[1];
  const code = parts[2];

  return (
    <div
      style={{
        position: "absolute",
        top: `${copyPosition.y}px`,
        left: `${copyPosition.x}px`,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <div className="relative select-none aspect-[360/504] w-[8rem] overflow-hidden">
        {!imgError ? (
          <img
            src={`/assets/chars/240px-${draggedItem.cardId}.png`}
            alt="active card"
            className="slot-image"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`placeholder-card flex items-center justify-center bg-${myth}-primary text-black rounded-md w-full h-full`}
          >
            {type} <br />
            {code}
          </div>
        )}
      </div>
    </div>
  );
};

export const BattleCards = ({ card, idx, isNotSlot }) => {
  const [imgError, setImgError] = useState(false);

  if (!card || !card.cardId) {
    return null;
  }

  const parts = card?.cardId?.split(".");
  const myth = parts[0];
  const type = parts[1];
  const code = parts[2];

  return (
    <div
      key={idx}
      className={`${
        isNotSlot ? "h-full" : "active-card-slot"
      } select-none touch-none border border-dashed ${
        card?.isCurrentlyInHand ? `border-${myth}-primary` : "border-white"
      }`}
    >
      {!imgError ? (
        <div
          className={`placeholder-card relative flex items-center justify-center bg-${myth}-primary text-black rounded-md w-full h-full`}
        >
          <img
            src={`/assets/${type == "char" ? "chars" : "items"}/240px-${
              card.cardId
            }.png`}
            alt="active card"
            className="slot-image"
            onError={() => setImgError(true)}
          />
          <div className="flex  px-2 absolute bottom-0 text-white text-sm mt-1 justify-between w-full">
            <div className="transition-all duration-500 text-black-contour">
              {card.attack}
            </div>
            <div className="transition-all duration-500 text-black-contour">
              {card.defense}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`placeholder-card relative flex items-center justify-center bg-${myth}-primary text-black rounded-md w-full h-full`}
        >
          <div>
            {type} <br />
            {code}
          </div>
          <div className="flex  px-2 absolute bottom-0 text-white text-sm mt-1 justify-between w-full">
            <div className="transition-all duration-500 text-black-contour">
              {card.attack}
            </div>
            <div className="transition-all duration-500 text-black-contour">
              {card.defense}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
