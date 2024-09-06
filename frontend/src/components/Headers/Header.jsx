import React, { useContext } from "react";
import { MyContext } from "../../context/context";
import { mythSections } from "../../utils/variables";

const Header = ({ children }) => {
  const { activeMyth, section } = useContext(MyContext);
  return (
    <div
      style={{
        position: "relative",
        height: "19%",
        width: "100%",
      }}
      className="flex"
    >
      <div
        style={{
          backgroundImage: `url(/assets/uxui/fof.header.paper.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        className={`filter-paper-${
          section === 3 || section === 0
            ? mythSections[4]
            : mythSections[activeMyth]
        } relative -mt-1`}
      />
      {children}
    </div>
  );
};

export default Header;
