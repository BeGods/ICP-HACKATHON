import React from "react";

const Test = (props) => {
  return (
    <div
      className={`bg-white text-black flex w-screen text-wrap`}
      style={{
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
    >
      <div
        style={{
          background: `url(/assets/1280px-dod.loading.png)`,
          backgroundPosition: "45.5% 0%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
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
