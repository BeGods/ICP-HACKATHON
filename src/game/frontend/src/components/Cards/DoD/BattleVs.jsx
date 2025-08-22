import { useState, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import characters from "../../../assets/characters.json";
import relics from "../../../assets/relics.json";
import BattleResultCrd from "./BattleResultCrd";

const VsBattleIntro = ({ battleData, endBattle, startNewBattle }) => {
  const assets = useStore((c) => c.assets);
  const setShowCard = useStore((c) => c.setShowCard);
  const setGameData = useStore((c) => c.setGameData);
  const setSection = useStore((c) => c.setSection);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVS, setShowVS] = useState(false);
  const userCardParts = battleData.user.cardId.split(".");
  const userWeaponParts = battleData?.user?.attachmentId?.split(".") ?? null;
  const botCardParts = battleData.bot.cardId.split(".");
  const botWeaponParts = battleData?.bot?.attachmentId?.split(".") ?? null;
  const userCardDetails = {
    cardId: battleData.user.cardId,
    name: characters[userCardParts[0]][userCardParts[2]].name,
    myth: userCardParts[0],
    weaponName: userWeaponParts
      ? relics.relics[userWeaponParts[0]][userWeaponParts[2]].name
      : null,
    attack: battleData.user.attack,
    defense: battleData.user.defense,
  };
  const botCardDetails = {
    cardId: battleData.bot.cardId,
    name: characters[botCardParts[0]][botCardParts[2]].name,
    myth: botCardParts[0],
    weaponName: botWeaponParts
      ? relics.relics[botWeaponParts[0]][botWeaponParts[2]].name
      : null,
    attack: battleData.bot.attack,
    defense: battleData.bot.defense,
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setShowVS(false);

    setTimeout(() => {
      setShowVS(true);

      setTimeout(() => {
        endBattle();
        setShowCard(
          <BattleResultCrd
            data={userCardDetails}
            status={battleData.result}
            orbRewards={battleData.orbRewards}
            updatedXP={battleData.updatedXP}
            endBattle={() => {
              // close the result card
              setShowCard(null);

              // handle idle phase redirect
              if (battleData.gamePhase === "idle") {
                setSection(0);
              }

              // update battle
              setGameData((prev) => {
                return {
                  ...prev,
                  gamePhase: battleData.gamePhase,
                  battleHistory: battleData.updatedBattle,
                  currentBattleground: prev.currentBattleground + 1,
                  drawnCards: battleData.drawnCards, //TODO:  will need updated card deck also so its betetr to do it manually on forntned
                };
              });
            }}
            resData={battleData}
          />
        );
      }, 4000);
    }, 500);
  };

  useEffect(() => {
    setTimeout(() => {
      startAnimation();
    }, 1000);
  }, []);

  return (
    <div
      style={{ height: "calc(100dvh - 40px)" }}
      className="relative w-full m-0 overflow-hidden"
    >
      {/* right side */}
      <div
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-1500 ease-out ${
          isAnimating
            ? "transform translate-y-0"
            : "transform -translate-y-full translate-x-full"
        }`}
        style={{
          clipPath: isAnimating
            ? "polygon(100% 0, 100% 100%, 0 0)"
            : "polygon(100% 0, 100% 100%, 0 0)",
        }}
      >
        <div className="absolute inset-0 z-0">
          <div
            className={`absolute inset-0 filter-${botCardDetails.myth}`}
            style={{
              backgroundImage: `url(${assets.uxui.baseBgA})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        </div>
        <div
          className={`absolute top-[10%] right-[5%] transform transition-all duration-700 ${
            isAnimating
              ? "opacity-100 scale-100 delay-1000"
              : "opacity-0 scale-150"
          }`}
        >
          <div className="text-white text-right text-black-contour uppercase">
            <h1 className="font-bold text-3xl">{botCardDetails.name}</h1>
            <h2 className="font-bold text-2xl">
              {botCardDetails.weaponName ?? "--"}
            </h2>
            <h2 className="font-bold text-xl">
              Attack: {botCardDetails.attack}
            </h2>
            <h2 className="font-bold text-xl">
              Defense: {botCardDetails.defense}
            </h2>
          </div>
        </div>
      </div>

      {/* left side */}
      <div
        className={`absolute inset-0  transition-all duration-1500 ease-out ${
          isAnimating
            ? "transform translate-y-0"
            : "transform translate-y-full -translate-x-full"
        }`}
        style={{
          clipPath: "polygon(0 100%, 100% 100%, 0 0)",
        }}
      >
        <div className="absolute inset-0 z-0">
          <div
            className={`absolute inset-0 filter-${userCardDetails.myth}`}
            style={{
              backgroundImage: `url(${assets.uxui.baseBgA})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        </div>
        <div
          className={`absolute bottom-[10%] left-[5%] transform transition-all duration-700 ${
            isAnimating
              ? "opacity-100 scale-100 delay-1000"
              : "opacity-0 scale-150"
          }`}
        >
          <div className="text-white text-left text-black-contour uppercase">
            <h1 className="font-bold text-3xl">{userCardDetails.name}</h1>
            <h2 className="font-bold text-2xl">
              {userCardDetails.weaponName ?? "--"}
            </h2>
            <h2 className="font-bold text-xl">
              Attack: {userCardDetails.attack}
            </h2>
            <h2 className="font-bold text-xl">
              Defense: {userCardDetails.defense}
            </h2>
          </div>
        </div>
      </div>

      {/* diagonal cut */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isAnimating ? "block" : "hidden"
        }`}
      >
        <div
          className="absolute inset-0 bg-white"
          style={{
            clipPath: "polygon(0 0, 100% 100%, 100% calc(100% - 4px), 4px 0)",
            boxShadow:
              "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)",
          }}
        />
      </div>

      {/* v/s */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
          showVS ? "opacity-100 scale-100" : "opacity-0 scale-200"
        }`}
      >
        <div className="relative transform">
          <div
            className="text-9xl font-black text-white text-center animate-pulse"
            style={{
              textShadow:
                "0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.8)",
              fontFamily: "Impact, Arial Black, sans-serif",
            }}
          >
            VS
          </div>
          <div className={`absolute inset-0 ${showVS ? "animate-ping" : ""}`}>
            <div
              className="text-9xl font-black text-yellow-300 text-center opacity-60"
              style={{
                textShadow:
                  "0 0 40px rgba(255, 255, 0, 1), 0 0 80px rgba(255, 255, 0, 0.6)",
                fontFamily: "Impact, Arial Black, sans-serif",
              }}
            >
              VS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VsBattleIntro;
