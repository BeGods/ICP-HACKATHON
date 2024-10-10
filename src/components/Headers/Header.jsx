import React, { useContext } from "react";
import { MyContext } from "../../context/context";
import { mythSections } from "../../utils/variables";

const Header = ({ children }) => {
  const { activeMyth, section } = useContext(MyContext);

  return (
    <div className={`relative`}>
      <img
        src="/assets/uxui/fof.footer.rock3.png"
        alt="paper"
        className={`rotate-180 w-full h-auto filter-paper-${
          section === 3 || section === 4 || section === 5 || section === 6
            ? mythSections[8]
            : mythSections[activeMyth]
        }`}
      />
      <div className="absolute inset-0 flex justify-center">{children}</div>
    </div>
  );
};

export default Header;
