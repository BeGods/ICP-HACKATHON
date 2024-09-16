import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import useImage from "use-image";

const JigsawImage = ({ imageUrl, activeParts }) => {
  const [image] = useImage(imageUrl);
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const gap = 1;

  // We cant set the h & w on Stage to 100% it only takes px values so we have to
  // find the parent container's w and h and then manually set those !
  useEffect(() => {
    if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight,
      });
    }
  }, []);

  const numCols = 3;
  const numRows = 4;
  const cellWidth = (dimensions.width - (numCols - 1) * gap) / numCols;
  const cellHeight = (dimensions.height - (numRows - 1) * gap) / numRows;

  const pieces = Array.from({ length: numRows * numCols });

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
      ref={divRef}
      style={{
        position: "relative",
        width: "71vw",
        height: "53.5vh",
        overflow: "hidden",
        borderRadius: "16px",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundImage: `url(${imageUrl})`,
      }}
      className="jigsaw"
    >
      <Stage
        width={dimensions.width}
        height={dimensions.height}
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
