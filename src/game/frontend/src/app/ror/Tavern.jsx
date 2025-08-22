import RoRHeader from "../../components/Layouts/Header";
import { activateRest, claimArtifact } from "../../utils/api.ror";
import { showToast } from "../../components/Toast/Toast";
import { useRoRGuide } from "../../hooks/useTutorial";
import { ToggleBack } from "../../components/Common/SectionToggles";
import BgLayout from "../../components/Layouts/BgLayout";
import { SecondaryFooter } from "../../components/Layouts/Wrapper";
import ItemCrd from "../../components/Cards/Relics/ItemsCrd";
import { useStore } from "../../store/useStore";

const Tavern = () => {
  const gameData = useStore((s) => s.gameData);
  const setGameData = useStore((s) => s.setGameData);
  const setShowCard = useStore((s) => s.setShowCard);
  const assets = useStore((s) => s.assets);
  const authToken = useStore((s) => s.authToken);
  const setSection = useStore((s) => s.setSection);

  const [enableGuide, setEnableGuide] = useRoRGuide("ror-tutorial05");

  const handleActivateRest = async (itemId, adId) => {
    const deductValue = adId ? 0 : 1;
    if (gameData.stats.isRestActive) return;

    try {
      const response = await activateRest(authToken);
      setShowCard(null);
      setGameData((prev) => {
        const newStats = { ...prev.stats };

        newStats.gobcoin = (prev.stats.gobcoin || 0) - 1;
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
  };

  const handleClaimItem = async (itemId, adId) => {
    const deductValue = adId ? 0 : 1;

    try {
      await claimArtifact(authToken, itemId, adId);
      setShowCard(null);
      setGameData((prev) => {
        let updatedPouch = [...prev.pouch, itemId];
        let updatdStats = { ...prev.stats };

        updatdStats.gobcoin -= deductValue;

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
    <BgLayout>
      <RoRHeader />

      <SecondaryFooter
        items={[
          {
            icon: "F",
            label: "walk",
            handleClick: () => {
              setShowCard(
                <ItemCrd
                  icon="F"
                  label="walk"
                  mode="multi-item"
                  src={"artifact.common03"}
                  showAds={true}
                  handleClick={(itemId, adId) => {
                    handleClaimItem(itemId, adId);
                  }}
                />
              );
            },
          },
          {
            icon: ")",
            label: `eat`,
            handleClick: () => {
              setShowCard(
                <ItemCrd
                  icon=")"
                  label="meal"
                  mode="non-item"
                  isNotItem={true}
                  src={assets.boosters.cardMeal}
                  showAds={true}
                  handleClick={(itemId, adId) => {
                    handleActivateRest(itemId, adId);
                  }}
                />
              );
            },
          },
          {
            icon: "Z",
            label: "unlock",
            handleClick: () => {
              setShowCard(
                <ItemCrd
                  icon="Z"
                  label="unlock"
                  mode="multi-item"
                  src={"artifact.common02"}
                  showAds={true}
                  handleClick={(itemId, adId) => {
                    handleClaimItem(itemId, adId);
                  }}
                />
              );
            },
          },
        ]}
        id="tavernist"
      />

      <>
        <ToggleBack
          minimize={2}
          handleClick={() => {
            setSection(0);
          }}
          activeMyth={8}
        />
      </>
    </BgLayout>
  );
};

export default Tavern;

// const handleActivate = async (key, value) => {
//   setShowCard(null);
//   await setStorage(tele, key, value);
// };

// useEffect(() => {
//   if (enableGuide) {
//     setShowCard(
//       <TavernGuide
//         handleClick={() => {
//           setShowCard(null);
//           setEnableGuide(false);
//         }}
//       />
//     );
//   }
// }, [enableGuide]);

// useEffect(() => {
//   const checkFirstTime = async () => {
//     const isActive = await getActiveFeature(tele, "tavern01");

//     if (!isActive) {
//       setShowCard(
//         <MiscCard
//           id={"tavern"}
//           handleClick={() => handleActivate("tavern01", true)}
//         />
//       );
//     }
//   };
//   (async () => await checkFirstTime())();
// }, []);
