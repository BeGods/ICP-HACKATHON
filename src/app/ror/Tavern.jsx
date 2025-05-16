import React, { useContext, useEffect } from "react";
import RoRHeader from "../../components/layouts/Header";
import { RorContext } from "../../context/context";
import ArtifactCrd from "../../components/Cards/Reward/ArtiFactCrd";
import { gameItems } from "../../utils/gameItems";
import MiscCard from "../../components/ror/MiscCard";
import RoRBtn from "../../components/ror/RoRBtn";
import { getActiveFeature, setStorage } from "../../helpers/cookie.helper";
import { toast } from "react-toastify";
import { activateRest, claimArtifact } from "../../utils/api.ror";
import { showToast } from "../../components/Toast/Toast";
import { useNavigate } from "react-router-dom";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ handleClick, assets }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${assets.boosters.tavernHead})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      onClick={handleClick}
      className="flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white text-white top-0 z-20 left-1/2 -translate-x-1/2"
    ></div>
  );
};

const Tavern = () => {
  const navigate = useNavigate();
  const { gameData, setGameData, setShowCard, assets, authToken } =
    useContext(RorContext);
  const showInfoCard = async () => {
    setShowCard(
      <MiscCard
        showInfo={true}
        img={assets.boosters.tavernCard}
        icon="Tavern"
        isMulti={false}
        handleClick={() => setShowCard(null)}
        Button={
          <RoRBtn
            message={"Close"}
            isNotPay={true}
            left={1}
            right={1}
            handleClick={() => setShowCard(null)}
          />
        }
      />
    );
  };

  const handleActivate = async (key, value) => {
    setShowCard(null);
    await setStorage(tele, key, value);
  };

  const handleActivateRest = async () => {
    if (gameData.stats.isRestActive) {
    } else {
      try {
        const response = await activateRest(authToken);
        setShowCard(null);
        setGameData((prev) => {
          const newStats = { ...prev.stats };

          newStats.gobcoins = (prev.stats.gobcoin || 0) - 1;
          newStats.isRestActive = true;
          newStats.digLvl += 1;

          return {
            ...prev,
            stats: newStats,
          };
        });
        console.log(response);
        showToast("meal_success");
      } catch (error) {
        console.log(error);
        setShowCard(null);
        showToast("meal_error");
      }
    }
  };

  useEffect(() => {
    const checkFirstTime = async () => {
      const isActive = await getActiveFeature(tele, "tavern01");

      if (!isActive) {
        setShowCard(
          <MiscCard
            showInfo={false}
            img={assets.boosters.tavernCard}
            icon="tavernCard"
            isMulti={false}
            handleClick={() => handleActivate("tavern01", true)}
            Button={
              <RoRBtn
                message={"Enter"}
                left={1}
                right={1}
                handleClick={() => handleActivate("tavern01", true)}
              />
            }
          />
        );
      }
    };
    (async () => await checkFirstTime())();
  }, []);

  const handleClaimItem = async (itemId) => {
    try {
      await claimArtifact(authToken, itemId);
      setShowCard(null);
      setGameData((prev) => {
        let updatedPouch = [...prev.pouch, itemId];
        let updatdStats = { ...prev.stats };

        updatdStats.gobcoin -= 1;

        return {
          ...prev,
          pouch: updatedPouch,
          stats: updatdStats,
        };
      });
      showToast("item_success_pouch");
    } catch (error) {
      showToast("item_error");
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
    }
  };

  return (
    <div className="w-full h-full">
      <RoRHeader
        CenterChild={<CenterChild assets={assets} handleClick={showInfoCard} />}
      />
      <div className="w-[80%] mt-[18dvh] h-[60dvh] mx-auto relative">
        <div
          className="absolute inset-0 z-0 filter-orb-white"
          style={{
            backgroundImage: `url(${assets.uxui.basebg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            opacity: 0.5,
          }}
        />
        <div className="h-full flex justify-center items-center">
          <div className="h-full w-full flex justify-center items-center">
            <div className="grid grid-cols-2 gap-6 items-center">
              {[
                { icon: ")", label: `meal - ${gameData.stats.digLvl ?? 1}` },
                { icon: "zz", label: "sleep" },
                { icon: "F", label: "shoes" },
                { icon: "Z", label: "key" },
              ].map((itm, index) => {
                const shoes = gameItems
                  .filter((itm) => itm.id.includes("artifact.common03"))
                  .filter((itm) => !gameData.pouch.includes(itm.id));

                const keys = gameItems
                  .filter((itm) => itm.id.includes("artifact.common02"))
                  .filter((itm) => !gameData.pouch.includes(itm.id));

                const items = index == 2 ? shoes : keys;

                return (
                  <div
                    onClick={() => {
                      if (
                        (index == 2 && items.length > 0) ||
                        (index == 3 && items.length > 0)
                      ) {
                        setShowCard(
                          <ArtifactCrd
                            items={items}
                            category={4}
                            isPay={true}
                            handleClick={(id) => {
                              handleClaimItem(id);
                            }}
                          />
                        );
                      } else if (index == 1) {
                        navigate(-1);
                      } else if (index == 0) {
                        if (gameData.stats.isRestActive) {
                        } else {
                          setShowCard(
                            <MiscCard
                              onlyBack={true}
                              showInfo={false}
                              img={assets.boosters.mealCard}
                              icon="Meal"
                              isMulti={false}
                              handleClick={handleActivateRest}
                              Button={
                                <RoRBtn
                                  message={"EAT"}
                                  isNotPay={false}
                                  left={1}
                                  right={1}
                                  handleClick={handleActivateRest}
                                />
                              }
                            />
                          );
                        }
                      }
                    }}
                    key={`box-${index}`}
                    className={`relative border ${
                      (index == 0 && gameData.stats.isRestActive) ||
                      (index == 2 && items.length == 0) ||
                      (index == 3 && items.length == 0)
                        ? "text-white/50 border-white/50"
                        : "text-white border-white/70"
                    } flex flex-col items-center aspect-square shadow-2xl max-w-[120px] h-[140px] w-full rounded-md overflow-hidden`}
                  >
                    <div className="w-full aspect-square rounded-t-md bg-white/20 h-[110px] flex justify-center items-center">
                      <span
                        className={`text-iconLg ${
                          index !== 1 && "font-symbols"
                        }`}
                      >
                        {itm.icon}
                      </span>
                    </div>
                    <div className="w-full uppercase text-center text-[1rem] break-words px-1 flex justify-center items-center">
                      {itm.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tavern;
