import confetti from "canvas-confetti";

export const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const showSnow = (stopRef) => {
  const duration = 20 * 1000;
  const animationEnd = Date.now() + duration;
  let skew = 1;

  const frame = () => {
    const timeLeft = animationEnd - Date.now();
    const ticks = Math.max(1, 150 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        y: Math.random() * skew - 0.2,
      },
      colors: ["#ffffff"],
      shapes: ["circle"],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    });

    if (timeLeft > 0 && !stopRef.current) {
      stopRef.current = requestAnimationFrame(frame);
    }
  };

  stopRef.current = requestAnimationFrame(frame);
};
