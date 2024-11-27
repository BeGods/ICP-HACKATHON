import React, { useState, useEffect } from "react";
import assets from "../../assets/assets.json";

const LoadRoll = () => {
  const images = [
    assets.symbols.greek,
    assets.symbols.celtic,
    assets.symbols.norse,
    assets.symbols.egyptian,
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000);
    return () => clearInterval(autoSlide);
  }, []);

  return (
    <div className="relative bg-black h-[20vh] w-full flex justify-center items-center overflow-hidden">
      <div className="carousel-load transition-all duration-500 flex justify-center items-center">
        {images.map((src, index) => {
          let position = "behind";

          if (index === currentIndex) {
            position = "active";
          } else if (
            index ===
            (currentIndex - 1 + images.length) % images.length
          ) {
            position = "previous";
          } else if (index === (currentIndex + 1) % images.length) {
            position = "next";
          }

          return (
            <img
              key={index}
              src={src}
              alt={`Slide ${index}`}
              className={`carousel-load__item ${position}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LoadRoll;
