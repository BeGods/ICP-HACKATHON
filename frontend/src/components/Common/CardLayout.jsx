import React from "react";

const CardLayout = ({ children }) => {
  return <div className="absolute z-50 h-screen w-screen">{children}</div>;
};

export default CardLayout;
