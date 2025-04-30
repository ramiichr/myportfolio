import { useState, useEffect } from "react";

interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculateMovement = (axis: "x" | "y", strength = 1) => {
    const windowCenter =
      axis === "x" ? window.innerWidth / 2 : window.innerHeight / 2;
    const mousePos = axis === "x" ? mousePosition.x : mousePosition.y;
    const offset = ((mousePos - windowCenter) / windowCenter) * strength;
    return offset;
  };

  return {
    mousePosition,
    calculateMovement,
  };
}
