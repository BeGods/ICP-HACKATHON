import confetti from "canvas-confetti";
import React, { useState } from "react";
import ScratchCard from "react-scratchcard-v2";

const Scratch = ({ handleComplete, item }) => {
  const [showEffect, setShowEffect] = useState(false);

  return (
    <div>
      <ScratchCard
        width={320}
        height={320}
        finishPercent={35}
        brushSize={25}
        image={
          "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSS9fVN-NoYBI3Uw_cH9i2tOCmV1QSxPISStCDk3kMiMhmUr1Xh"
        }
        onComplete={() => {
          setShowEffect(true);
          confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.7 },
          });
          setTimeout(() => {
            setShowEffect(false);
          }, 1000);
          handleComplete();
        }}
      >
        <div
          className={`relative h-[320px] w-[320px] flex justify-center items-center  overflow-hidden ${
            showEffect && "scale-125"
          } transition-all duration-1000`}
        >
          <div
            className={`h-[240px] w-[240px]`}
            style={{
              backgroundImage: `url(/assets/ror-cards/240px-${item}.png)`,
              backgroundSize: "cover",
              backgroundPosition: "100% 20%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </ScratchCard>
    </div>
  );
};

export default Scratch;
