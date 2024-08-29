import React, { useState, useEffect } from 'react';

const HeroSlider = () => {
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

  const [currentIndex, setCurrentIndex] = useState(0);
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

  useEffect(() => {
    // Set up interval for automatic sliding
    const interval = setInterval(() => {
      // Update currentIndex to the next set of images
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSets);
    }, 2000); // 2-second interval

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [totalSets]);

  // Function to get the current set of images to display
  const getCurrentSet = () => {
    // Calculate starting index for the current set
    const startIndex = currentIndex * imagesPerSet;
    // Slice array to get imagesPerSet images from starting index
    return images.slice(startIndex, startIndex + imagesPerSet);
  };

  const currentSet = getCurrentSet();

  return (
    <div className="relative w-full flex h-full ">
      {currentSet.map((image, index) => (
        <div
          key={index}
          className={`w-full h-[120vh] ${
            imagesPerSet === 4 ? 'xl:w-1/4' : imagesPerSet === 3 ? 'md:w-1/3' : 'w-full'
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
  );
};

export default HeroSlider;
