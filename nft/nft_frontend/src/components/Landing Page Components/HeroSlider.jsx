import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function HeroSlider() {
  const images = [
    { src: "/Hero/img1.png", alt: "Image1" },
    { src: "/Hero/img2.png", alt: "Image2" },
    { src: "/Hero/img3.png", alt: "Image3" },
    { src: "/Hero/img4.png", alt: "Image4" },
    { src: "/Hero/img4.png", alt: "Image5" },
    { src: "/Hero/img3.png", alt: "Image6" },
    { src: "/Hero/img2.png", alt: "Image7" },
    { src: "/Hero/img1.png", alt: "Image8" },
  ];

  const [imagesPerSet, setImagesPerSet] = useState(4);

  useEffect(() => {
    const updateImagesPerSet = () => {
      if (window.innerWidth >= 1280) {
        setImagesPerSet(4);
      } else if (window.innerWidth >= 650) {
        setImagesPerSet(2);
      } else {
        setImagesPerSet(1);
      }
    };

    updateImagesPerSet();
    window.addEventListener("resize", updateImagesPerSet);
    return () => window.removeEventListener("resize", updateImagesPerSet);
  }, []);

  const totalSets = Math.ceil(images.length / imagesPerSet);

  const getImageSet = (setIndex) => {
    const startIndex = setIndex * imagesPerSet;
    return images.slice(startIndex, startIndex + imagesPerSet);
  };

  const [loaded, setLoaded] = useState(Array(images.length).fill(false));

  const handleImageLoad = (index) => {
    setLoaded((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="relative mySwiper"
      >
        {Array.from({ length: totalSets }).map((_, setIndex) => (
          <SwiperSlide key={setIndex}>
            <div className="flex w-full h-full">
              {getImageSet(setIndex).map((image, index) => {
                const globalIndex = setIndex * imagesPerSet + index;
                return (
                  <div
                    key={index}
                    className={`w-full h-[100vh] ${
                      imagesPerSet === 4
                        ? "xl:w-1/4"
                        : imagesPerSet === 2
                        ? "md:w-1/2"
                        : "w-full"
                    }`}
                  >
                    {!loaded[globalIndex] && (
                      <div className="w-full h-full bg-gray-200 flex justify-center items-center">
                        <span>Loading...</span>
                      </div>
                    )}
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`object-cover w-full h-full ${
                        loaded[globalIndex] ? "block" : "hidden"
                      }`}
                      onLoad={() => handleImageLoad(globalIndex)}
                    />
                  </div>
                );
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
  