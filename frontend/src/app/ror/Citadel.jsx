import React, { useContext } from "react";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import CitadelCarousel from "../../components/ror/CitadelCarousel";
import RoRHeader from "../../components/layouts/Header";

const CenterChild = () => {
  return (
    <div
      className={`
            flex justify-center items-center absolute h-symbol-primary w-symbol-primary rounded-full bg-black border border-white top-0 z-20 left-1/2 -translate-x-1/2`}
    >
      hi
    </div>
  );
};

const Citadel = (props) => {
  const { minimize, isTelegram } = useContext(RorContext);

  return (
    <div
      className={`flex flex-col ${
        isTelegram ? "tg-container-height" : "browser-container-height"
      } overflow-hidden m-0`}
    >
      <RoRHeader CenterChild={<CenterChild />} />
      <div className="flex flex-col justify-center items-center absolute h-full w-full bottom-0 px-2.5">
        <div className="flex w-[75%] min-h-[60vh] flex-col">
          <CitadelCarousel />
        </div>
      </div>
      <ToggleLeft minimize={minimize} activeMyth={4} handleClick={() => {}} />
      <ToggleRight minimize={minimize} activeMyth={4} handleClick={() => {}} />
    </div>
  );
};

export default Citadel;
