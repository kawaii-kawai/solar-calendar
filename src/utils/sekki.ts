import type { Sekki } from "../types/sekki";

export async function loadSekki(): Promise<Sekki[]> {
  const base = import.meta.env.BASE_URL ?? "/";
  const url = `${base}data/sekki.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load sekki.json (${res.status})`);
  }
  return res.json();
}