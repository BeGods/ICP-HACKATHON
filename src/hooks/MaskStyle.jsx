import { useMemo } from "react";

export const useMaskStyle = (itemId, length, hiddenFragmentIds = []) => {
  const maskElement = useMemo(() => {
    if (length === 1 || hiddenFragmentIds.length === length) return <></>;

    const getLinearGradient = () => {
      if (length === 2) {
        const gradients = [];
        if (!hiddenFragmentIds.includes(0)) {
          gradients.push(
            "transparent 0%, transparent 50%, black 0%, black 50%"
          );
        }
        if (!hiddenFragmentIds.includes(1)) {
          gradients.push(
            "black 0%, black 50%, transparent 50%, transparent 100%"
          );
        }
        return `to right, ${gradients.join(", ")}`;
      }

      if (length === 3) {
        const gradients = [];
        if (!hiddenFragmentIds.includes(0)) {
          gradients.push(
            "transparent 0%, transparent 70%, black 70%, black 100%"
          );
        }
        if (!hiddenFragmentIds.includes(1)) {
          gradients.push(
            "black 0%, black 30%, transparent 30%, transparent 70%, black 70%, black 100%"
          );
        }
        if (!hiddenFragmentIds.includes(2)) {
          gradients.push(
            "black 0%, black 30%, transparent 30%, transparent 100%"
          );
        }
        return `to right, ${gradients.join(", ")}`;
      }

      if (length === 4) {
        const size = 25;
        const gradients = [];
        for (let i = 0; i < 4; i++) {
          if (!hiddenFragmentIds.includes(i)) {
            const start = i * size;
            const end = start + size;
            gradients.push(
              `transparent 0%, transparent ${start}%, black ${start}%, black ${end}%, transparent ${end}%, transparent 100%`
            );
          }
        }
        return `to right, ${gradients.join(", ")}`;
      }

      return "to right, black 0%, black 100%";
    };

    const gradient = getLinearGradient();
    const maskUrl = `url(/assets/ror-cards/240px-${itemId}_on.png)`;

    return (
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundColor: "#C7C8CC",
          mixBlendMode: "color",
          WebkitMaskImage: `linear-gradient(${gradient}), ${maskUrl}`,
          WebkitMaskComposite: "destination-in",
          WebkitMaskRepeat: "no-repeat, no-repeat",
          WebkitMaskSize: "100% 100%, contain",
          WebkitMaskPosition: "center, center",
          maskImage: `linear-gradient(${gradient}), ${maskUrl}`,
          maskComposite: "intersect",
          maskRepeat: "no-repeat, no-repeat",
          maskSize: "100% 100%, contain",
          maskPosition: "center, center",
        }}
      />
    );
  }, [itemId, length, hiddenFragmentIds]);

  return maskElement;
};
