import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import useImage from "use-image";

const CanvasImage = ({ imageUrl, activeParts, handleClick, grid }) => {
  const [image] = useImage(imageUrl, "anonymous");
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [transparencyMap, setTransparencyMap] = useState([]);
  const gap = 1;

  const numCols = grid[0];
  const numRows = grid[1];

  useEffect(() => {
    if (divRef.current?.offsetWidth && divRef.current?.offsetHeight) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight,
      });
    }
  }, []);

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

  useEffect(() => {
    if (!image) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const pieceW = image.width / numCols;
    const pieceH = image.height / numRows;

    const map = [];

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        canvas.width = pieceW;
        canvas.height = pieceH;
        ctx.clearRect(0, 0, pieceW, pieceH);
        ctx.drawImage(
          image,
          col * pieceW,
          row * pieceH,
          pieceW,
          pieceH,
          0,
          0,
          pieceW,
          pieceH
        );

        const imageData = ctx.getImageData(0, 0, pieceW, pieceH);
        const alphaData = imageData.data.filter((_, i) => i % 4 === 3);
        const avgAlpha =
          alphaData.reduce((sum, alpha) => sum + alpha, 0) / alphaData.length;

        map.push(avgAlpha > 10);
      }
    }

    setTransparencyMap(map);
  }, [image, numCols, numRows]);

  return (
    <div
      ref={divRef}
      className="jigsaw w-full h-full"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundImage: `url(${imageUrl})`,
      }}
      onClick={handleClick}
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
            if (transparencyMap.length && !transparencyMap[index]) return null;

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

export default CanvasImage;
