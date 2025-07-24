import { useRef, useState } from "react";

const useDragAndDrop = ({ handleDropAction, dropDisableCondn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [scaleIcon, setScaleIcon] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const boxRefs = [useRef(null), useRef(null), useRef(null)];

  const handleTouchStart = (e, item) => {
    if (typeof dropDisableCondn == "function" && dropDisableCondn(item)) return;

    if (!isLoading) {
      e.target.setPointerCapture(e.pointerId);

      setDraggedItem(item);
      setDragging(true);
      setScaleIcon(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;

    setIsTouched(true);
    setScaleIcon(false);

    const touch = e;
    setCopyPosition({
      x: touch.clientX - 100,
      y: touch.clientY - 250,
    });
  };

  const handleTouchEnd = () => {
    if (!draggedItem) return;

    setDragging(false);
    setIsTouched(false);
    setScaleIcon(false);

    const itemBoxIndex = boxRefs.findIndex((ref) => {
      const dropZone = ref.current;
      if (!dropZone) return false;

      const dropZoneRect = dropZone.getBoundingClientRect();
      const toleranceX = dropZoneRect.width * 0.05;
      const toleranceY = dropZoneRect.height * 0.05;

      const adjustedDropZoneRect = {
        left: dropZoneRect.left - toleranceX,
        right: dropZoneRect.right + toleranceX,
        top: dropZoneRect.top - toleranceY,
        bottom: dropZoneRect.bottom + toleranceY,
      };

      const arbitaryCopyX = copyPosition.x + 20;
      const arbitaryCopyY = copyPosition.y + 150;

      const copyRect = {
        left: arbitaryCopyX,
        top: arbitaryCopyY,
        right: arbitaryCopyX + 100,
        bottom: arbitaryCopyY + 100,
      };

      const overlapX = Math.max(
        0,
        Math.min(copyRect.right, adjustedDropZoneRect.right) -
          Math.max(copyRect.left, adjustedDropZoneRect.left)
      );
      const overlapY = Math.max(
        0,
        Math.min(copyRect.bottom, adjustedDropZoneRect.bottom) -
          Math.max(copyRect.top, adjustedDropZoneRect.top)
      );

      const overlapArea = overlapX * overlapY;
      const overlapPercentage = (overlapArea / (100 * 100)) * 100;

      return overlapPercentage >= 20;
    });

    handleDropAction(itemBoxIndex);
    setDraggedItem(null);
  };

  return {
    boxRefs,
    copyPosition,
    setCopyPosition,
    dragging,
    setDragging,
    draggedItem,
    setDraggedItem,
    isLoading,
    setIsLoading,
    isTouched,
    setIsTouched,
    scaleIcon,
    setScaleIcon,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

export default useDragAndDrop;
