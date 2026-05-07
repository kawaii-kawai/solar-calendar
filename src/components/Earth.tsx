import { polarToCartesian } from "../utils/geometry";

interface Props {
  angle: number;
}

export default function Earth({ angle }: Props) {
  const pos = polarToCartesian(200, 200, 140, angle);

  return (
    <circle
      cx={pos.x}
      cy={pos.y}
      r={12}
      className="earth"
    />
  );
}