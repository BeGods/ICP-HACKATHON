import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import required modules
import { Pagination, Autoplay } from "swiper/modules";


export default function HeroSlider() {
  // Array of image objects
  const images = [
    { src: "/Hero/img1.png", alt: "Image1" },
    { src: "/Hero/img2.png", alt: "Image2" },
    { src: "/Hero/img3.png", alt: "Image3" },
    { src: "/Hero/img4.png", alt: "Image4" },
    { src: "/Hero/img4.png", alt: "Image5" },
    { src: "/Hero/img3.png", alt: "Image6" },
    { src: "/Hero/img2.png", alt: "Image7" },
    { src: "/Hero/img1.png", alt: "Image8" },
    // Add more images as needed
  ];

  const [imagesPerSet, setImagesPerSet] = useState(4); // Default to 4 images per set

  // Update the number of images per set based on screen size
  useEffect(() => {
    const updateImagesPerSet = () => {
      if (window.innerWidth >= 1280) { // xl and above
        setImagesPerSet(4);
      } else if (window.innerWidth >= 650) { // md and above
        setImagesPerSet(2);
      } else { // below md
        setImagesPerSet(1);
      }
    };

    // Initial call
    updateImagesPerSet();

    // Event listener for window resize
    window.addEventListener('resize', updateImagesPerSet);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', updateImagesPerSet);
  }, []);

  // Calculate total sets of images
  const totalSets = Math.ceil(images.length / imagesPerSet);

  // Function to get the set of images to display for each SwiperSlide
  const getImageSet = (setIndex) => {
    const startIndex = setIndex * imagesPerSet;
    return images.slice(startIndex, startIndex + imagesPerSet);
  };

  return (
    <>
      <Swiper
        slidesPerView={1} // Show one set per slide
        spaceBetween={0}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000, // 3-second interval for Swiper
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]} // Include Autoplay and Pagination modules
        className="relative mySwiper"
      >
        {/* Render each set of images as a separate SwiperSlide */}
        {Array.from({ length: totalSets }).map((_, setIndex) => (
          <SwiperSlide key={setIndex}>
            <div className="flex w-full h-full ">
              {getImageSet(setIndex).map((image, index) => (
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
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
