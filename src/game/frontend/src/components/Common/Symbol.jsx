import { useStore } from "../../store/useStore";

const Symbol = ({ myth, isCard, showClaimEffect }) => {
  const assets = useStore((s) => s.assets);

  return (
    <div
      className={`relative  select-none pointer-events-none  flex justify-center items-center ${
        isCard == 1
          ? "h-symbol-secondary w-symbol-secondary"
          : isCard === 2
          ? "h-symbol-primary w-symbol-primary"
          : "h-[10rem] w-[10rem]"
      } bg-black border border-white rounded-full outline-[2px] transition-all duration-1000  z-50 ${
        showClaimEffect ? `glow-tap-${myth}` : `glow-symbol-${myth}`
      }`}
    >
      <div className={`flex justify-center items-center absolute z-10  `}>
        <div className={`w-[65%] h-[65%] glow-symbol-${myth}`}>
          <img
            src={assets.uxui.baseOrb}
            alt="orb"
            className={`w-full h-full filter-orbs-${myth} `}
          />
        </div>
      </div>
      <img
        src={assets.symbols[myth]}
        alt="symbol"
        className="h-[100%] w-[100%] absolute z-20"
      />
    </div>
  );
};

export default Symbol;
