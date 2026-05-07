import { useRef, useState } from "react";

export function useWheelRotation() {
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragging = useRef(false);
  const prevAngle = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const rafId = useRef<number | null>(null);

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
    setIsDragging(true);
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    const center = getCenter(e);
    prevAngle.current = getAngle(e, center.x, center.y);
    lastTime.current = performance.now();
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;

    const center = getCenter(e);
    const current = getAngle(e, center.x, center.y);

    let delta = current - prevAngle.current;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    const now = performance.now();
    const dt = Math.max(now - lastTime.current, 1);
    const deltaDeg = delta * 180 / Math.PI;
    velocity.current = deltaDeg / dt;
    setAngle((a) => a + deltaDeg);

    prevAngle.current = current;
    lastTime.current = now;
  }

  function onPointerUp() {
    dragging.current = false;
    setIsDragging(false);
    startInertia();
  }

  function onPointerLeave() {
    dragging.current = false;
    setIsDragging(false);
    startInertia();
  }

  function startInertia() {
    if (rafId.current !== null) return;

    const step = (time: number) => {
      const dt = Math.max(time - lastTime.current, 0);
      lastTime.current = time;

      const speed = velocity.current;
      if (Math.abs(speed) < 0.001) {
        velocity.current = 0;
        rafId.current = null;
        return;
      }

      setAngle((a) => a + speed * dt);
      velocity.current *= 0.9;
      rafId.current = requestAnimationFrame(step);
    };

    lastTime.current = performance.now();
    rafId.current = requestAnimationFrame(step);
  }

  return {
    angle,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
  };
}