import React from "react";
import { useNavigate } from "react-router-dom";

const Launcher = (props) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col text-white font-fof items-center text-center w-screen"
      style={{
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
      }}
    >
      <h1 className="uppercase text-[12vw] mt-4">Play</h1>
      <div className="flex flex-col gap-8 justify-center items-center flex-grow w-full">
        <div
          onClick={() => {
            navigate("/fof");
          }}
          className="w-2/3 text-[8vw] p-2 h-fit bg-white text-black"
        >
          Forges Of Faith
        </div>
        <div
          onClick={() => {
            navigate("/ror");
          }}
          className="w-2/3 text-[8vw] p-2 h-fit bg-white text-black"
        >
          Requim Of Relics
        </div>
      </div>
    </div>
  );
};

export default Launcher;
