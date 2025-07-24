import React, { useContext, useEffect } from "react";
import { RorContext } from "../../../context/context";
import CitadelCarousel from "./Carousel";
import ReactHowler from "react-howler";
import { useProfileGuide } from "../../../hooks/Tutorial";
import BgLayout from "../../../components/Layouts/BgLayout";
import RoRHeader from "../../../components/Layouts/Header";

const Citadel = (props) => {
  const { assets, enableSound, setMinimize, section, setShowCard } =
    useContext(RorContext);
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
