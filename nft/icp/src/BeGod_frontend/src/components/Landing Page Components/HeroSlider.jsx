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

  // Calculate total sets of images (each set contains 4 images)
  const totalSets = Math.ceil(images.length / 4);

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
    const startIndex = currentIndex * 4;
    // Slice array to get 4 images from starting index
    return images.slice(startIndex, startIndex + 4);
  };

  const currentSet = getCurrentSet();

  return (
    <div className="relative flex h-[100%]">
      {currentSet.map((image, index) => (
        <div className="w-1/4 h-[120vh]" key={index}>
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
