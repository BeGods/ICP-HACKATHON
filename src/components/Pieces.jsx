import React from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import useImage from "use-image";

const JigsawImage = ({ imageUrl, faith }) => {
  const [image] = useImage(imageUrl);

  const pieces = Array.from({ length: 12 }, (_, i) => i + 1);

  const getPieceProps = (index) => {
    // Calculate the position and size for each piece
    const pieceWidth = image ? image.width / 4 : 0;
    const pieceHeight = image ? image.height / 3 : 0;
    const x = (index % 4) * pieceWidth;
    const y = Math.floor(index / 4) * pieceHeight;

    return { x, y, width: pieceWidth, height: pieceHeight };
  };

  const containerWidth = 320;
  const containerHeight = 440;

  return (
    <div
      style={{
        position: "relative",
        width: containerWidth,
        height: containerHeight,
        overflow: "hidden",
        borderRadius: "16px",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to top, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))",
          zIndex: 1,
        }}
      />
      <Stage
        width={containerWidth}
        height={containerHeight}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
        }}
      >
        <Layer>
          {pieces.map((piece, index) => {
            const { x, y, width, height } = getPieceProps(index);
            return index < 11 ? (
              <KonvaImage
                key={index}
                image={image}
                x={x}
                y={y}
                width={width}
                height={height}
                crop={{ x, y, width, height }}
              />
            ) : (
              <Rect
                key={index}
                x={x}
                y={y}
                width={width}
                height={height}
                fill=""
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default JigsawImage;
