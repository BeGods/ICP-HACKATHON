import { useState } from "react";
import assets from "../../../assets/assets.json";
import "../../../styles/load.carousel.scss";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Launcher({ handleClick }) {
  const [activeIndex, setActiveIndex] = useState(7);
  const navigate = useNavigate();

  const sections = [
    {
      code: "fof",
      image: assets.uxui.intro,
      position: "50.5% 0%",
    },
    {
      code: "dod",
      image: "/assets/1280px-dod.loading.png",
      position: "45.75% 0%",
    },
    {
      code: "ror",
      image: assets.uxui.rorspash,
      position: "50.25% 0%",
    },
    {
      code: "fof",
      image: assets.uxui.intro,
      position: "50.5% 0%",
    },
    {
      code: "dod",
      image: "/assets/1280px-dod.loading.png",
      position: "45.75% 0%",
    },
    {
      code: "ror",
      image: assets.uxui.rorspash,
      position: "50.25% 0%",
    },
    {
      code: "fof",
      image: assets.uxui.intro,
      position: "50.5% 0%",
    },
    {
      code: "dod",
      image: "/assets/1280px-dod.loading.png",
      position: "45.75% 0%",
    },
    {
      code: "ror",
      image: assets.uxui.rorspash,
      position: "50.25% 0%",
    },
    {
      code: "fof",
      image: assets.uxui.intro,
      position: "50.5% 0%",
    },
    {
      code: "dod",
      image: "/assets/1280px-dod.loading.png",
      position: "45.75% 0%",
    },
    {
      code: "ror",
      image: assets.uxui.rorspash,
      position: "50.25% 0%",
    },
    {
      code: "fof",
      image: assets.uxui.intro,
      position: "50.5% 0%",
    },
    {
      code: "dod",
      image: "/assets/1280px-dod.loading.png",
      position: "45.75% 0%",
    },
    {
      code: "ror",
      image: assets.uxui.rorspash,
      position: "50.25% 0%",
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % sections.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + sections.length) % sections.length);
  };

  return (
    <div
      className="carousel-container bg-black"
      style={{ height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)` }}
    >
      <div
        className="carousel-track"
        style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
      >
        {sections.map((background, index) => (
          <div
            key={index}
            className="carousel-slide"
            style={{
              backgroundImage: `url(${background.image})`,
              backgroundPosition: background.position,
            }}
          >
            <div className="absolute  fade-in-intro flex justify-center items-center w-full">
              <div
                className="flex flex-col"
                style={{
                  height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
                }}
              >
                <div className="flex justify-center items-center w-full leading-tight">
                  <div className="relative z-[100]">
                    <img
                      src={assets.logos[background.code]}
                      alt="fof"
                      className="w-[200px] mt-6 fof-text-shadow pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex flex-grow justify-center items-center">
                  {background.code !== "dod" && (
                    <div
                      onClick={() => {
                        navigate(`/${background.code}`);
                      }}
                      className="p-6 bg-white rounded-full shadow-2xl"
                    >
                      <Play size={"10vw"} fill="black" />
                    </div>
                  )}
                </div>
                <div className={`flex justify-center items-center z-[100]`}>
                  <img
                    src={assets.logos.begodsBlack}
                    alt="logo"
                    className="w-[65px] h-[75px] mb-6 begod-text-shadow pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="prev" onClick={prevSlide}>
        <ChevronLeft strokeWidth={"2px"} size={30} color="white" />
      </button>
      <button className="next" onClick={nextSlide}>
        <ChevronRight strokeWidth={"2px"} size={30} color="white" />
      </button>
    </div>
  );
}
