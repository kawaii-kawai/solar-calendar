import { useEffect, useRef, useState } from "react";

import Orbit from "./Orbit";
import Earth from "./Earth";
import SekkiLabels from "./SekkiLabels";

import type { Sekki } from "../types/sekki";
import { loadSekki } from "../utils/sekki";

import { useWheelRotation } from "../hooks/useWheelRotation";

const SEKKI_ORDER: Array<Pick<Sekki, "name_ja" | "solar_longitude">> = [
  { name_ja: "春分", solar_longitude: 0 },
  { name_ja: "清明", solar_longitude: 15 },
  { name_ja: "穀雨", solar_longitude: 30 },
  { name_ja: "立夏", solar_longitude: 45 },
  { name_ja: "小満", solar_longitude: 60 },
  { name_ja: "芒種", solar_longitude: 75 },
  { name_ja: "夏至", solar_longitude: 90 },
  { name_ja: "小暑", solar_longitude: 105 },
  { name_ja: "大暑", solar_longitude: 120 },
  { name_ja: "立秋", solar_longitude: 135 },
  { name_ja: "処暑", solar_longitude: 150 },
  { name_ja: "白露", solar_longitude: 165 },
  { name_ja: "秋分", solar_longitude: 180 },
  { name_ja: "寒露", solar_longitude: 195 },
  { name_ja: "霜降", solar_longitude: 210 },
  { name_ja: "立冬", solar_longitude: 225 },
  { name_ja: "小雪", solar_longitude: 240 },
  { name_ja: "大雪", solar_longitude: 255 },
  { name_ja: "冬至", solar_longitude: 270 },
  { name_ja: "小寒", solar_longitude: 285 },
  { name_ja: "大寒", solar_longitude: 300 },
  { name_ja: "立春", solar_longitude: 315 },
  { name_ja: "雨水", solar_longitude: 330 },
  { name_ja: "啓蟄", solar_longitude: 345 },
];

const SEKKI_DESC: Record<string, string> = {
  春分: "昼夜がほぼ等しい",
  清明: "草木が清らかに",
  穀雨: "恵みの雨が降る",
  立夏: "夏の気配が立つ",
  小満: "草木が満ち始める",
  芒種: "種を蒔くころ",
  夏至: "一年で昼が最長",
  小暑: "暑さが増す",
  大暑: "暑さが極まる",
  立秋: "秋の気配が立つ",
  処暑: "暑さが収まる",
  白露: "露が白く光る",
  秋分: "昼夜がほぼ等しい",
  寒露: "露が冷たくなる",
  霜降: "霜が降り始める",
  立冬: "冬の気配が立つ",
  小雪: "雪が舞い始める",
  大雪: "雪が本格化する",
  冬至: "一年で夜が最長",
  小寒: "寒さが増す",
  大寒: "寒さが極まる",
  立春: "春の気配が立つ",
  雨水: "雪が雨に変わる",
  啓蟄: "虫が動き始める",
};

export default function SolarWheel() {
  const [sekki, setSekki] = useState<Sekki[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string>("");
  const defaulted = useRef(false);

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
  const yearShift = 285;

  useEffect(() => {
    if (defaulted.current) return;
    if (!years.length) return;
    const targetIndex = years.indexOf(2026);
    if (targetIndex < 0) return;
    wheel.setAngle(targetIndex * 360 + yearShift);
    defaulted.current = true;
  }, [years, yearShift, wheel]);

  const rotationIndex = Math.floor((wheel.angle - yearShift) / 360);
  const yearIndex = years.length
    ? ((rotationIndex % years.length) + years.length) % years.length
    : 0;
  const currentYear = years[yearIndex] ?? 2000;
  const currentByName = new Map(
    (grouped.get(currentYear) ?? []).map((item) => [item.name_ja, item])
  );

  const byName = new Map<string, Array<{ year: number; datetime: string }>>();
  for (const item of sekki) {
    const year = Number(item.datetime.slice(0, 4));
    if (!Number.isFinite(year)) continue;
    const list = byName.get(item.name_ja) ?? [];
    list.push({ year, datetime: item.datetime });
    byName.set(item.name_ja, list);
  }

  for (const list of byName.values()) {
    list.sort((a, b) => a.year - b.year);
  }

  function fallbackDate(name: string): string {
    const list = byName.get(name);
    if (!list || list.length === 0) return "";

    let best = list[0];
    let bestDiff = Math.abs(best.year - currentYear);
    for (const item of list) {
      const diff = Math.abs(item.year - currentYear);
      if (diff < bestDiff) {
        best = item;
        bestDiff = diff;
      }
    }
    return best.datetime;
  }

  const displaySekki = SEKKI_ORDER.map((entry) => {
    const current = currentByName.get(entry.name_ja);
    const datetime = current ? current.datetime : fallbackDate(entry.name_ja);
    return {
      name_ja: entry.name_ja,
      solar_longitude: entry.solar_longitude,
      datetime,
    };
  });

  const orbitRadius = 150;
  const earthAngle = ((wheel.angle % 360) + 360) % 360;
  let activeName: string | undefined;
  let activeItem: Sekki | undefined;
  let activeLongitude: number | undefined;
  let bestDiff = Number.POSITIVE_INFINITY;

  for (const s of displaySekki) {
    const raw = Math.abs(s.solar_longitude - earthAngle);
    const diff = Math.min(raw, 360 - raw);
    if (diff < bestDiff) {
      bestDiff = diff;
      activeName = s.name_ja;
      activeItem = s;
      activeLongitude = s.solar_longitude;
    }
  }

  const highlight = bestDiff <= 10 ? activeName : undefined;
  const highlightLongitude = highlight ? activeLongitude : undefined;
  const highlightYear = activeItem?.datetime.slice(0, 4) ?? "----";
  const highlightDate = activeItem?.datetime.slice(5, 10).replace("-", "/") ?? "--/--";
  const highlightDesc = activeName ? SEKKI_DESC[activeName] ?? "" : "";

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
        activeLongitude={highlightLongitude}
      />
      {highlight && (
        <g className="highlight-panel">
          <rect x={32} y={-118} width={336} height={100} rx={18} />
          <text x={56} y={-78} textAnchor="start" className="highlight-name">
            {highlight}
          </text>
          <text x={210} y={-80} textAnchor="start" className="highlight-meta">
            <tspan x={210}>{highlightYear}年 {highlightDate}</tspan>
            <tspan x={210} dy={22} className="highlight-desc">
              {highlightDesc}
            </tspan>
          </text>
        </g>
      )}
      <circle cx={200} cy={200} r={60} fill="url(#sunBack)" className="sun-back" />
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