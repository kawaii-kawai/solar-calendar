import { useEffect, useState } from "react";

import Orbit from "./Orbit";
import Earth from "./Earth";
import SekkiLabels from "./SekkiLabels";

import type { Sekki } from "../types/sekki";
import { loadSekki } from "../utils/sekki";

import { useWheelRotation } from "../hooks/useWheelRotation";

export default function SolarWheel() {
  const [sekki, setSekki] = useState<Sekki[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string>("");

  const wheel = useWheelRotation();

  useEffect(() => {
    loadSekki()
      .then((data) => {
        setSekki(data);
        setStatus("ready");
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to load";
        setError(message);
        setStatus("error");
      });
  }, []);

  const stars = [
    [34, 48, 1.2],
    [310, 70, 1.6],
    [365, 120, 1.1],
    [70, 140, 1.4],
    [315, 170, 1.3],
    [40, 250, 1.5],
    [330, 285, 1.2],
    [120, 330, 1.1],
  ];

  const grouped = new Map<number, Sekki[]>();
  for (const item of sekki) {
    const year = Number(item.datetime.slice(0, 4));
    if (!Number.isFinite(year)) continue;
    const list = grouped.get(year) ?? [];
    list.push(item);
    grouped.set(year, list);
  }

  const years = Array.from(grouped.keys()).sort((a, b) => a - b);
  const rotationIndex = Math.trunc(wheel.angle / 360);
  const yearIndex = years.length
    ? ((rotationIndex % years.length) + years.length) % years.length
    : 0;
  const currentYear = years[yearIndex] ?? 2000;
  const displaySekki = (grouped.get(currentYear) ?? [])
    .slice()
    .sort((a, b) => a.solar_longitude - b.solar_longitude);

  const orbitRadius = 150;
  const earthAngle = ((wheel.angle % 360) + 360) % 360;
  let activeName: string | undefined;
  let bestDiff = Number.POSITIVE_INFINITY;

  for (const s of displaySekki) {
    const raw = Math.abs(s.solar_longitude - earthAngle);
    const diff = Math.min(raw, 360 - raw);
    if (diff < bestDiff) {
      bestDiff = diff;
      activeName = s.name_ja;
    }
  }

  const highlight = bestDiff <= 10 ? activeName : undefined;

  return (
    <svg
      className={`solar-wheel${wheel.isDragging ? " is-dragging" : ""}`}
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      onPointerDown={wheel.onPointerDown}
      onPointerMove={wheel.onPointerMove}
      onPointerUp={wheel.onPointerUp}
      onPointerLeave={wheel.onPointerLeave}
    >
      <defs>
        <radialGradient id="sky" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#152026" />
          <stop offset="55%" stopColor="#0a1117" />
          <stop offset="100%" stopColor="#05070a" />
        </radialGradient>
        <radialGradient id="sunBack" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffd27d" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#ffb24a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ff8a00" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={400} height={400} fill="url(#sky)" />

      {stars.map(([x, y, r], index) => (
        <circle key={index} cx={x} cy={y} r={r} className="star" />
      ))}

      <Orbit radius={orbitRadius} />
      {status !== "ready" && (
        <text
          x={200}
          y={200}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffb870"
          fontSize={14}
        >
          {status === "loading" ? "Loading sekki.json..." : error}
        </text>
      )}
      <Earth angle={wheel.angle} radius={orbitRadius} isDragging={wheel.isDragging} />
      <SekkiLabels
        sekki={displaySekki}
        radius={orbitRadius}
        activeName={highlight}
      />
      <circle cx={200} cy={200} r={40} fill="url(#sunBack)" className="sun-back" />
      <text
        x={200}
        y={200}
        textAnchor="middle"
        dominantBaseline="middle"
        className="year-label"
      >
        {currentYear}
      </text>
    </svg>
  );
}