import { useState, useEffect, useRef } from "react";
import RoRHeader from "../../components/Layouts/Header";
import { ToggleBack } from "../../components/Common/SectionToggles";
import { setStorage } from "../../helpers/cookie.helper";
import { useRoRGuide } from "../../hooks/useTutorial";
import { SecondaryFooter } from "../../components/Layouts/Wrapper";
import BgLayout from "../../components/Layouts/BgLayout";
import ItemCrd from "../../components/Cards/Relics/ItemsCrd";
import { updateShardsToCoins } from "../../utils/api.ror";
import { mythSections } from "../../utils/constants.fof";
import { toast } from "react-toastify";
import { useStore } from "../../store/useStore";

const tele = window.Telegram?.WebApp;

const Apothecary = (props) => {
  const setSection = useStore((s) => s.setSection);
  const setShowCard = useStore((s) => s.setShowCard);
  const authToken = useStore((s) => s.authToken);
  const setGameData = useStore((s) => s.setGameData);

  const [enableGuide, setEnableGuide] = useRoRGuide("ror-tutorial04");
  const [activeColor, setActiveColor] = useState(0);
  const myths = ["greek", "celtic", "norse", "egyptian"];
  const activeColorRef = useRef(activeColor);
  activeColorRef.current = activeColor;

  const handleActivate = async (key, value) => {
    setShowCard(null);
    await setStorage(tele, key, value);
  };

  // useEffect(() => {
  //   const checkFirstTime = async () => {
  //     const isActive = await getActiveFeature(tele, "gemologist01");

  //     if (!isActive) {
  //       setShowCard(
  //         <MiscCard
  //           id="apothecary"
  //           handleClick={() => handleActivate("gemologist01", true)}
  //         />
  //       );
  //     }
  //   };
  //   (async () => await checkFirstTime())();
  // }, []);

  // useEffect(() => {
  //   setShowCard(
  //     <ApothecaryGuide
  //       handleClick={() => {
  //         setEnableGuide(false);
  //         setShowCard(null);
  //       }}
  //     />
  //   );
  // }, [enableGuide]);

  const convertToGobcoins = async (type) => {
    try {
      await updateShardsToCoins(authToken, type);

      if (type == "black") {
        setGameData((prev) => {
          let updatedStats = prev.stats;
          updatedStats.blackShards -= 1;
          updatedStats.gobcoin += 1;

          return {
            ...prev,
            stats: updatedStats,
          };
        });
      } else if (type == "white") {
        setGameData((prev) => {
          let updatedStats = prev.stats;
          updatedStats.whiteShards -= 1;
          updatedStats.gobcoin += 1;

          return {
            ...prev,
            stats: updatedStats,
          };
        });
      } else if (mythSections.includes(type)) {
        setGameData((prev) => {
          let updatedStats = prev.stats;
          updatedStats.gobcoin += 1;
          updatedStats.mythologies = prev.stats.mythologies.map((m) => {
            if (m.name === type) {
              return {
                ...m,
                shards: (m.shards || 0) - 1000,
              };
            }
            return m;
          });

          return {
            ...prev,
            stats: updatedStats,
          };
        });
      } else {
        toast.error("Invalid type");
      }

      toast.success("Gobcoin added to your balance successfully!.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColor((prev) => (prev + 1) % myths.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [myths.length]);

  return (
    <BgLayout>
      <RoRHeader />
      <SecondaryFooter
        items={[
          {
            icon: "l",
            label: "sell",
            border: `border-white text-black-contour text-white`,
            handleClick: () => {
              setShowCard(
                <ItemCrd
                  mode={"shard"}
                  label="1 shard"
                  src={"shard.aether01"}
                  handleClick={() => {
                    convertToGobcoins("white");
                  }}
                />
              );
            },
          },
          {
            icon: "l",
            label: "sell",
            border: `border-${myths[activeColor]}-primary text-${myths[activeColor]}-primary text-black-contour`,
            handleClick: () => {
              setShowCard(
                <ItemCrd
                  mode={"multi-shard"}
                  label="1000 shards"
                  handleClick={(type) => {
                    convertToGobcoins(type);
                  }}
                />
              );
            },
          },
          {
            icon: "l",
            label: `sell`,
            border: `border-white text-black text-white-contour`,
            handleClick: () => {
              setShowCard(
                <ItemCrd
                  mode={"shard"}
                  label="1 shard"
                  src={"shard.aether02"}
                  handleClick={() => {
                    convertToGobcoins("black");
                  }}
                />
              );
            },
          },
        ]}
        id="apothecary"
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

export default Apothecary;
