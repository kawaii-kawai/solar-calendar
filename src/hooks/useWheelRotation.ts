import { useRef, useState } from "react";

export function useWheelRotation() {
  const [angle, setAngle] = useState(0);

  const dragging = useRef(false);
  const prevAngle = useRef(0);

  function getAngle(
    e: React.PointerEvent,
    centerX: number,
    centerY: number
  ) {
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    return Math.atan2(dy, dx);
  }

  function getCenter(e: React.PointerEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;

    const center = getCenter(e);
    prevAngle.current = getAngle(e, center.x, center.y);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;

    const center = getCenter(e);
    const current = getAngle(e, center.x, center.y);

    let delta = current - prevAngle.current;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    setAngle((a) => a + delta * 180 / Math.PI);

    prevAngle.current = current;
  }

  function onPointerUp() {
    dragging.current = false;
  }

  return {
    angle,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}