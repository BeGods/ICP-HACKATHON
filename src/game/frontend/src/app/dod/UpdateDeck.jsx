import { useEffect, useState } from "react";
import {
  ToggleBack,
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import BgLayout from "../../components/Layouts/BgLayout";
import { useStore } from "../../store/useStore";
import { mythSections } from "../../utils/constants.fof";
import { PrimaryBtn } from "../../components/Buttons/PrimaryBtn";
import { CardWrap, GridWrap } from "../../components/Layouts/Wrapper";
import { GridChar, GridCharEmpty } from "../../components/Layouts/GridItem";
import { Check, ShieldPlus, X } from "lucide-react";
import { updateCardDeck } from "../../utils/api.dod";

const UpdateDeck = () => {
  const authToken = useStore((c) => c.authToken);
  const gameData = useStore((c) => c.gameData);
  const assets = useStore((c) => c.assets);
  const setSection = useStore((c) => c.setSection);
  const setActiveMyth = useStore((c) => c.setActiveMyth);
  const setGameData = useStore((c) => c.setGameData);
  const activeMyth = useStore((c) => c.activeMyth);
  const [showList, setShowList] = useState(false);
  const [flipped, setIsFlipped] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true);
  const [selectedCards, setSelectedCards] = useState([]);
  const paginatedItems = Array.from({ length: 9 }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `${mythSections[activeMyth]}.char.${flipped ? "B" : "A"}${num}`;
  });

  const handleUpdateCardDeck = async () => {
    try {
      const updatedDeck = await updateCardDeck(authToken, selectedCards);

      setGameData((prev) => {
        return {
          ...prev,
          characterCardDeck: updatedDeck,
        };
      });

      setSection(0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowAvatar(false);
    }, 3000);

    setActiveMyth(0);
  }, []);

  return (
    <BgLayout>
      {showAvatar == true ? (
        <h1 className="bonus-heading-text">Avatar</h1>
      ) : selectedCards.length == 9 ? (
        <h1 className="bonus-heading-text">Confirm</h1>
      ) : (
        <h1 className="bonus-heading-text">
          Select <br /> {selectedCards.length}/9
        </h1>
      )}

      {showAvatar ? (
        <div className="center-section">
          <CardWrap
            Front={
              <img
                src={`/assets/chars/240px-${gameData.avatarType}.png`}
                alt="card"
                className="w-full h-full mx-auto rounded-[15px]"
              />
            }
            Back={
              <img
                src={`/assets/chars/240px-${gameData.avatarType}.png`}
                alt="card"
                className="w-full h-full mx-auto rounded-[15px] grayscale"
              />
            }
          />
        </div>
      ) : selectedCards.length == 9 ? (
        <GridWrap>
          {selectedCards.map((item) => (
            <div
              onClick={() => {
                setSelectedCards((prev) => {
                  if (prev.includes(item)) {
                    return prev.filter((card) => card !== item);
                  } else {
                    return [item, ...prev];
                  }
                });
              }}
              key={item}
              className="relative w-full h-full flex flex-col justify-center items-center shadow-2xl rounded-md overflow-hidden"
            >
              <GridChar
                isSelected={selectedCards.includes(item)}
                charId={item}
              />
              {selectedCards.includes(item) && (
                <div className="absolute w-full h-full z-50 flex justify-center items-center bg-black/50">
                  <div className="flex justify-center items-center  rounded-full">
                    <X color="white" size={30} />
                  </div>
                </div>
              )}
            </div>
          ))}

          {Array.from({ length: 9 - paginatedItems.length }).map((_, index) => (
            <GridCharEmpty key={index} icon={"8"} idx={index} />
          ))}
        </GridWrap>
      ) : showList ? (
        <GridWrap>
          {paginatedItems.map((item) => (
            <div
              onClick={() => {
                setSelectedCards((prev) => {
                  if (prev.includes(item)) {
                    return prev.filter((card) => card !== item);
                  } else {
                    return [item, ...prev];
                  }
                });
              }}
              key={item}
              className="relative w-full h-full flex flex-col justify-center items-center shadow-2xl rounded-md overflow-hidden"
            >
              <GridChar
                isSelected={selectedCards.includes(item)}
                charId={item}
              />

              {selectedCards.includes(item) && (
                <div className="absolute w-full h-full z-50 flex justify-center items-center bg-black/50">
                  <div className="flex justify-center items-center  rounded-full">
                    <X color="white" size={30} />
                  </div>
                </div>
              )}
            </div>
          ))}

          {Array.from({ length: 9 - paginatedItems.length }).map((_, index) => (
            <GridCharEmpty key={index} icon={"8"} idx={index} />
          ))}
        </GridWrap>
      ) : (
        <div className="center-section">
          <CardWrap
            isPacket={true}
            onFlipChange={(isFlipped) => setIsFlipped(isFlipped)}
            Front={
              <img
                src={assets.whitelist[mythSections[activeMyth]]}
                alt="card"
                className="w-full h-full mx-auto rounded-[15px]"
              />
            }
            Back={
              <img
                src={assets.whitelist[mythSections[activeMyth]]}
                alt="card"
                className="w-full h-full mx-auto rounded-[15px] grayscale"
              />
            }
          />
        </div>
      )}

      <div
        className={`${
          showAvatar && "hidden"
        } absolute flex flex-col justify-center items-center w-full bottom-0 mb-safeBottom pb-1`}
      >
        {selectedCards.length == 9 ? (
          <PrimaryBtn
            centerContent={<Check strokeWidth={6} />}
            mode={"default"}
            onClick={handleUpdateCardDeck}
          />
        ) : (
          <PrimaryBtn
            centerContent={showList ? <ShieldPlus size={40} /> : "-"}
            mode={showList ? "action" : "default"}
            onClick={() => {
              setShowList(true);
            }}
            handlePrev={() => {
              setIsFlipped((prev) => !prev);
            }}
            handleNext={() => {
              setIsFlipped((prev) => !prev);
            }}
          />
        )}
      </div>

      <div className={showAvatar ? "hidden" : ""}>
        {selectedCards.length < 9 && showList && (
          <ToggleBack
            minimize={2}
            handleClick={() => {
              setShowList(false);
            }}
            activeMyth={8}
          />
        )}
        <ToggleLeft
          minimize={2}
          handleClick={() => {
            setActiveMyth((prev) => (prev - 1 + 4) % 4);
          }}
          activeMyth={activeMyth}
        />
        <ToggleRight
          minimize={2}
          handleClick={() => {
            setActiveMyth((prev) => (prev + 1) % 4);
          }}
          activeMyth={activeMyth}
        />
      </div>
    </BgLayout>
  );
};

export default UpdateDeck;
