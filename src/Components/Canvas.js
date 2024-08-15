import { useEffect } from "react";
import { useOnDraw } from "./Hooks";

const Canvas = ({ width, height }) => {
  const { onMouseDown, setCanvasRef, onTouchStart } = useOnDraw(onDraw);

  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, "#000000", 5);
  }

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  useEffect(() => {
    const preventPullToRefresh = (e) => {
      e.preventDefault();
    };

    const canvas = document.getElementById("canvas");

    const addPreventDefault = () => {
      window.addEventListener("touchmove", preventPullToRefresh, {
        passive: false,
      });
    };

    const removePreventDefault = () => {
      window.removeEventListener("touchmove", preventPullToRefresh);
    };

    if (canvas) {
      canvas.addEventListener("touchstart", addPreventDefault);
      canvas.addEventListener("touchend", removePreventDefault);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("touchstart", addPreventDefault);
        canvas.removeEventListener("touchend", removePreventDefault);
      }
    };
  }, []);

  return (
    <canvas
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={canvasStyle}
      ref={setCanvasRef}
      id={"canvas"}
    />
  );
};

export default Canvas;

const canvasStyle = {
  border: "1px solid black",
  backgroundColor: "white",
};