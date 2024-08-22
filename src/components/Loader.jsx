import Lottie from "lottie-react";
import React from "react";
import animationData from "../../public/assets/fx/loader.json";
import ReactHowler from "react-howler";

const Loader = (props) => {
  return (
    <div className="bg-black flex flex-col justify-center items-center h-screen w-screen">
      <div className="w-[75%] flex flex-col justify-between h-full mb-4 glow-loader-card">
        <img
          src="/assets/logos/battle.gods.white.svg"
          alt="black-gods"
          className="h-full w-full"
        />
        <div>
          <Lottie
            autoplay
            loop
            animationData={animationData}
            className="w-full h-full"
          />
        </div>
        <div className="w-full text-center font-fof text-secondary uppercase text-white">
          Loading...
        </div>
      </div>
      {/* <ReactHowler
        src="/assets/audio/fof.music.intro.mp3"
        playing={true}
        preload={true}
        loop
      /> */}
    </div>
  );
};

export default Loader;
