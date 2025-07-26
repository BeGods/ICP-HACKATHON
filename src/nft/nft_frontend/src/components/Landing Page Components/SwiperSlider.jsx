import React, { useEffect, useState, useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import required modules
import { Pagination, Autoplay } from "swiper/modules";
import Navbar from "./Navbar";
import YellowButton from "../button/YellowButton";
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
  const paginationRef = useRef(null); // Ref for custom pagination

  // Update the number of images per set based on screen size
  useEffect(() => {
    const updateImagesPerSet = () => {
      if (window.innerWidth >= 1280) {
        // xl and above
        setImagesPerSet(4);
      } else if (window.innerWidth >= 650) {
        // md and above
        setImagesPerSet(2);
      } else {
        // below md
        setImagesPerSet(1);
      }
    };

    // Initial call
    updateImagesPerSet();

    // Event listener for window resize
    window.addEventListener("resize", updateImagesPerSet);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", updateImagesPerSet);
  }, []);

  // Calculate total sets of images
  const totalSets = Math.ceil(images.length / imagesPerSet);

  // Function to get the set of images to display for each SwiperSlide
  const getImageSet = (setIndex) => {
    const startIndex = setIndex * imagesPerSet;
    return images.slice(startIndex, startIndex + imagesPerSet);
  };

  return (
    <div className="relative w-full h-[120vh]">
      {/* Swiper with images */}
      <Swiper
        slidesPerView={1} // Show one set per slide
        spaceBetween={0}
        pagination={{
          el: paginationRef.current, // Use ref for custom pagination element
          clickable: true,
        }}
        autoplay={{
          delay: 3000, // 3-second interval for Swiper
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          // Re-assign pagination element dynamically
          if (swiper && paginationRef.current) {
            swiper.params.pagination.el = paginationRef.current;
            swiper.pagination.init();
            swiper.pagination.update();
          }
        }}
        modules={[Pagination, Autoplay]} // Include Autoplay and Pagination modules
        className="mySwiper"
      >
        {/* Render each set of images as a separate SwiperSlide */}
        {Array.from({ length: totalSets }).map((_, setIndex) => (
          <SwiperSlide key={setIndex}>
            <div className="relative w-full flex h-[120vh]">
              {getImageSet(setIndex).map((image, index) => (
                <div
                  key={index}
                  className={`w-full h-full ${
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
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
