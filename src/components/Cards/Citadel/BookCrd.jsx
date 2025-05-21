import React from "react";
import HTMLFlipBook from "react-pageflip";
import { gameItems } from "../../../utils/gameItems";

const BookCrd = ({ buttonColor, myth, assets, handleClose }) => {
  let relicItems = gameItems.filter(
    (itm) => itm.id?.includes("relic") && itm.id?.includes(myth)
  );
  relicItems = [
    { id: "", name: "", coins: " ", fragments: [], orbs: "celtc" },
    ...relicItems,
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col gap-y-2 justify-center items-center bg-black bg-opacity-85 backdrop-blur-[3px]">
      <div className="w-4/5 aspect-[4/5]">
        <HTMLFlipBook
          width={300}
          height={500}
          size="stretch"
          minWidth={300}
          maxWidth={600}
          minHeight={400}
          maxHeight={800}
          usePortrait={true}
          autoSize={true}
          className="w-full h-full"
        >
          {relicItems.map((page, idx) => {
            const code = page.id?.replace("relic", "char");
            console.log(code);

            return (
              <div className="w-full h-full">
                {idx == 0 ? (
                  <div
                    key={0}
                    className="relative w-full h-full text-white rounded-2xl"
                  >
                    <img
                      src={assets.uxui.bgInfo}
                      alt={`page ${idx}`}
                      className="rounded-2xl h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-2xl font-bold text-card">
                      <img
                        src={assets.symbols[myth]}
                        alt="symbol"
                        className="opacity-60 symbol-svg w-3/4"
                      />
                      <h1 className="uppercase text-num mt-8">{myth}</h1>
                    </div>
                  </div>
                ) : (
                  <div
                    key={idx}
                    className="relative w-full h-full text-white rounded-2xl"
                  >
                    <img
                      src={`https://media.publit.io/file/BeGods/mythopedia/320px-${code}-info-page.jpg`}
                      alt={`page ${idx}`}
                      className="rounded-2xl h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end justify-center p-2 text-2xl font-bold text-card">
                      Page {idx}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </HTMLFlipBook>
      </div>
      <div
        onClick={handleClose}
        className="flex justify-center items-center relative h-fit"
      >
        <img src={assets.buttons[buttonColor]?.on} alt="button" />
        <div className="absolute z-50 uppercase text-white opacity-80 text-black-contour font-fof font-semibold text-[1.75rem] mt-[2px]">
          Close
        </div>
      </div>
    </div>
  );
};

export default BookCrd;
