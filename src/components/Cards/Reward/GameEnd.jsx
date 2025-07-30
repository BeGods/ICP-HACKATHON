import React, { useContext } from "react";
import { FofContext } from "../../../context/context";
import { mythSections } from "../../../utils/constants.fof";
import OverlayLayout from "../../Layouts/OverlayLayout";

const GameEndCrd = ({ activeMyth }) => {
  const { assets } = useContext(FofContext);

  return (
    <OverlayLayout>
      <div className="center-section">
        <div className={`relative packet-width rounded-lg shadow-lg`}>
          <div className="relative w-full h-full text-card">
            <img
              src={assets.win[mythSections[activeMyth]]}
              alt="info card background"
              className="w-full h-full object-cover rounded-primary z-10"
            />
          </div>
        </div>
      </div>
    </OverlayLayout>
  );
};

export default GameEndCrd;
