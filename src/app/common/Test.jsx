import React from "react";

const Test = (props) => {
  return (
    <div
      className={`bg-white text-black flex w-screen text-wrap tg-container-height`}
    >
      <div
        className="tg-container-height"
        style={{
          background: `url(/assets/1280px-dod.loading.png)`,
          backgroundPosition: "45.5% 0%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      ></div>
    </div>
  );
};

export default Test;
