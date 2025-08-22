import RoRHeader from "../../components/Layouts/Header";
import { ToggleBack } from "../../components/Common/SectionToggles";
import { mythSections } from "../../utils/constants.ror";
import { claimArtifact } from "../../utils/api.ror";
import { setStorage } from "../../helpers/cookie.helper";
import { showToast } from "../../components/Toast/Toast";
import { trackEvent } from "../../utils/ga";
import { useRoRGuide } from "../../hooks/useTutorial";
import BgLayout from "../../components/Layouts/BgLayout";
import { SecondaryFooter } from "../../components/Layouts/Wrapper";
import ItemCrd from "../../components/Cards/Relics/ItemsCrd";
import { useStore } from "../../store/useStore";

const tele = window.Telegram?.WebApp;

const Library = () => {
  const setGameData = useStore((s) => s.setGameData);
  const setShowCard = useStore((s) => s.setShowCard);
  const authToken = useStore((s) => s.authToken);
  const setSection = useStore((s) => s.setSection);

  const [enableGuide, setEnableGuide] = useRoRGuide("ror-tutorial03");
  const getMythOrder = (itemId) => {
    const myth = itemId.split(".")[0];
    return mythSections.indexOf(myth);
  };

  const handleClaimItem = async (itemId, adId) => {
    const deductValue = adId ? 0 : 1;

    try {
      await claimArtifact(authToken, itemId, adId);
      trackEvent("purchase", "claim_lib_item", "success");

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

  const handleActivate = async (key, value) => {
    setShowCard(null);
    await setStorage(tele, key, value);
  };

  return (
    <BgLayout>
      <RoRHeader />

      <SecondaryFooter
        items={[
          {
            icon: "+",
            label: "book",
            handleClick: () => {
              setShowCard(
                <ItemCrd
                  icon="+"
                  mode="multi-item"
                  label="book"
                  src={"artifact.starter10"}
                  showAds={true}
                  handleClick={(id, adId) => {
                    handleClaimItem(id, adId);
                  }}
                />
              );
            },
          },
          {
            icon: "*",
            label: "map",
            handleClick: () => {
              setShowCard(
                <ItemCrd
                  icon="*"
                  label="map"
                  mode="multi-item"
                  src={"artifact.starter02"}
                  showAds={true}
                  handleClick={(id, adId) => {
                    handleClaimItem(id, adId);
                  }}
                />
              );
            },
          },
          {
            icon: "Y",
            label: "totem",
            handleClick: () => {
              setShowCard(
                <ItemCrd
                  icon="Y"
                  label="totem"
                  mode="multi-item"
                  src={"artifact.starter01"}
                  showAds={true}
                  handleClick={(id, adId) => {
                    handleClaimItem(id, adId);
                  }}
                />
              );
            },
          },
        ]}
        id="librarian"
      />

      <ToggleBack
        minimize={2}
        handleClick={() => {
          setSection(0);
        }}
        activeMyth={8}
      />
    </BgLayout>
  );
};

export default Library;

// useEffect(() => {
//   const checkFirstTime = async () => {
//     const isActive = await getActiveFeature(tele, "librarn01");

//     if (!isActive) {
//       setShowCard(
//         <MiscCard
//           id="librarian"
//           handleClick={() => handleActivate("librarn01", true)}
//         />
//       );
//     }
//   };
//   (async () => await checkFirstTime())();
// }, []);

// useEffect(() => {
//   setShowCard(
//     <LibraryGuide
//       currTut={0}
//       handleClick={() => {
//         setCurrItems(1);
//         setShowCard(
//           <LibraryGuide
//             currTut={1}
//             handleClick={() => {
//               setCurrItems(2);
//               setShowCard(
//                 <LibraryGuide
//                   currTut={2}
//                   handleClick={() => {
//                     setCurrItems(0);
//                     setEnableGuide(false);
//                     setShowCard(null);
//                   }}
//                 />
//               );
//             }}
//           />
//         );
//       }}
//     />
//   );
// }, [enableGuide]);
