import { useState } from "react";
import assets from "../assets/assets.json";
import "../styles/load.carousel.scss";
import { Play } from "lucide-react";

export default function LoadCarousel() {
  const [activeIndex, setActiveIndex] = useState(7);

  const sections = [
    assets.uxui.intro, // 1
    "/assets/1280px-dod.loading.png",
    assets.uxui.rorspash,
    assets.uxui.intro, // 2
    "/assets/1280px-dod.loading.png",
    assets.uxui.rorspash,
    assets.uxui.intro, // 3
    "/assets/1280px-dod.loading.png",
    assets.uxui.rorspash,
    assets.uxui.intro, // 4
    "/assets/1280px-dod.loading.png",
    assets.uxui.rorspash,
    assets.uxui.intro, // 5
    "/assets/1280px-dod.loading.png",
    assets.uxui.rorspash,
  ];

  const positions = [
    "50.5% 0%", // 1
    "45.75% 0%",
    "50.25% 0%",
    "50.5% 0%", // 2
    "45.75% 0%",
    "50.25% 0%",
    "50.5% 0%", // 3
    "45.75% 0%",
    "50.25% 0%",
    "50.5% 0%", // 4
    "45.75% 0%",
    "50.25% 0%",
    "50.5% 0%", // 5
    "45.75% 0%",
    "50.25% 0%",
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % sections.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + sections.length) % sections.length);
  };

  return (
    <div
      className="carousel-container"
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
              backgroundImage: `url(${background})`,
              backgroundPosition: positions[index],
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
                      src={assets.logos.fof}
                      alt="fof"
                      className="w-[200px] mt-6 fof-text-shadow pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex flex-grow justify-center items-center">
                  <div className="p-6 bg-white rounded-full shadow-2xl">
                    <Play size={"10vw"} fill="black" />
                  </div>
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
        &#x276C;
      </button>
      <button className="next" onClick={nextSlide}>
        &#x276D;
      </button>
    </div>
  );
}
