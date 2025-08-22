import React from "react";
import BgLayout from "../../components/Layouts/BgLayout";
import { PrimaryBtn } from "../../components/Buttons/PrimaryBtn";
import DoDHeader from "../../components/Layouts/DoDHeader";
import { useStore } from "../../store/useStore";
import { startTurn } from "../../utils/api.dod";
import { Play } from "lucide-react";

const Home = (props) => {
  // Number of battles won
  // current numbers of turns
  // rewards - orbs, faiths, Coins
  // show card deck along with avatar
  // button to start battle
  // show this screen only if "idle" gamePhase
  const setSection = useStore((c) => c.setSection);
  const authToken = useStore((c) => c.authToken);
  const setGameData = useStore((c) => c.setGameData);
  const setShowEffect = useStore((c) => c.setShowEffect);

  const handleStartTurn = async () => {
    try {
      const updatedDrawnCards = await startTurn(authToken);

      setGameData((prev) => {
        return {
          ...prev,
          gamePhase: "drawn",
          location: updatedDrawnCards.location,
          drawnCards: updatedDrawnCards.drawnCards,
        };
      });

      setSection(1);
      setShowEffect(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BgLayout>
      <DoDHeader />
      <div className={`center-section`}>
        <PrimaryBtn
          mode="default"
          customMyth={4}
          centerContent={<Play />}
          onClick={handleStartTurn}
        />
      </div>
      {/* Show Footer */}
    </BgLayout>
  );
};

export default Home;
