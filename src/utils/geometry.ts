export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  deg: number
) {
  const rad = (deg - 90) * Math.PI / 180;

  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}