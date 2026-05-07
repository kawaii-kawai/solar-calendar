import { polarToCartesian } from "../utils/geometry";

interface Props {
  angle: number;
  radius: number;
  isDragging: boolean;
}

export default function Earth({ angle, radius, isDragging }: Props) {
  const pos = polarToCartesian(200, 200, radius, angle);

  return (
    <g>
      {isDragging && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={24}
          className="earth-halo"
        />
      )}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={16}
        className="earth"
      />
    </g>
  );
}