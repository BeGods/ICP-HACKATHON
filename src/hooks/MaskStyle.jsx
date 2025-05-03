import { useMemo } from "react";

export const useMaskStyle = (itemId, length, hiddenFragmentIds = []) => {
  const maskElement = useMemo(() => {
    if (length === 1 || hiddenFragmentIds.length === length) return [];

    const getLinearGradient = () => {
      if (length === 2) {
        const gradients = [];
        if (!hiddenFragmentIds.includes(1)) {
          gradients.push(
            "transparent 0%, transparent 50%, black 0%, black 50%"
          );
        }
        if (!hiddenFragmentIds.includes(0)) {
          gradients.push(
            "black 0%, black 50%, transparent 50%, transparent 100%"
          );
        }
        return `to right, ${gradients.join(", ")}`;
      }

      return "to right, black 0%, black 100%";
    };

    const gradient = getLinearGradient();
    const onUrl = `https://media.publit.io/file/BeGods/items/240px-${itemId}.png`;

    return (
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#C7C8CC",
            mixBlendMode: "color",
            WebkitMaskImage: `linear-gradient(${gradient}), url(${onUrl})`,
            WebkitMaskComposite: "destination-in",
            WebkitMaskRepeat: "no-repeat, no-repeat",
            WebkitMaskSize: "100% 100%, contain",
            WebkitMaskPosition: "center, center",
            maskImage: `linear-gradient(${gradient}), url(${onUrl})`,
            maskComposite: "intersect",
            maskRepeat: "no-repeat, no-repeat",
            maskSize: "100% 100%, contain",
            maskPosition: "center, center",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `linear-gradient(${gradient})`,
            WebkitMaskComposite: "destination-out",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            WebkitMaskPosition: "center",
            maskImage: `linear-gradient(${gradient})`,
            maskComposite: "subtract",
            maskRepeat: "no-repeat",
            maskSize: "100% 100%",
            maskPosition: "center",
          }}
        >
          <img
            src={onUrl}
            alt="relic-colored"
            className="w-full h-full object-contain select-none"
          />
        </div>
      </div>
    );
  }, [itemId, length, hiddenFragmentIds]);

  return maskElement;
};
