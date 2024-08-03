import React from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import useImage from "use-image";

const JigsawImage = ({ imageUrl, faith }) => {
  const [image] = useImage(imageUrl);

  const numCols = 3;
  const numRows = 4;
  const gap = 1; // Gap between pieces
  const gridWidth = 295;
  const gridHeight = 410;
  const cellWidth = (gridWidth - (numCols - 1) * gap) / numCols;
  const cellHeight = (gridHeight - (numRows - 1) * gap) / numRows;

  const pieces = Array.from({ length: numRows * numCols });

  // Predefined active parts (indices you want to render as active)
  const activeParts = [0, 1, 2, 3, 4, 5, 6, 7]; // Example indices that are active

  const getPieceProps = (index) => {
    const row = Math.floor(index / numCols);
    const col = index % numCols;
    return {
      x: col * (cellWidth + gap),
      y: row * (cellHeight + gap),
      width: cellWidth,
      height: cellHeight,
      cropX: col * (image?.width / numCols),
      cropY: row * (image?.height / numRows),
      cropWidth: image?.width / numCols,
      cropHeight: image?.height / numRows,
    };
  };

  return (
    <div
      style={{
        position: "relative",
        width: gridWidth,
        height: gridHeight,
        overflow: "hidden",
        borderRadius: "16px",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundImage: "url(/cards/celtic.quest.A06_on.png)",
      }}
      className="jigsaw"
    >
      <Stage
        width={gridWidth}
        height={gridHeight}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <Layer>
          {pieces.map((_, index) => {
            const { x, y, width, height, cropX, cropY, cropWidth, cropHeight } =
              getPieceProps(index);

            return activeParts.includes(index) ? (
              <KonvaImage
                key={index}
                image={image}
                x={x}
                y={y}
                width={width}
                height={height}
                crop={{
                  x: cropX,
                  y: cropY,
                  width: cropWidth,
                  height: cropHeight,
                }}
              />
            ) : (
              <Rect
                key={index}
                x={x}
                y={y}
                width={width}
                height={height}
                fill="transparent"
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default JigsawImage;
