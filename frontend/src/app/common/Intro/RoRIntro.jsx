import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../../assets/assets.json";

const RoRIntro = () => {
  const navigate = useNavigate();
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeout(true);
      setTimeout(() => {
        navigate("/ror");
      }, 200);
    }, 2000);
  }, []);

  return (
    <div
      style={{
        background: `url(${assets.uxui.intro})`,
        backgroundPosition: "50.5% 0%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100svh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div className="flex flex-col h-screen">
        <div className="flex justify-center items-center w-full leading-tight">
          <div className="relative z-[100]">
            <img
              src={assets.logos.fof}
              alt="ror"
              className="w-[200px] mt-6 fof-text-shadow pointer-events-none"
            />
          </div>
        </div>

        <div className="flex flex-grow"></div>
        <div
          className={`flex ${
            fadeout && "fade-out"
          } justify-center items-center z-[100]`}
        >
          <img
            src={assets.logos.begodsBlack}
            alt="logo"
            className="w-[65px] h-[75px] mb-6 begod-text-shadow pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default RoRIntro;
