import React, { useContext } from "react";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { RorContext } from "../../context/context";
import CitadelCarousel from "../../components/ror/CitadelCarousel";

const Citadel = (props) => {
  const { minimize } = useContext(RorContext);

  return (
    <div className="flex flex-grow justify-center items-center w-full h-full">
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
