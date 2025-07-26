import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const images = [
  "/assets/explore/1.jpeg",
  "/assets/explore/2.jpeg",
  "/assets/explore/3.jpeg",
  "/assets/explore/4.jpeg",
  "/assets/explore/5.jpeg",
  "/assets/explore/6.jpeg",
  "/assets/explore/7.jpeg",
  "/assets/explore/8.jpeg",
];

const RandomBg = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentIndex(randomIndex);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          className="absolute w-full h-full object-cover"
          initial={{ opacity: 0.8, scale: 1.1, filter: "blur(0.5px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0.7, scale: 0.9, filter: "blur(2px)" }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>
    </div>
  );
};

export default RandomBg;
