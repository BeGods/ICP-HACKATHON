import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { gameItems } from "../../../utils/gameItems";
import { useTranslation } from "react-i18next";
import OverlayLayout from "../../Layouts/OverlayLayout";
import { ToggleLeft, ToggleRight } from "../../Common/SectionToggles";

const BookCrd = ({ myth, assets }) => {
  const flipBookRef = useRef(null);
  const [showHand, setShowHand] = useState(true);
  const { t } = useTranslation();
  let relicItems = gameItems.filter(
    (itm) =>
      itm.id?.includes("relic") &&
      itm.id?.includes(myth) &&
      !itm.id?.includes("C09")
  );
  relicItems = [
    { id: "", name: "", coins: " ", fragments: [], orbs: "celtc" },
    ...relicItems,
  ];

  useEffect(() => {
    setTimeout(() => {
      setShowHand(false);
    }, 2000);
  }, []);

  return (
    <OverlayLayout customMyth={myth}>
      <div className="aspect-[4/5] w-full mt-2 h-full">
        <HTMLFlipBook
          key={myth}
          ref={flipBookRef}
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
            const mythology = code.split(".")[0];
            const id = code.split(".")[2];

            return (
              <div className="w-full h-full">
                {idx == 0 ? (
                  <div
                    key={idx}
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

                    <div className="absolute inset-0 leading-para flex flex-col items-center justify-end px-4 mb-[10dvh] text-para font-medium text-card">
                      {t(`characters.${mythology}.${id}.desc`)}
                    </div>
                    <div className="absolute inset-0 leading-para flex flex-col items-center justify-end p-4 text-para font-medium text-card">
                      {t(`characters.${mythology}.${id}.char`)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </HTMLFlipBook>

        {showHand && (
          <div className="font-symbols scale-point absolute text-white text-black-contour -mt-[35vh] ml-[45vw] text-[5rem]">
            b
          </div>
        )}
      </div>

      <>
        <ToggleLeft
          positionBottom
          activeMyth={4}
          handleClick={() => {
            flipBookRef.current?.pageFlip().flipPrev();
          }}
        />
        <ToggleRight
          positionBottom
          activeMyth={4}
          handleClick={() => {
            flipBookRef.current?.pageFlip().flipNext();
          }}
        />
      </>
    </OverlayLayout>
  );
};

export default BookCrd;
