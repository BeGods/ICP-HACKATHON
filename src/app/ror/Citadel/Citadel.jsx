import { useEffect } from "react";
import CitadelCarousel from "./Carousel";
import ReactHowler from "react-howler";
import { useProfileGuide } from "../../../hooks/useTutorial";
import BgLayout from "../../../components/Layouts/BgLayout";
import RoRHeader from "../../../components/Layouts/Header";
import { useStore } from "../../../store/useStore";

const Citadel = (props) => {
  const assets = useStore((s) => s.assets);
  const enableSound = useStore((s) => s.enableSound);
  const setMinimize = useStore((s) => s.setMinimize);

  const [enableGuide, setEnableGuide] = useProfileGuide("ror-tutorial01");

  useEffect(() => {
    // setShowCard(
    //   <CitadelGuide
    //     handleClick={() => {
    //       setShowCard(null);
    //     }}
    //   />
    // );
  }, [enableGuide]);

  useEffect(() => {
    setMinimize(2);
  }, []);

  return (
    <BgLayout>
      <RoRHeader />
      <CitadelCarousel />
      <div className="absolute">
        <ReactHowler
          src={`${assets.audio["location.citadel"]}`}
          playing={enableSound}
          preload={true}
          loop
        />
      </div>
    </BgLayout>
  );
};

export default Citadel;

{
  /* <div className="absolute top-0 right-0 mt-[34vw] mr-[16vw]">
          {gameData.stats.isThiefActive && (
            <div
              className={`text-[50px] ${
                gameData.stats.showThief && "glow-thief scale-point"
              } font-symbols text-black-contour text-white `}
            >
              m
            </div>
          )}
        </div> */
}
