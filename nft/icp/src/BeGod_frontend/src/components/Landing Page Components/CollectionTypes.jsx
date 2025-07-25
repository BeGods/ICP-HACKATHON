import React, { useState, useEffect } from "react";

const CollectionTypes = () => {
  const images = [
    {
      img: "/image/image 18.png",
      h: "Lorem ipsum",
      p: "Lorem ipsum dolor sit amet consectetur. Suspendisse pretium vel elit pellentesque. Mattis varius urna scelerisque cum mattis vel.",
      type: "Norse",
    },
    {
      img: "/image/image 20.png",
      h: "Lorem ipsum",
      p: "Lorem ipsum dolor sit amet consectetur. Suspendisse pretium vel elit pellentesque. Mattis varius urna scelerisque cum mattis vel.",
      type: "Norse",
    },
    {
      img: "/image/image 23.png",
      h: "Lorem ipsum",
      p: "Lorem ipsum dolor sit amet consectetur. Suspendisse pretium vel elit pellentesque. Mattis varius urna scelerisque cum mattis vel.",
      type: "Norse",
    },
    {
      img: "/image/image 25.png",
      h: "Lorem ipsum",
      p: "Lorem ipsum dolor sit amet consectetur. Suspendisse pretium vel elit pellentesque. Mattis varius urna scelerisque cum mattis vel.",
      type: "Norse",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (hover) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [hover, images.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      style={{ fontFamily: "QuickSand", backgroundColor: "#0d0d0d" }}
      className="flex justify-center items-center mt-12 relative h-screen w-[100%]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="h-full w-full md:w-[60%] md:-ml-[40%] flex items-center">
        <img
          src={images[currentIndex].img}
          alt=""
          className="h-auto max-h-[70vh] w-full"
        />
      </div>
      <div className="absolute top-0 right-0 bottom-0 flex flex-col justify-center items-end sm:items-start sm:right-32 sm:bottom-40 p-4 w-[80%] sm:w-1/2 text-white">
        <h1 className="text-[20px] sm:text-[30px] font-[400] leading-[40px] text-right sm:text-left">
          {images[currentIndex].h}
        </h1>
        <p className="w-full md:w-[57%] text-[15px] font-[400] leading-[20px] text-right sm:text-left">
          {images[currentIndex].p}
        </p>
        <button className="w-[50vw] sm:w-[30vw] md:w-[15vw] h-[4vh] border border-white mt-4">
          <span>{images[currentIndex].type} Collection</span>
        </button>
        {/* Dots Navigation */}
      <div className="absolute bottom-8 top-[65%] left-[20%] transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`block w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-500"
            }`}
          ></span>
        ))}
      </div>
      </div>
    </div>
  );
};

export default CollectionTypes;
