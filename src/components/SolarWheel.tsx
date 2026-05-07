import { useEffect, useState } from "react";

import Orbit from "./Orbit";
import Sun from "./Sun";
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
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#ffd27d" stopOpacity="1" />
          <stop offset="60%" stopColor="#ffae40" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff8a00" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={400} height={400} fill="url(#sky)" />

      {stars.map(([x, y, r], index) => (
        <circle key={index} cx={x} cy={y} r={r} className="star" />
      ))}

      <circle cx={200} cy={200} r={80} fill="url(#sunGlow)" />

      <Orbit radius={orbitRadius} />
      <SekkiLabels sekki={displaySekki} radius={orbitRadius} />
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
      <text
        x={200}
        y={206}
        textAnchor="middle"
        dominantBaseline="middle"
        className="year-label"
      >
        {currentYear}
      </text>
      <Earth angle={wheel.angle} radius={orbitRadius} />
      <Sun />
    </svg>
  );
}