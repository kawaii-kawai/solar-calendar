import type { Sekki } from "../types/sekki";
import { polarToCartesian } from "../utils/geometry";

interface Props {
  sekki: Sekki[];
  radius: number;
}

export default function SekkiLabels({ sekki, radius }: Props) {
  return (
    <>
      {sekki.map((s) => {
        const dateText = s.datetime
          ? s.datetime.slice(5, 10).replace("-", "/")
          : "--/--";
        const pos = polarToCartesian(
          200,
          200,
          radius,
          s.solar_longitude
        );

        return (
          <g key={`${s.name_ja}-${s.datetime}`}>
            <text
              x={pos.x}
              y={pos.y - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              className="sekki-label"
            >
              {s.name_ja}
            </text>
            <text
              x={pos.x}
              y={pos.y + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              className="sekki-date"
            >
              {dateText}
            </text>
          </g>
        );
      })}
    </>
  );
}