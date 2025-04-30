import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const colors = ["red", "green", "blue", "yellow", "purple", "orange"];

const FruitNinja = () => {
  const containerRef = useRef(null);
  const [fruits, setFruits] = useState([]);
  const [slashes, setSlashes] = useState([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const id = Date.now() + Math.random();
      const newFruit = {
        id,
        x: Math.random() * 80 + 10, // 10%-90% across width
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setFruits((prev) => [...prev, newFruit]);

      const fruitEl = document.getElementById(id);
      if (fruitEl) {
        animateFruit(fruitEl);
      }
    }, 1000);

    return () => clearInterval(spawnInterval);
  }, [fruits]);

  // Animate fruit going up and falling down
  const animateFruit = (el) => {
    const upDuration = 1; // seconds
    const downDuration = 2; // seconds

    gsap.fromTo(
      el,
      { y: "100%", opacity: 1, scale: 0.5 },
      { y: "30%", duration: upDuration, ease: "power2.out" }
    );

    gsap.to(el, {
      y: "120%",
      duration: downDuration,
      ease: "power2.in",
      delay: upDuration,
      onComplete: () => {
        setFruits((prev) => prev.filter((f) => f.id !== el.id));
      },
    });
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const prevPos = mousePos.current;
    mousePos.current = { x, y };

    // Draw slash line
    createSlash(prevPos.x, prevPos.y, x, y);

    fruits.forEach((fruit) => {
      const fruitEl = document.getElementById(fruit.id);
      if (fruitEl) {
        const fruitRect = fruitEl.getBoundingClientRect();
        const fruitCenter = {
          x: fruitRect.left + fruitRect.width / 2 - rect.left,
          y: fruitRect.top + fruitRect.height / 2 - rect.top,
        };
        const distance = Math.hypot(fruitCenter.x - x, fruitCenter.y - y);
        if (distance < 30) {
          burstFruit(fruit.id);
        }
      }
    });
  };

  const burstFruit = (id) => {
    const fruitEl = document.getElementById(id);
    if (fruitEl) {
      gsap.to(fruitEl, {
        scale: 2,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setFruits((prev) => prev.filter((f) => f.id !== id));
          alert("Sliced!");
        },
      });
    }
  };

  const createSlash = (x1, y1, x2, y2) => {
    const id = Date.now() + Math.random();
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    const distance = Math.hypot(x2 - x1, y2 - y1);

    const newSlash = {
      id,
      x: x1,
      y: y1,
      angle,
      distance,
    };

    setSlashes((prev) => [...prev, newSlash]);

    // Remove slash after short time
    setTimeout(() => {
      setSlashes((prev) => prev.filter((s) => s.id !== id));
    }, 200);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {fruits.map((fruit) => (
        <div
          key={fruit.id}
          id={fruit.id}
          className="absolute rounded-full"
          style={{
            width: 50,
            height: 50,
            backgroundColor: fruit.color,
            left: `${fruit.x}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {slashes.map((slash) => (
        <div
          key={slash.id}
          className="absolute bg-white"
          style={{
            height: 2,
            width: slash.distance,
            left: slash.x,
            top: slash.y,
            transform: `rotate(${slash.angle}deg)`,
            transformOrigin: "0 0",
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

export default FruitNinja;
