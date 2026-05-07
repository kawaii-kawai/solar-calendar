import type { Sekki } from "../types/sekki";
import { polarToCartesian } from "../utils/geometry";

interface Props {
  sekki: Sekki[];
  radius: number;
  activeName?: string;
  activeLongitude?: number;
}

export default function SekkiLabels({
  sekki,
  radius,
  activeName,
  activeLongitude,
}: Props) {
  const hasActive = Boolean(activeName);

  return (
    <>
      {sekki.map((s) => {
        const dateText = s.datetime
          ? s.datetime.slice(5, 10).replace("-", "/")
          : "--/--";
        const pos = polarToCartesian(200, 200, radius, s.solar_longitude);

        const isActive = s.name_ja === activeName;
        let isNeighbor = false;

        if (hasActive && !isActive && activeLongitude !== undefined) {
          const raw = Math.abs(s.solar_longitude - activeLongitude);
          const diff = Math.min(raw, 360 - raw);
          isNeighbor = diff <= 20;
        }

        const labelPos = isActive ? { x: 200, y: 34 } : { x: pos.x, y: pos.y };

        return (
          <g
            key={`${s.name_ja}-${s.datetime}`}
            className={`sekki-item${isActive ? " is-active" : ""}${isNeighbor ? " is-neighbor" : ""}`}
          >
            <text
              x={labelPos.x}
              y={labelPos.y - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              className="sekki-label"
            >
              {s.name_ja}
            </text>
            <text
              x={labelPos.x}
              y={labelPos.y + 8}
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