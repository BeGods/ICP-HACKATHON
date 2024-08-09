import React from "react";

const ProgressBarSVG = ({ value, max }) => {
  const getColor = (pathIndex) => {
    const segmentStart = (pathIndex - 1) * (max / 4);
    const segmentEnd = pathIndex * (max / 4);

    if (value >= segmentEnd) {
      // Full color for completed segments
      return `rgba(76, 175, 80, 1)`; // Green
    } else if (value > segmentStart) {
      // Calculate the opacity based on how much of the segment is filled
      const segmentProgress = (value - segmentStart) / (max / 4);
      return `rgba(76, 175, 80, ${segmentProgress})`;
    } else {
      // Fade color for segments not yet reached
      return `rgba(76, 175, 80, 0.2)`;
    }
  };

  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      width="194"
      height="194"
    >
      <path
        d="M313.18,200.4l14.49,18.54c-65.71,57.38-108.4,140.44-112.43,233.54l-55.51-6.79c17.76-100.45,74.23-187.53,153.45-245.29Z"
        fill={getColor(1)}
      />
      <path
        d="M576,127.79v11.5c-10.49-1.01-21.11-1.53-31.86-1.53-68.5,0-132.12,20.92-184.81,56.73l-12.53-16.02c57.13-33.22,123.53-52.23,194.37-52.23,11.74,0,23.35.52,34.83,1.55Z"
        fill={getColor(2)}
      />
      <path
        d="M313.76,702.16l-72.47,56.67c-54.69-66.78-87.5-152.17-87.5-245.22,0-9.49.34-18.9,1.02-28.22l61.12,7.48c6.36,81.78,42.61,155.18,97.83,209.29Z"
        fill={getColor(3)}
      />
      <path
        d="M576,794.65v104.78c-11.48,1.02-23.09,1.54-34.83,1.54-106.46,0-202.89-42.94-272.91-112.46l76.32-59.68c55.36,42.26,124.53,67.36,199.56,67.36,10.75,0,21.37-.52,31.86-1.54Z"
        fill={getColor(4)}
      />
    </svg>
  );
};

export default ProgressBarSVG;
