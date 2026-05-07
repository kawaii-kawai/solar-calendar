import type { Sekki } from "../types/sekki";
import { polarToCartesian } from "../utils/geometry";

interface Props {
  sekki: Sekki[];
  radius: number;
  activeName?: string;
}

export default function SekkiLabels({ sekki, radius, activeName }: Props) {
  const hasActive = Boolean(activeName);

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

        const isActive = s.name_ja === activeName;
        const isDim = hasActive && !isActive;

        return (
          <g
            key={`${s.name_ja}-${s.datetime}`}
            className={`sekki-item${isActive ? " is-active" : ""}${isDim ? " is-dim" : ""}`}
          >
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