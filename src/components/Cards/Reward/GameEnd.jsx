import React, { useContext, useEffect } from "react";
import IconBtn from "../../Buttons/IconBtn";
import { FofContext } from "../../../context/context";
import { mythSections } from "../../../utils/constants.fof";
import OverlayLayout from "../../Layouts/OverlayLayout";

const GameEndCrd = ({ handleClick, activeMyth }) => {
  const { assets, setShowBack, section, setShowCard } = useContext(FofContext);

  useEffect(() => {
    setShowBack(section);

    return () => {
      setShowBack(null);
    };
  }, []);
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
