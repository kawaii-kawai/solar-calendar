import { polarToCartesian } from "../utils/geometry";

interface Props {
  angle: number;
  radius: number;
}

export default function Earth({ angle, radius }: Props) {
  const pos = polarToCartesian(200, 200, radius, angle);

  return (
    <circle
      cx={pos.x}
      cy={pos.y}
      r={16}
      className="earth"
    />
  );
}